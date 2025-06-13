use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;
use aes::Aes256;
use cbc::cipher::{KeyIvInit, BlockDecryptMut};
use sha2::{Sha256, Digest};
use aes::cipher::generic_array::GenericArray;
use std::env;
use log::{info, error};
use tokio::fs;
use serde_json::json;
use serde::{Serialize, Deserialize};
use xml::reader::{EventReader, XmlEvent};
use std::io::BufReader;

// Rust structs mirroring the frontend interfaces
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct Question {
    pub text: String,
    pub options: Vec<String>,
    #[serde(rename = "correctAnswer")]
    pub correct_answer: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct QuizData {
    pub questions: Vec<Question>,
}

type Aes256Cbc = cbc::Decryptor<Aes256>;

#[tauri::command]
pub async fn decrypt_file(file_path: String) -> Result<String, String> {
    info!("Decrypting file: {}", file_path);
    if file_path.is_empty() {
        error!("File path is required for decryption.");
        return Err("File path is required.".into());
    }

    // Generate secret key using SHA-256
    let key = "iactive@2024";
    let mut hasher = Sha256::new();
    hasher.update(key.as_bytes());
    let secret_key = hasher.finalize();

    // Read the input file
    let mut input_file = File::open(&file_path).map_err(|e| {
        error!("Failed to open file {}: {}", file_path, e);
        format!("Failed to open file: {}", e)
    })?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data).map_err(|e| {
        error!("Failed to read file {}: {}", file_path, e);
        format!("Failed to read file: {}", e)
    })?;

    info!("File size: {} bytes", input_data.len());

    // Extract IV from the beginning of the encrypted data
    if input_data.len() < 16 {
        error!("Invalid encrypted file format: file too small ({} bytes)", input_data.len());
        return Err(format!("Invalid encrypted file format: file too small ({} bytes)", input_data.len()));
    }
    let (iv, ciphertext) = input_data.split_at(16);
    info!("IV: {:?}", iv);
    info!("Ciphertext length: {} bytes", ciphertext.len());

    // Create decipher
    let mut cipher = Aes256Cbc::new_from_slices(&secret_key, iv)
        .map_err(|e| {
            error!("Failed to create decipher: {:?}", e);
            format!("Failed to create decipher: {:?}", e)
        })?;

    // Decrypt the data
    let mut decrypted_data = Vec::new();
    for chunk in ciphertext.chunks_exact(16) {
        let mut block = GenericArray::clone_from_slice(chunk);
        cipher.decrypt_block_mut(&mut block);
        decrypted_data.extend_from_slice(&block);
    }

    // Handle any remaining bytes (should be padding)
    if !ciphertext.is_empty() && ciphertext.len() % 16 != 0 {
        let remaining = &ciphertext[ciphertext.len() - (ciphertext.len() % 16)..];
        if !remaining.is_empty() {
            let mut block = [0u8; 16];
            block[..remaining.len()].copy_from_slice(remaining);
            let mut block = GenericArray::from(block);
            cipher.decrypt_block_mut(&mut block);
            decrypted_data.extend_from_slice(&block[..remaining.len()]);
        }
    }

    info!("Decryption successful, writing {} bytes", decrypted_data.len());

    // Get the original filename
    let original_path = PathBuf::from(&file_path);
    let filename = original_path.file_name()
        .ok_or_else(|| {
            error!("Invalid file path: Could not extract filename from {}", file_path);
            "Invalid file path".to_string()
        })?
        .to_string_lossy();

    // Create temp file path
    let temp_dir = env::temp_dir();
    let temp_file_path = temp_dir.join(format!("decrypted_{}", filename));

    // Write the decrypted data to temp file
    let mut output_file = File::create(&temp_file_path).map_err(|e| {
        error!("Failed to create output file {}: {}", temp_file_path.display(), e);
        format!("Failed to create output file: {}", e)
    })?;
    output_file.write_all(&decrypted_data).map_err(|e| {
        error!("Failed to write decrypted data to {}: {}", temp_file_path.display(), e);
        format!("Failed to write decrypted data: {}", e)
    })?;

    info!("File decrypted successfully to: {}", temp_file_path.display());
    Ok(temp_file_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub async fn parse_xml_quiz(file_path: String) -> Result<serde_json::Value, String> {
    info!("Attempting to parse XML quiz from: {}", file_path);

    let contents = match fs::read_to_string(&file_path).await {
        Ok(content) => content,
        Err(e) => {
            let error_message = format!("Failed to read file {}: {}", file_path, e);
            error!("{}", error_message);
            return Err(error_message);
        }
    };

    let reader = EventReader::new(BufReader::new(contents.as_bytes()));
    let mut quiz_data = QuizData::default();
    let mut current_question = Question::default();
    let mut parsing_options = false;
    let mut current_element = String::new();

    for e in reader {
        match e {
            Ok(XmlEvent::StartElement { name, .. }) => {
                current_element = name.local_name;
                if current_element == "question" {
                    current_question = Question::default();
                } else if current_element == "options" {
                    parsing_options = true;
                }
            }
            Ok(XmlEvent::Characters(text)) => {
                match current_element.as_str() {
                    "text" => current_question.text = text,
                    "option" if parsing_options => {
                        if text != "-" {
                            current_question.options.push(text);
                        }
                    }
                    "correctAnswer" => current_question.correct_answer = text,
                    "description" => {
                        if text != "-" {
                            current_question.description = Some(text);
                        }
                    }
                    _ => (),
                }
            }
            Ok(XmlEvent::EndElement { name }) => {
                if name.local_name == "question" {
                    quiz_data.questions.push(current_question.clone());
                } else if name.local_name == "options" {
                    parsing_options = false;
                }
            }
            Err(e) => {
                error!("Error parsing XML: {}", e);
                return Err(format!("Error parsing XML: {}", e));
            }
            _ => (),
        }
    }

    info!("Successfully parsed XML quiz with {} questions.", quiz_data.questions.len());
    Ok(json!(quiz_data))
} 
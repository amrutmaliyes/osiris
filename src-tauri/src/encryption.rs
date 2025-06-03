use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;
use aes::Aes256;
use cbc::cipher::{KeyIvInit, BlockDecryptMut};
use sha2::{Sha256, Digest};
use aes::cipher::generic_array::GenericArray;
use std::env;

type Aes256Cbc = cbc::Decryptor<Aes256>;

#[tauri::command]
pub async fn decrypt_file(file_path: String) -> Result<String, String> {
    println!("Decrypting file: {}", file_path);
    if file_path.is_empty() {
        return Err("File path is required.".into());
    }

    // Generate secret key using SHA-256
    let key = "iactive@2024";
    let mut hasher = Sha256::new();
    hasher.update(key.as_bytes());
    let secret_key = hasher.finalize();

    // Read the input file
    let mut input_file = File::open(&file_path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data).map_err(|e| format!("Failed to read file: {}", e))?;

    println!("File size: {} bytes", input_data.len());

    // Extract IV from the beginning of the encrypted data
    if input_data.len() < 16 {
        return Err(format!("Invalid encrypted file format: file too small ({} bytes)", input_data.len()));
    }
    let (iv, ciphertext) = input_data.split_at(16);
    println!("IV: {:?}", iv);
    println!("Ciphertext length: {} bytes", ciphertext.len());

    // Create decipher
    let mut cipher = Aes256Cbc::new_from_slices(&secret_key, iv)
        .map_err(|e| format!("Failed to create decipher: {:?}", e))?;

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

    // Remove PKCS7 padding
    if let Some(&padding) = decrypted_data.last() {
        if padding as usize <= decrypted_data.len() {
            decrypted_data.truncate(decrypted_data.len() - padding as usize);
        }
    }

    println!("Decryption successful, writing {} bytes", decrypted_data.len());

    // Get the original filename
    let original_path = PathBuf::from(&file_path);
    let filename = original_path.file_name()
        .ok_or_else(|| "Invalid file path".to_string())?
        .to_string_lossy();

    // Create temp file path
    let temp_dir = env::temp_dir();
    let temp_file_path = temp_dir.join(format!("decrypted_{}", filename));

    // Write the decrypted data to temp file
    let mut output_file = File::create(&temp_file_path).map_err(|e| format!("Failed to create output file: {}", e))?;
    output_file.write_all(&decrypted_data).map_err(|e| format!("Failed to write decrypted data: {}", e))?;

    println!("File decrypted successfully to: {}", temp_file_path.display());
    Ok(temp_file_path.to_string_lossy().into_owned())
} 
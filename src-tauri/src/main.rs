// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dirs;
use rusqlite::{Connection, Result};
use std::{error::Error, path::PathBuf};
use tauri::{api::dialog::blocking::FileDialogBuilder, InvokeError};

#[tauri::command]
async fn choose_directory() -> Option<PathBuf> {
    let folder_path = FileDialogBuilder::new().pick_folder();
    return folder_path;
}

#[derive(Debug, serde::Serialize)]
struct FileInfo {
    filename: String,
    filetype: String,
    filepath: String,
}

use std::path::Path;

#[tauri::command]
fn list_files_in_dir(directory: &str) -> Vec<FileInfo> {
    let mut files = Vec::new();
    if let Ok(entries) = std::fs::read_dir(directory) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Ok(file_type) = entry.file_type() {
                    if file_type.is_file() {
                        if let Some(file_name) = entry.file_name().to_str() {
                            let file_path = entry.path().to_str().unwrap().to_owned();
                            let file_type = identify_file_type(&file_path);
                            let file_info = FileInfo {
                                filename: file_name.to_owned(),
                                filetype: file_type.unwrap_or("Unknown").to_owned(),
                                filepath: file_path,
                            };
                            files.push(file_info);
                        }
                    } else if file_type.is_dir() {
                        if let Some(file_name) = entry.file_name().to_str() {
                            let file_path = entry.path().to_str().unwrap().to_owned();
                            let file_info = FileInfo {
                                filename: file_name.to_owned(),
                                filetype: "Folder".to_owned(),
                                filepath: file_path,
                            };
                            files.push(file_info);
                        }
                    }
                }
            }
        }
    }
    files
}

fn identify_file_type(path: &str) -> Option<&'static str> {
    let extension = Path::new(path).extension().and_then(|ext| ext.to_str());

    match extension {
        Some("jpg") | Some("jpeg") | Some("png") => Some("Image"),
        Some("mp4") | Some("mov") => Some("Video"),
        Some("mp3") | Some("wav") => Some("Audio"),
        Some("pdf") => Some("PDF"),
        Some("txt") => Some("Text"),
        Some("rs") => Some("Rust Source Code"),
        _ => None,
    }
}

#[derive(Debug, serde::Serialize)]
struct User {
    id: i32,
    username: String,
    password: String,
}

#[derive(serde::Serialize)]
struct ActivationStatus {
    activated: bool,
}

#[tauri::command]
fn get_all_users(username: &str, password: &str) -> Result<Option<User>, InvokeError> {
    let conn = establish_db_connection().map_err(|err| InvokeError::from(err.to_string()))?;
    let mut stmt = conn
        .prepare("SELECT * FROM users WHERE username = ? and password = ?")
        .map_err(|err| InvokeError::from(err.to_string()))?;
    let mut user_iter = stmt
        .query_map([username, password], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                password: row.get(2)?,
            })
        })
        .map_err(|err| InvokeError::from(err.to_string()))?;

    let user = user_iter
        .next()
        .transpose()
        .map_err(|err| InvokeError::from(err.to_string()))?;
    Ok(user)
}

fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

fn insert_user(conn: &Connection, username: &str, password: &str) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
    )?;
    println!("User {} added to database.", username);
    Ok(())
}

#[tauri::command]
fn execute_jar_command(selected: &str) -> String {
    // Execute your JAR command here
    let output = std::process::Command::new("java")
        .arg("-jar")
        .arg("/Users/amrutmaliye/Downloads/JavaEncrypterNew.jar")
        .arg("file")
        .arg("d")
        .arg(selected)
        .arg("../public/video.mp4")
        .output()
        .expect("failed to execute JAR command");
    println!("{}","Here main");
        // const jarFilePath = '/Users/amrutmaliye/Downloads/JavaEncrypterNew.jar';
        // const pwdPath = '/Users/amrutmaliye/Downloads/un.mp4';
    //java -jar "${jarFilePath}" file d "${pwdPath}" ./video.mp4
    // Return the command output as a string
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn establish_db_connection() -> Result<Connection, Box<dyn Error>> {
    let mut db_path = match dirs::config_dir() {
        Some(dir) => dir,
        None => return Err("could not determine home directory".into()),
    };
    db_path.push("com.osiris.dev");
    std::fs::create_dir_all(&db_path)?;
    println!("{}", db_path.to_string_lossy());
    db_path.push("tauri_dev.db");
    let conn = Connection::open(&db_path)?;
    Ok(conn)
}

fn table_exists(conn: &Connection) -> Result<bool, Box<dyn Error>> {
    let sql = format!("SELECT COUNT(*) FROM users");
    let mut stmt = conn.prepare(&sql)?;
    let mut rows = stmt.query([])?;
    let count: i64 = rows.next()?.unwrap().get(0)?;
    let row_exists = count > 0;
    Ok(row_exists)
}

#[tauri::command]
fn check_table_exists() -> Result<ActivationStatus, InvokeError> {
    let conn = establish_db_connection().map_err(|err| InvokeError::from(err.to_string()))?;
    let activated = table_exists(&conn).map_err(|err| InvokeError::from(err.to_string()))?;
    Ok(ActivationStatus { activated })
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = establish_db_connection()?;
    create_table(&conn)?;
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            choose_directory,
            list_files_in_dir,
            get_all_users,
            check_table_exists,
            execute_jar_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}

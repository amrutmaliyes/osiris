// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::PathBuf, error::Error};
use tauri::{api::dialog::blocking::FileDialogBuilder, InvokeError};
use rusqlite::{Connection, Result};
use dirs;

#[tauri::command]
async fn choose_directory() -> Option<PathBuf>  {
  let folder_path = FileDialogBuilder::new().pick_folder();
  return folder_path;
}

#[tauri::command]
fn list_files_in_dir(directory: &str) -> Vec<String> {
    println!("{}", directory);
    let mut files = Vec::new();
    if let Ok(entries) = std::fs::read_dir(directory) {
        for entry in entries {
            if let Ok(entry) = entry {
                // if let Ok(file_type) = entry.file_type() {
                    // if file_type.is_file() {
                        if let Some(file_name) = entry.file_name().to_str() {
                            files.push(file_name.to_owned());
                        }
                    // }
                // }
            }
        }
    }
    files
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
    let mut stmt = conn.prepare("SELECT * FROM users WHERE username = ? and password = ?").map_err(|err| InvokeError::from(err.to_string()))?;
    let mut user_iter = stmt.query_map([username, password], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            password: row.get(2)?,
        })
    }).map_err(|err| InvokeError::from(err.to_string()))?;

    let user = user_iter.next().transpose().map_err(|err| InvokeError::from(err.to_string()))?;
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

fn establish_db_connection() -> Result<Connection, Box<dyn Error>> {
    let mut db_path = match dirs::config_dir() {
        Some(dir) => dir,
        None => return Err("could not determine home directory".into())
    };
    db_path.push("OSIRIS");
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
        .invoke_handler(tauri::generate_handler![choose_directory, list_files_in_dir, get_all_users, check_table_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
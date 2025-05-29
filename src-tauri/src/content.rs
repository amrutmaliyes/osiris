use crate::db::get_db_path; 
use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use open;

#[derive(Debug, Serialize, Deserialize)]
pub struct ContentPath {
    pub id: i64,
    pub path: String,
    pub is_active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    #[serde(rename = "isDirectory")] // Use camelCase for frontend
    pub is_directory: bool,
}

// Function to check if there is at least one active content path
#[tauri::command]
pub fn has_active_content_path() -> Result<bool, String> {
    let db_path = get_db_path()?;
    if !db_path.exists() {
        return Ok(false); // No DB, no active path
    }
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db.prepare("SELECT COUNT(*) FROM ContentPaths WHERE is_active = 1")
        .map_err(|e| e.to_string())?;
    let count: i64 = stmt.query_row([], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    Ok(count > 0)
}

// Function to add a new content path and set it as active, deactivating others
#[tauri::command]
pub fn add_and_set_active_content_path(path: String) -> Result<(), String> {
    let db_path = get_db_path()?;
    let mut db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let tx = db.transaction().map_err(|e| e.to_string())?;

    // Deactivate all existing paths
    tx.execute("UPDATE ContentPaths SET is_active = 0", [])
        .map_err(|e| e.to_string())?;

    // Insert the new path or update if it already exists
    tx.execute(
        "INSERT OR REPLACE INTO ContentPaths (path, is_active) VALUES (?1, 1)",
        params![path],
    ).map_err(|e| e.to_string())?;

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

// Function to get all content paths
#[tauri::command]
pub fn get_content_paths() -> Result<Vec<ContentPath>, String> {
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db.prepare("SELECT id, path, is_active FROM ContentPaths")
        .map_err(|e| e.to_string())?;
    
    let content_paths = stmt.query_map([], |row| {
        Ok(ContentPath {
            id: row.get(0)?,
            path: row.get(1)?,
            is_active: row.get(2)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<Result<Vec<ContentPath>, _>>()
    .map_err(|e| e.to_string())?;

    Ok(content_paths)
}

// Function to set a content path as active, deactivating others
#[tauri::command]
pub fn set_active_content_path(id: i32) -> Result<(), String> {
    let db_path = get_db_path()?;
    let mut db = rusqlite::Connection::open(&db_path).map_err(|e| e.to_string())?;

    let tx = db.transaction().map_err(|e| e.to_string())?;

    // Set all other paths to inactive
    tx.execute(
        "UPDATE ContentPaths SET is_active = 0 WHERE id != ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    // Set the specified path to active
    let updated_rows = tx.execute(
        "UPDATE ContentPaths SET is_active = 1 WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    if updated_rows == 0 {
        tx.rollback().map_err(|e| e.to_string())?;
        return Err(format!("Content path with id {} not found.", id));
    }

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_active_content_path() -> Result<Option<String>, String> {
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db.prepare("SELECT path FROM ContentPaths WHERE is_active = 1 LIMIT 1").map_err(|e| e.to_string())?;
    let mut rows = stmt.query([]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let path: String = row.get(0).map_err(|e| e.to_string())?;
        Ok(Some(path))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn list_directories_in_path(path: String) -> Result<Vec<FileEntry>, String> {
    let path = Path::new(&path);

    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", path.display()));
    }

    let mut entries = Vec::new();
    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if let Some(name) = path.file_name() {
            if let Some(name_str) = name.to_str() {
                entries.push(FileEntry {
                    name: name_str.to_string(),
                    is_directory: path.is_dir(),
                });
            }
        }
    }
    // Optional: Sort entries alphabetically
    entries.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    Ok(entries)
}

#[tauri::command]
pub fn delete_content_path(id: i32) -> Result<(), String> {
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    // Check if the path is active before deleting
    let mut stmt = db.prepare("SELECT is_active FROM ContentPaths WHERE id = ?1").map_err(|e| e.to_string())?;
    let is_active: bool = stmt.query_row(params![id], |row| row.get(0)).map_err(|e| e.to_string())?;

    if is_active {
        return Err("Cannot delete the active content path.".to_string());
    }

    let deleted_rows = db.execute(
        "DELETE FROM ContentPaths WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    if deleted_rows == 0 {
        return Err(format!("Content path with id {} not found.", id));
    }

    Ok(())
}

#[tauri::command]
pub fn open_file_in_system(path: String) -> Result<(), String> {
    let path = Path::new(&path);

    if !path.is_file() {
        return Err(format!("Path is not a file: {}", path.display()));
    }

    // Use the 'open' crate to open the file with the default application
    match open::that(path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to open file: {}", e)),
    }
} 
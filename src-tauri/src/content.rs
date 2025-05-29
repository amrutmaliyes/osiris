use crate::db::get_db_path; 
use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ContentPath {
    pub id: i64,
    pub path: String,
    pub is_active: bool,
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
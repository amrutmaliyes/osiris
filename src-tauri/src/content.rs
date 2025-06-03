use crate::db::get_db_path; 
use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use open;
use log::{info, error, warn};

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
    info!("Checking for active content path.");
    let db_path = get_db_path()?;
    if !db_path.exists() {
        info!("Database path does not exist. No active path found.");
        return Ok(false); // No DB, no active path
    }
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for active content path check: {}", e);
        e.to_string()
    })?;

    let mut stmt = db.prepare("SELECT COUNT(*) FROM ContentPaths WHERE is_active = 1")
        .map_err(|e| {
            error!("Failed to prepare statement for active content path count: {}", e);
            e.to_string()
        })?;
    let count: i64 = stmt.query_row([], |row| row.get(0))
        .map_err(|e| {
            error!("Failed to query for active content path count: {}", e);
            e.to_string()
        })?;

    info!("Active content paths count: {}", count);
    Ok(count > 0)
}

// Function to add a new content path and set it as active, deactivating others
#[tauri::command]
pub fn add_and_set_active_content_path(path: String) -> Result<(), String> {
    info!("Adding and setting active content path: {}", path);
    let db_path = get_db_path()?;
    let mut db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for adding content path: {}", e);
        e.to_string()
    })?;

    let tx = db.transaction().map_err(|e| {
        error!("Failed to start database transaction for adding content path: {}", e);
        e.to_string()
    })?;

    // Deactivate all existing paths
    tx.execute("UPDATE ContentPaths SET is_active = 0", [])
        .map_err(|e| {
            error!("Failed to deactivate existing content paths: {}", e);
            e.to_string()
        })?;
    info!("Deactivated existing content paths.");

    // Insert the new path or update if it already exists
    tx.execute(
        "INSERT OR REPLACE INTO ContentPaths (path, is_active) VALUES (?1, 1)",
        params![path],
    ).map_err(|e| {
        error!("Failed to insert or replace content path: {}", e);
        e.to_string()
    })?;
    info!("Inserted or replaced new content path.");

    tx.commit().map_err(|e| {
        error!("Failed to commit database transaction for adding content path: {}", e);
        e.to_string()
    })?;
    info!("Successfully added and set active content path.");

    Ok(())
}

// Function to get all content paths
#[tauri::command]
pub fn get_content_paths() -> Result<Vec<ContentPath>, String> {
    info!("Retrieving all content paths.");
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for getting content paths: {}", e);
        e.to_string()
    })?;

    let mut stmt = db.prepare("SELECT id, path, is_active FROM ContentPaths")
        .map_err(|e| {
            error!("Failed to prepare statement for getting content paths: {}", e);
            e.to_string()
        })?;
    
    let content_paths = stmt.query_map([], |row| {
        Ok(ContentPath {
            id: row.get(0)?,
            path: row.get(1)?,
            is_active: row.get(2)?,
        })
    })
    .map_err(|e| {
        error!("Failed to query map for content paths: {}", e);
        e.to_string()
    })?
    .collect::<Result<Vec<ContentPath>, _>>()
    .map_err(|e| {
        error!("Failed to collect content paths: {}", e);
        e.to_string()
    })?;

    info!("Successfully retrieved {} content paths.", content_paths.len());
    Ok(content_paths)
}

// Function to set a content path as active, deactivating others
#[tauri::command]
pub fn set_active_content_path(id: i32) -> Result<(), String> {
    info!("Setting active content path to ID: {}", id);
    let db_path = get_db_path()?;
    let mut db = rusqlite::Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for setting active content path: {}", e);
        e.to_string()
    })?;

    let tx = db.transaction().map_err(|e| {
        error!("Failed to start database transaction for setting active content path: {}", e);
        e.to_string()
    })?;

    // Set all other paths to inactive
    tx.execute(
        "UPDATE ContentPaths SET is_active = 0 WHERE id != ?1",
        params![id],
    ).map_err(|e| {
        error!("Failed to deactivate other content paths: {}", e);
        e.to_string()
    })?;
    info!("Deactivated other content paths.");

    // Set the specified path to active
    let updated_rows = tx.execute(
        "UPDATE ContentPaths SET is_active = 1 WHERE id = ?1",
        params![id],
    ).map_err(|e| {
        error!("Failed to set specified content path as active: {}", e);
        e.to_string()
    })?;

    if updated_rows == 0 {
        tx.rollback().map_err(|e| e.to_string())?;
        warn!("Content path with id {} not found when setting as active.", id);
        return Err(format!("Content path with id {} not found.", id));
    }

    tx.commit().map_err(|e| {
        error!("Failed to commit database transaction for setting active content path: {}", e);
        e.to_string()
    })?;
    info!("Successfully set active content path to ID: {}", id);

    Ok(())
}

#[tauri::command]
pub fn get_active_content_path() -> Result<Option<String>, String> {
    info!("Retrieving active content path.");
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for getting active content path: {}", e);
        e.to_string()
    })?;

    let mut stmt = db.prepare("SELECT path FROM ContentPaths WHERE is_active = 1 LIMIT 1").map_err(|e| {
        error!("Failed to prepare statement for active content path: {}", e);
        e.to_string()
    })?;
    let mut rows = stmt.query([]).map_err(|e| {
        error!("Failed to query for active content path: {}", e);
        e.to_string()
    })?;

    if let Some(row) = rows.next().map_err(|e| {
        error!("Failed to read row for active content path: {}", e);
        e.to_string()
    })? {
        let path: String = row.get(0).map_err(|e| {
            error!("Failed to get path from row for active content path: {}", e);
            e.to_string()
        })?;
        info!("Active content path found: {}", path);
        Ok(Some(path))
    } else {
        info!("No active content path found.");
        Ok(None)
    }
}

#[tauri::command]
pub fn list_directories_in_path(path: String) -> Result<Vec<FileEntry>, String> {
    info!("Listing directories in path: {}", path);
    let path = Path::new(&path);

    if !path.is_dir() {
        warn!("Path is not a directory: {}", path.display());
        return Err(format!("Path is not a directory: {}", path.display()));
    }

    let mut entries = Vec::new();
    for entry in fs::read_dir(path).map_err(|e| {
        error!("Failed to read directory {}: {}", path.display(), e);
        e.to_string()
    })? {
        let entry = entry.map_err(|e| {
            error!("Failed to get directory entry: {}", e);
            e.to_string()
        })?;
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
    info!("Successfully listed {} entries in path: {}", entries.len(), path.display());
    Ok(entries)
}

#[tauri::command]
pub fn delete_content_path(id: i32) -> Result<(), String> {
    info!("Deleting content path with ID: {}", id);
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for deleting content path: {}", e);
        e.to_string()
    })?;

    // Check if the path is active before deleting
    let mut stmt = db.prepare("SELECT is_active FROM ContentPaths WHERE id = ?1").map_err(|e| {
        error!("Failed to prepare statement for checking active status of content path: {}", e);
        e.to_string()
    })?;
    let is_active: bool = stmt.query_row(params![id], |row| row.get(0)).map_err(|e| {
        error!("Failed to query for active status of content path: {}", e);
        e.to_string()
    })?;

    if is_active {
        warn!("Attempted to delete active content path with ID: {}", id);
        return Err("Cannot delete the active content path.".to_string());
    }

    let deleted_rows = db.execute(
        "DELETE FROM ContentPaths WHERE id = ?1",
        params![id],
    ).map_err(|e| {
        error!("Failed to delete content path: {}", e);
        e.to_string()
    })?;

    if deleted_rows == 0 {
        warn!("Content path with id {} not found for deletion.", id);
        return Err(format!("Content path with id {} not found.", id));
    }
    info!("Successfully deleted content path with ID: {}", id);

    Ok(())
}

#[tauri::command]
pub fn open_file_in_system(path: String) -> Result<(), String> {
    info!("Attempting to open file in system: {}", path);
    let path = Path::new(&path);

    if !path.is_file() {
        warn!("Path is not a file: {}", path.display());
        return Err(format!("Path is not a file: {}", path.display()));
    }

    // Use the 'open' crate to open the file with the default application
    match open::that(path) {
        Ok(_) => {
            info!("Successfully opened file: {}", path.display());
            Ok(())
        },
        Err(e) => {
            error!("Failed to open file {}: {}", path.display(), e);
            Err(format!("Failed to open file: {}", e))
        },
    }
} 
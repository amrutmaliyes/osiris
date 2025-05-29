// src-tauri/src/db.rs

use dirs;
use rusqlite::{Connection, Result};
use std::path::PathBuf;

const DB_NAME: &str = "app.db";

// Function to get the database file path
pub fn get_db_path() -> Result<PathBuf, String> {
    dirs::data_dir()
        .map(|mut path| {
            path.push(DB_NAME);
            path
        })
        .ok_or("Could not get application data directory".to_string())
}

// Function to initialize the database (create file and tables if they don't exist)
pub fn initialize_db() -> Result<(), String> {
    let db_path = get_db_path()?;

    // Check if the database file already exists
    if db_path.exists() {
        println!("Database file already exists. Skipping initialization.");
        return Ok(());
    }

    println!("Database file not found. Initializing database...");

    // Create directory if it doesn't exist
    if let Some(parent) = db_path.parent() {
        if !parent.exists() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }

    // Open connection (this will create the file if it doesn't exist)
    let mut db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let table_creation_sqls = [
        "CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS Activations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            organization_name TEXT NOT NULL,
            serial_mac_id TEXT NOT NULL,
            activation_code TEXT NOT NULL UNIQUE,
            start_date DATETIME,
            end_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS ContentPaths (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL UNIQUE,
            is_active BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS ContentItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folder_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (folder_id) REFERENCES ContentPaths(id)
        );",
        "CREATE TABLE IF NOT EXISTS ContentProgress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            folder_id INTEGER,
            content_item_id INTEGER, -- Reference to specific content item
            completion_percentage INTEGER DEFAULT 0, -- Track percentage of completion (0-100)
            status TEXT DEFAULT 'in-progress', -- e.g., 'completed', 'in-progress'
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (folder_id) REFERENCES ContentPaths(id),
            FOREIGN KEY (content_item_id) REFERENCES ContentItems(id)
        );",
    ];

    let tx = db.transaction().map_err(|e| e.to_string())?;
    for sql in table_creation_sqls.iter() {
        tx.execute(sql, []).map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    println!("Database initialization complete.");

    Ok(())
}

// Check if the Activations table has any data
#[tauri::command]
pub fn has_activation() -> Result<bool, String> {
    println!("Checking for activation...");
    let db_path = get_db_path()?;
    // Check if the database file exists. If not, there's no activation.
    if !db_path.exists() {
        return Ok(false);
    }

    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare("SELECT COUNT(*) FROM Activations")
        .map_err(|e| e.to_string())?;
    let count: i64 = stmt
        .query_row([], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    Ok(count > 0)
}

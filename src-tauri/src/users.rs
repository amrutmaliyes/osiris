use crate::db::get_db_path;
use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use log::{info, error};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: Option<i64>,
    pub username: String,
    pub password: String,
    pub role: String,
}

// Command to add a new user
#[tauri::command]
pub fn add_user(user: User) -> Result<i64, String> {
    info!("Adding new user: {}", user.username);
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for adding user: {}", e);
        e.to_string()
    })?;

    db.execute(
        "INSERT INTO Users (username, password, role) VALUES (?1, ?2, ?3)",
        params![
            user.username,
            user.password,
            user.role
        ],
    )
    .map_err(|e| {
        error!("Failed to insert user {}: {}", user.username, e);
        e.to_string()
    })?;

    let last_id = db.last_insert_rowid();
    info!("Successfully added user {} with ID: {}", user.username, last_id);
    Ok(last_id)
}

// Command to get all users
#[tauri::command]
pub fn get_users() -> Result<Vec<User>, String> {
    info!("Retrieving all users.");
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for getting users: {}", e);
        e.to_string()
    })?;

    let mut stmt = db.prepare("SELECT id, username, password, role FROM Users")
        .map_err(|e| {
            error!("Failed to prepare statement for getting users: {}", e);
            e.to_string()
        })?;
    
    let users = stmt.query_map([], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            password: row.get(2)?,
            role: row.get(3)?,
        })
    })
    .map_err(|e| {
        error!("Failed to query map for users: {}", e);
        e.to_string()
    })?
    .collect::<Result<Vec<User>, _>>()
    .map_err(|e| {
        error!("Failed to collect users: {}", e);
        e.to_string()
    })?;

    info!("Successfully retrieved {} users.", users.len());
    Ok(users)
}

// Command to update an existing user
#[tauri::command]
pub fn update_user(user: User) -> Result<(), String> {
    info!("Updating user with ID: {:?}", user.id);
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for updating user: {}", e);
        e.to_string()
    })?;

    let updated_rows = db.execute(
        "UPDATE Users SET username = ?1, password = ?2, role = ?3 WHERE id = ?4",
        params![
            user.username,
            user.password,
            user.role,
            user.id,
        ],
    )
    .map_err(|e| {
        error!("Failed to update user with ID {:?}: {}", user.id, e);
        e.to_string()
    })?;

    if updated_rows == 0 {
        error!("User with ID {:?} not found for update.", user.id);
        return Err(format!("User with ID {:?} not found.", user.id));
    }

    info!("Successfully updated user with ID: {:?}", user.id);
    Ok(())
}

// Command to delete a user
#[tauri::command]
pub fn delete_user(id: i64) -> Result<(), String> {
    info!("Deleting user with ID: {}", id);
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for deleting user: {}", e);
        e.to_string()
    })?;

    let deleted_rows = db.execute(
        "DELETE FROM Users WHERE id = ?1",
        params![id],
    )
    .map_err(|e| {
        error!("Failed to delete user with ID {}: {}", id, e);
        e.to_string()
    })?;

    if deleted_rows == 0 {
        error!("User with ID {} not found for deletion.", id);
        return Err(format!("User with ID {} not found.", id));
    }

    info!("Successfully deleted user with ID: {}", id);
    Ok(())
} 
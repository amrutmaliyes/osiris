// src-tauri/src/auth.rs

use crate::db::get_db_path;
use chrono::{Duration, NaiveDateTime, Utc}; // Add chrono to Cargo.toml for date handling
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize}; // Assuming get_db_path is public in db.rs

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivationDetails {
    pub id: i64,
    pub email: String,
    pub organization_name: String,
    pub serial_mac_id: String,
    pub activation_code: String,
    pub start_date: Option<String>, // Use String for dates from DB for simplicity, parse to NaiveDateTime when needed
    pub end_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewActivationData {
    pub institution_name: String,
    pub head_of_institution: String,
    pub email: String,
    pub mobile_no: String,
    pub password: String,
    pub product_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginCredentials {
    pub email: String,
    pub password: String,
}

#[tauri::command]
pub fn get_mac_address() -> Result<String, String> {
    match mac_address::get_mac_address() {
        Ok(Some(ma)) => Ok(ma.to_string()),
        Ok(None) => Err("Could not get MAC address".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn perform_new_activation(details: NewActivationData) -> Result<(), String> {
    // 1. Get MAC address
    let mac_id = get_mac_address()?;

    // 2. Call backend API to register
    // You need to replace this with actual API call logic
    // let client = reqwest::blocking::Client::new();
    // let api_url = "YOUR_BACKEND_API_URL/register";
    // let response = client.post(api_url).json(&details).send().map_err(|e| e.to_string())?;
    // if !response.status().is_success() {
    //     return Err(format!("Backend registration failed: {}", response.status()));
    // }
    // // Assuming the backend returns start_date and end_date upon successful registration
    // let api_response_data: ActivationDetailsFromApi = response.json().map_err(|e| e.to_string())?;

    // --- Simulate API success with dummy data ---
    let now = Utc::now().naive_utc();
    let end_date = now + Duration::days(365); // Example: 1 year duration
    let start_date_str = now.format("%Y-%m-%d %H:%M:%S").to_string();
    let end_date_str = end_date.format("%Y-%m-%d %H:%M:%S").to_string();
    // --- End Simulation ---

    // 3. Save details to local DB
    let db_path = get_db_path()?;
    let mut db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let tx = db.transaction().map_err(|e| e.to_string())?;
    tx.execute(
        "INSERT INTO Activations (email, organization_name, serial_mac_id, activation_code, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        [&details.email, &details.institution_name, &mac_id, &details.product_key, &start_date_str, &end_date_str],
    ).map_err(|e| e.to_string())?;

    // Insert an initial user (e.g., the admin from the signup)
    tx.execute(
        "INSERT INTO Users (username, password, role) VALUES (?1, ?2, ?3)",
        [&details.email, &details.password, "admin"], // Assuming the first user is admin
    )
    .map_err(|e| e.to_string())?; // Consider hashing the password!

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn perform_reactivation(activation_key: String) -> Result<(), String> {
    // 1. Get MAC address
    let mac_id = get_mac_address()?;

    // 2. Call backend API to verify key and MAC ID
    // You need to replace this with actual API call logic
    // let client = reqwest::blocking::Client::new();
    // let api_url = "YOUR_BACKEND_API_URL/verify_activation";
    // let response = client.post(api_url).json(&json!("{\"activation_key\": activation_key, \"mac_id\": mac_id}")).send().map_err(|e| e.to_string())?;
    // if !response.status().is_success() {
    //     return Err(format!("Backend verification failed: {}", response.status()));
    // }
    // // Assuming the backend returns new start_date and end_date upon successful verification
    // let api_response_data: ActivationDetailsFromApi = response.json().map_err(|e| e.to_string())?;

    // --- Simulate API success with dummy data ---
    let now = Utc::now().naive_utc();
    let end_date = now + Duration::days(365); // Example: 1 year duration
    let start_date_str = now.format("%Y-%m-%d %H:%M:%S").to_string();
    let end_date_str = end_date.format("%Y-%m-%d %H:%M:%S").to_string();
    // --- End Simulation ---

    // 3. Update local DB with new dates
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let updated_rows = db.execute(
        "UPDATE Activations SET start_date = ?1, end_date = ?2 WHERE activation_code = ?3 AND serial_mac_id = ?4",
        [&start_date_str, &end_date_str, &activation_key, &mac_id],
    ).map_err(|e| e.to_string())?;

    if updated_rows == 0 {
        return Err("Activation key or MAC address does not match.".to_string());
    }

    Ok(())
}

#[tauri::command]
pub fn check_activation_expiry() -> Result<bool, String> {
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare("SELECT end_date FROM Activations ORDER BY id DESC LIMIT 1")
        .map_err(|e| e.to_string())?;

    let end_date_str_result: Result<String, _> = stmt.query_row([], |row| row.get(0));

    match end_date_str_result {
        Ok(end_date_str) => {
            let end_date = NaiveDateTime::parse_from_str(&end_date_str, "%Y-%m-%d %H:%M:%S")
                .map_err(|e| e.to_string())?; // Adjust format if needed
            let now = Utc::now().naive_utc();
            Ok(now > end_date) // True if expired
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            // No activation found, treat as expired or requiring activation
            Ok(true) // Or return a specific error if needed
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn perform_login(credentials: LoginCredentials) -> Result<bool, String> {
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare("SELECT COUNT(*) FROM Users WHERE username = ?1 AND password = ?2")
        .map_err(|e| e.to_string())?; // **WARNING: Passwords should be hashed!**
    let count: i64 = stmt
        .query_row([&credentials.email, &credentials.password], |row| {
            row.get(0)
        })
        .map_err(|e| e.to_string())?;

    Ok(count > 0)
}

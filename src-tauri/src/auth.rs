// src-tauri/src/auth.rs

use crate::db::get_db_path; // Import db module and necessary functions
use chrono::{NaiveDateTime, Utc, DateTime}; // Add chrono to Cargo.toml for date handling
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize}; // Assuming get_db_path is public in db.rs
use std::collections::HashMap;
use log::{info, error, warn}; // Added log imports

#[derive(Debug, Serialize, Deserialize, Clone)] // Derive Clone for passing data
pub struct ActivationDetails {
    pub id: i64,
    pub email: String,
    pub organization_name: String,
    pub serial_mac_id: String,
    pub activation_code: String,
    pub start_date: Option<String>, // Use String for dates from DB for simplicity, parse to NaiveDateTime when needed
    pub end_date: Option<String>,
}

// Updated to match frontend camelCase and required fields, will convert to snake_case
#[derive(Debug, Serialize, Deserialize)]
pub struct NewActivationData {
    #[serde(rename = "institutionName")]
    pub institution_name: String,
    #[serde(rename = "headOfInstitution")]
    pub head_of_institution: String,
    #[serde(rename = "mobileNo")]
    pub mobile_no: String,
    #[serde(rename = "serialNumber")]
    pub serial_number: String,
    #[serde(rename = "productKey")]
    pub product_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginCredentials {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub username: String,
    pub role: String,
}

// Struct to match the successful API response structure for New Activation
#[derive(Debug, Deserialize)]
struct NewActivationApiResponse {
    message: String,
    #[serde(rename = "productKey")]
    product_key_details: ApiProductKeyDetails,
    credentials: ApiCredentials,
}

#[derive(Debug, Deserialize)]
struct ApiProductKeyDetails {
    expiry_date: String,
}

#[derive(Debug, Deserialize)]
struct ApiCredentials {
    username: String,
    password: String,
}

// Struct to match the successful API response structure for Reactivation (assuming it returns updated dates)
#[derive(Debug, Deserialize)]
struct ReactivationApiResponse {
     message: String,
     #[serde(rename = "productKey")] // Assuming similar structure to new activation
     product_key_details: ApiProductKeyDetails, // Reusing the struct if structure is the same
     // Add other fields if returned by reactivation API
}

#[tauri::command]
pub async fn get_mac_address() -> Result<String, String> {
    match mac_address::get_mac_address() {
        Ok(Some(ma)) => {
            info!("Successfully retrieved MAC address.");
            Ok(ma.to_string())
        }
        Ok(None) => {
            warn!("Could not get MAC address: None returned.");
            Err("Could not get MAC address".to_string())
        }
        Err(e) => {
            error!("Failed to get MAC address: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn perform_new_activation(form_data: NewActivationData) -> Result<String, String> {
    info!("Attempting new activation.");
    // 1. Get MAC address
    let mac_id = get_mac_address().await?;

    // Clone the necessary form_data fields for the API request body and DB insert
    let institution_name_clone = form_data.institution_name.clone();
    let head_of_institution_clone = form_data.head_of_institution.clone();
    let mobile_no_clone = form_data.mobile_no.clone();
    let serial_number_clone = form_data.serial_number.clone();
    let product_key_clone = form_data.product_key.clone();

    // 2. Prepare data for the backend API call
    let api_url = "http://iactiveapi.lattech.in/api/devices/onboard";
    let mut request_body = HashMap::new();
    request_body.insert("institution", institution_name_clone.clone());
    request_body.insert("head_of_institution", head_of_institution_clone.clone());
    request_body.insert("phone_number", mobile_no_clone.clone());
    request_body.insert("serial_key", serial_number_clone.clone());
    request_body.insert("product_key", product_key_clone.clone());
    request_body.insert("mac_id", mac_id.clone());
    // TODO: Implement logic to get a unique device_id if required by the backend
    request_body.insert("device_id", mac_id.clone());

    info!("API Request URL: {}", api_url);
    info!("API Request Body: {:?}", request_body);

    // 3. Call backend API to register
    let client = reqwest::Client::new();
    let response = client.post(api_url)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| {
            error!("API request failed: {}", e);
            format!("API request failed: {}", e)
        })?;

    let status = response.status();
    let response_text = response.text().await.map_err(|e| {
        error!("Failed to read API response: {}", e);
        format!("Failed to read API response: {}", e)
    })?;

    info!("API Response Status: {}", status);
    info!("API Response Body: {}", response_text);

    if !status.is_success() {
        // Attempt to parse error message from the response body
        let error_message = serde_json::from_str::<HashMap<String, String>>(&response_text)
            .ok()
            .and_then(|map| map.get("message").cloned())
            .unwrap_or_else(|| format!("API returned error status: {}", status));
        error!("New activation API returned error: {}", error_message);
        return Err(error_message);
    }

    // 4. Parse successful API response
    let api_response: NewActivationApiResponse = serde_json::from_str(&response_text)
        .map_err(|e| {
            error!("Failed to parse API response for new activation: {}", e);
            format!("Failed to parse API response: {}", e)
        })?;

    // 5. Save details to local DB
    info!("Saving new activation details to local DB.");
    let db_path = get_db_path()?;
    let mut db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for new activation: {}", e);
        e.to_string()
    })?;

    let tx = db.transaction().map_err(|e| {
        error!("Failed to start database transaction for new activation: {}", e);
        e.to_string()
    })?;

    // Parse expiry date from API response and format for DB
    let expiry_datetime = DateTime::parse_from_rfc3339(&api_response.product_key_details.expiry_date)
        .map_err(|e| {
            error!("Failed to parse API expiry date for new activation: {}", e);
            format!("Failed to parse API expiry date: {}", e)
        })?;
    let end_date_str = expiry_datetime.with_timezone(&Utc).naive_utc().format("%Y-%m-%d %H:%M:%S").to_string();

    let start_date_str = Utc::now().naive_utc().format("%Y-%m-%d %H:%M:%S").to_string(); // Example start date

    // Insert into Activations table
    tx.execute(
        "INSERT INTO Activations (email, organization_name, serial_mac_id, activation_code, start_date, end_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        [&
            api_response.credentials.username,
            &institution_name_clone,
            &mac_id,
            &product_key_clone,
            &start_date_str,
            &end_date_str,
        ],
    ).map_err(|e| {
        error!("Failed to insert activation into DB: {}", e);
        e.to_string()
    })?;

    // Insert the user credentials from the API response
    tx.execute(
        "INSERT INTO Users (username, password, role) VALUES (?1, ?2, ?3)",
        [&
            api_response.credentials.username,
            &api_response.credentials.password, // WARNING: Passwords should be hashed before storing!
            "admin" // Assuming the API registered user is admin, adjust if roles are returned
        ],
    )
    .map_err(|e| {
        error!("Failed to insert user into DB: {}", e);
        e.to_string()
    })?;

    tx.commit().map_err(|e| {
        error!("Failed to commit database transaction for new activation: {}", e);
        e.to_string()
    })?;

    info!("New activation successful.");
    // 6. Return success message (can be from API response)
    Ok(api_response.message)
}

#[tauri::command]
pub async fn perform_reactivation(activation_key: String) -> Result<String, String> {
    info!("Attempting reactivation for key: {}", activation_key);
    // 1. Get MAC address
    let mac_id = get_mac_address().await?;

    // 2. Call backend API to verify key and MAC ID
    let api_url = "http://iactiveapi.lattech.in/api/devices/reactivate"; // Assuming reactivation endpoint
    let mut request_body = HashMap::new();
    request_body.insert("activation_key", activation_key.clone());
    request_body.insert("mac_id", mac_id.clone());

    info!("Reactivation API Request URL: {}", api_url);
    info!("Reactivation API Request Body: {:?}", request_body);

    let client = reqwest::Client::new();
    let response = client.post(api_url)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| {
            error!("API request failed during reactivation: {}", e);
            format!("API request failed: {}", e)
        })?;

    let status = response.status();
    let response_text = response.text().await.map_err(|e| {
        error!("Failed to read API response during reactivation: {}", e);
        format!("Failed to read API response: {}", e)
    })?;

    info!("Reactivation API Response Status: {}", status);
    info!("Reactivation API Response Body: {}", response_text);

    if !status.is_success() {
        // Attempt to parse error message from the response body
        let error_message = serde_json::from_str::<HashMap<String, String>>(&response_text)
            .ok()
            .and_then(|map| map.get("message").cloned())
            .unwrap_or_else(|| format!("API returned error status: {}", status));
        error!("Reactivation API returned error: {}", error_message);
        return Err(error_message);
    }

    // 3. Parse successful API response (assuming it returns updated productKey details)
    let api_response: ReactivationApiResponse = serde_json::from_str(&response_text)
        .map_err(|e| {
            error!("Failed to parse API response for reactivation: {}", e);
            format!("Failed to parse API response: {}", e)
        })?;

    // 4. Update local DB with new dates from API response
    info!("Updating local DB with reactivation details.");
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for reactivation: {}", e);
        e.to_string()
    })?;

    // Parse expiry date from API response and format for DB
    let expiry_datetime = DateTime::parse_from_rfc3339(&api_response.product_key_details.expiry_date)
        .map_err(|e| {
            error!("Failed to parse API expiry date for reactivation: {}", e);
            format!("Failed to parse API expiry date: {}", e)
        })?;
    let end_date_str = expiry_datetime.with_timezone(&Utc).naive_utc().format("%Y-%m-%d %H:%M:%S").to_string();

    let start_date_str = Utc::now().naive_utc().format("%Y-%m-%d %H:%M:%S").to_string(); // Assuming new start date is now

    let updated_rows = db.execute(
        "UPDATE Activations SET start_date = ?1, end_date = ?2 WHERE activation_code = ?3 AND serial_mac_id = ?4",
        [&start_date_str, &end_date_str, &activation_key, &mac_id],
    ).map_err(|e| {
        error!("Failed to update activation in DB: {}", e);
        e.to_string()
    })?;

    if updated_rows == 0 {
        // This case might need more specific handling depending on your app logic
        // If the API succeeded but no matching local activation was found, maybe insert instead of update?
        warn!("Reactivation API succeeded, but no matching local activation found for key {}", activation_key);
        // For now, we return an error, but you might want to change this.
        return Err("Reactivation succeeded on backend, but failed to update local record.".to_string());
    }

    info!("Reactivation successful.");
    // 5. Return success message from API
    Ok(api_response.message)
}

#[tauri::command]
pub fn check_activation_expiry() -> Result<bool, String> {
    info!("Checking activation expiry.");
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for expiry check: {}", e);
        e.to_string()
    })?;

    let mut stmt = db
        .prepare("SELECT end_date FROM Activations ORDER BY id DESC LIMIT 1")
        .map_err(|e| {
            error!("Failed to prepare statement for expiry check: {}", e);
            e.to_string()
        })?;

    let end_date_str_result: Result<String, _> = stmt.query_row([], |row| row.get(0));

    match end_date_str_result {
        Ok(end_date_str) => {
            info!("Retrieved end_date_str from DB: {}", end_date_str);
            // Attempt to parse the date string using the format observed in the print output
            let end_date = NaiveDateTime::parse_from_str(&end_date_str, "%Y-%m-%d %H:%M:%S")
                .map_err(|e| {
                    error!("Failed to parse end_date_str: {}", e);
                    format!("Failed to parse end_date_str: {}", e)
                })?;
            let now = Utc::now().naive_utc();
            Ok(now > end_date) // True if expired
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            info!("No activation found for expiry check. Treating as expired.");
            Ok(true) // No activation found, treat as expired or requiring activation
        }
        Err(e) => {
            error!("Error querying activation expiry: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn perform_login(credentials: LoginCredentials) -> Result<LoginResponse, String> {
    info!("Attempting login for user: {}", credentials.email);
    let db_path = get_db_path()?;
    let db = Connection::open(&db_path).map_err(|e| {
        error!("Failed to open database for login: {}", e);
        e.to_string()
    })?;

    let mut stmt = db
        .prepare("SELECT password, role FROM Users WHERE username = ?1")
        .map_err(|e| {
            error!("Failed to prepare statement for login: {}", e);
            e.to_string()
        })?;
    let (stored_password, role): (String, String) = stmt.query_row([&credentials.email], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| {
            error!("Failed to retrieve password and role for user {}: {}", credentials.email, e);
            "Invalid username or password".to_string()
        })?;

    // WARNING: In a real application, compare hashed passwords!
    if stored_password == credentials.password {
        info!("Login successful for user: {} with role: {}", credentials.email, role);
        Ok(LoginResponse { username: credentials.email, role })
    } else {
        warn!("Login failed for user {}: Incorrect password.", credentials.email);
        Err("Invalid username or password".to_string())
    }
}

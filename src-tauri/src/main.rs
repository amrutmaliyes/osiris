// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod db; // Import the db module // Import the auth module

fn main() {
    // Initialize the database when the application starts
    if let Err(e) = db::initialize_db() {
        eprintln!("Failed to initialize database: {}", e);
        // In a real app, you might want to show a critical error to the user and exit
        return;
    }

    tauri::Builder::default()
        // Add the commands from db.rs and auth.rs
        .invoke_handler(tauri::generate_handler![
            db::has_activation,
            auth::get_mac_address,
            auth::perform_new_activation,
            auth::perform_reactivation,
            auth::check_activation_expiry,
            auth::perform_login // Add other commands as you create them (e.g., for ContentPaths, Users, etc.)
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

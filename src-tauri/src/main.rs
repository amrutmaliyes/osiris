// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod content;
mod db;
mod encryption;

fn main() {
    if let Err(e) = db::initialize_db() {
        eprintln!("Failed to initialize database: {}", e);
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            db::has_activation,
            auth::get_mac_address,
            auth::perform_new_activation,
            auth::perform_reactivation,
            auth::check_activation_expiry,
            auth::perform_login,
            content::has_active_content_path,
            content::add_and_set_active_content_path,
            content::get_content_paths,
            content::set_active_content_path,
            content::get_active_content_path,
            content::list_directories_in_path,
            content::delete_content_path,
            content::open_file_in_system,
            encryption::decrypt_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

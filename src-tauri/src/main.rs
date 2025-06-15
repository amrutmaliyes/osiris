// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod content;
mod db;
mod encryption;
mod users;

use log::{error, LevelFilter};
use tauri_plugin_log::{Target, TargetKind, RotationStrategy, TimezoneStrategy};

fn main() {
    if let Err(e) = db::initialize_db() {
        error!("Failed to initialize database: {}", e);
        return;
    }

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .format(move |out, message, record| {
                    let log_message = format!("{}: [{}] {}", record.level(), record.target(), message);
                    out.finish(format_args!(
                        "[{}] {}",
                        chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                        log_message
                    ));
                })
                .level(LevelFilter::Trace)
                .rotation_strategy(RotationStrategy::KeepAll)
                .max_file_size(50_000)
                .timezone_strategy(TimezoneStrategy::UseLocal)
                .target(Target::new(TargetKind::LogDir { file_name: None }))
                .target(Target::new(TargetKind::Stdout))
                .build(),
        )
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
            encryption::decrypt_file,
            encryption::parse_xml_quiz,
            users::add_user,
            users::get_users,
            users::update_user,
            users::delete_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

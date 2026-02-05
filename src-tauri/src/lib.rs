mod lcu;
mod lol_window_tracker;
mod shaco;
use lcu::{
    get_match_list, init_keyboard, invoke_lcu, is_game_start, is_lol_cilent, launch_lol,
    listen_for_client_start, start_champ_select, start_current_champ_select, start_listener,
};
use lol_window_tracker::{start_tracking_loop, sync_tracker_config, AppState};
use std::sync::atomic::AtomicBool;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_window_state::StateFlags;

#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
        .manage(AppState {
            is_enabled: Arc::new(AtomicBool::new(false)), // 初始设为 false，等前端同步
            is_running: Arc::new(AtomicBool::new(true)),  // 初始为未运行
            dock_side: Arc::new(Mutex::new("Right".to_string())),
        })
        .invoke_handler(tauri::generate_handler![
            is_lol_cilent,
            start_listener,
            start_champ_select,
            invoke_lcu,
            get_match_list,
            is_game_start,
            init_keyboard,
            listen_for_client_start,
            start_current_champ_select,
            launch_lol,
            start_tracking_loop,
            sync_tracker_config
        ])
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            // 当尝试启动新实例时，聚焦主窗口
            let _ = app
                .get_webview_window("mainWindow")
                .expect("no main window")
                .show();
        }))
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(StateFlags::POSITION)
                .with_denylist(&[
                    "background",
                    "queryMatchWindow",
                    "matchAnalysisWindow",
                    "recentMatchWindow",
                ])
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

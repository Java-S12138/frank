mod lcu;
mod shaco;
use lcu::{
    get_match_list, init_keyboard, invoke_lcu, is_game_start, is_lol_cilent,
    listen_for_client_start, start_listener, start_champ_select,start_current_champ_select
};
use tauri::Emitter;
use tauri::{Listener, Manager};
use tauri_plugin_window_state::{StateFlags};

#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
      /*  .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("background").unwrap();
                window.open_devtools();
            }
            Ok(())
        })*/
        .invoke_handler(tauri::generate_handler![
            is_lol_cilent,
            start_listener,
            start_champ_select,
            invoke_lcu,
            get_match_list,
            is_game_start,
            init_keyboard,
            listen_for_client_start,
            start_current_champ_select
        ])
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            // 当尝试启动新实例时，聚焦主窗口
            let _ = app.get_webview_window("mainWindow")
                .expect("no main window")
                .show();
        }))
        .plugin(tauri_plugin_window_state::Builder::default()
            .with_state_flags(StateFlags::POSITION)
            .with_denylist(&["background","queryMatchWindow","matchAnalysisWindow","recentMatchWindow"]).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

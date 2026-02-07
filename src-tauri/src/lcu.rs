mod global_key;
mod listener;
mod matchlisthanle;
use crate::FrankState;
use matchlisthanle::MatchListDetails;

use crate::lcu::global_key::init_global_keyboard;
use crate::lcu::listener::listen_current_champ_select;
use crate::shaco::ingame;
use crate::shaco::rest::RESTClient;
use crate::shaco::utils::process_info::get_auth_info;
use configparser::ini::Ini;
use listener::{listen_champ_select, listen_client};
use once_cell::sync::OnceCell;
use serde_json::{from_value, Value};
use std::fs;
use std::path::Path;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, Manager};
use tauri::{State, Window};
use tokio::time::sleep;

// 定义全局的 REST 客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> Result<&'static RESTClient, String> {
    REST_CLIENT
        .get()
        .ok_or_else(|| "REST_CLIENT is not initialized".to_string())
}

#[tauri::command]
pub async fn invoke_lcu(method: &str, uri: &str, body: &str) -> Result<Value, Value> {
    let client = get_client()?; // 获取全局的 REST_CLIENT
    if method == "get" {
        let res = client.get(uri).await;
        match res {
            Ok(res) => return Ok(res),
            Err(e) => return Err(Value::Null),
        }
    } else if method == "patch" {
        let parsed: Value = serde_json::from_str(body).expect("Failed to parse JSON string");
        let _res = client.patch(uri, serde_json::json!(parsed)).await.unwrap();
    } else if method == "post" {
        let parsed = serde_json::from_str::<Value>(body);
        match parsed {
            Ok(parsed) => {
                let _res = client.post(uri, parsed).await.unwrap();
            }
            Err(e) => {
                let _res = client.post(uri, Value::Null).await.unwrap();
            }
        }
    } else if method == "delete" {
        let _res = client.delete(uri).await.unwrap();
    }
    Ok(Value::Null)
}

#[tauri::command]
pub async fn get_match_list(uri: &str) -> Result<MatchListDetails, Value> {
    let client = get_client()?;
    let res: Value = client.get(uri).await.expect("Failed to Url");
    match from_value::<MatchListDetails>(res.clone()) {
        Ok(match_list) => Ok(match_list),
        Err(e) => Err(Value::Null),
    }
}

#[tauri::command]
pub fn is_lol_cilent() -> bool {
    let is_exist = get_auth_info();
    match is_exist {
        Ok(_value) => true,
        Err(_error) => false,
    }
}

#[tauri::command]
pub fn listen_for_client_start(app: AppHandle) {
    tokio::spawn({
        async move {
            let start_time = Instant::now();
            let timeout = Duration::from_secs(180); // 设置一个超时时间，例如 30 秒

            loop {
                // 获取客户端信息
                let is_exist = get_auth_info();
                match is_exist {
                    Ok(value) => {
                        let _ = REST_CLIENT
                            .set(RESTClient::new(value.0, value.1).unwrap())
                            .map_err(|_| "REST_CLIENT is already initialized".to_string());
                        app.emit_to("background", "client_status", "ClientStarted")
                            .expect("sent background error");
                        break; // 找到客户端信息后退出循环
                    }
                    Err(_) => {}
                }

                // 超过指定的超时时间则退出
                if start_time.elapsed() > timeout {
                    println!("客户端启动超时，未能获取信息。");
                    break;
                }

                // 每隔一段时间重新检查
                thread::sleep(Duration::from_secs(3)); // 每秒钟检查一次
            }
        }
    });
}

#[tauri::command]
pub async fn start_listener(app: AppHandle) {
    tokio::spawn(async move {
        listen_client(app).await;
    });
}

#[tauri::command]
pub async fn start_champ_select(app: AppHandle) {
    tokio::spawn(async move {
        listen_champ_select(app).await;
    });
}

#[tauri::command]
pub async fn start_current_champ_select(app: AppHandle) {
    tokio::spawn(async move {
        listen_current_champ_select(app).await;
    });
}

#[tauri::command]
pub async fn is_game_start() -> bool {
    let client = ingame::IngameClient::new().expect("Game unstart");
    client.active_game_loadingscreen().await
}

#[tauri::command]
pub async fn init_keyboard(app: AppHandle) {
    tokio::spawn(async move { init_global_keyboard(app) });
}

#[tauri::command]
pub async fn launch_lol(path: &str) -> Result<(), String> {
    std::process::Command::new(path)
        .spawn()
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn start_hex_game_polling(
    app: AppHandle,
    state: State<'_, FrankState>,
) -> Result<(), String> {
    // 1. 防止重复启动
    if state.is_hex_running.load(Ordering::Relaxed) {
        return Err("Polling is already running".into());
    }

    // 设置为运行状态
    state.is_hex_running.store(true, Ordering::SeqCst);
    let is_hex_running = state.is_hex_running.clone();

    let window = app.get_webview_window("hexRecommend").unwrap();
    let client = ingame::IngameClient::new().unwrap();

    // 2. 启动后台异步任务
    tokio::spawn(async move {
        // --- 记录上一次成功通知过的等级 ---
        let mut last_notified_level: i32 = 0;

        loop {
            // 检查外部手动停止开关
            if !is_hex_running.load(Ordering::Relaxed) {
                break;
            }

            // 3. 执行查询
            if let Ok(player_data) = client.active_player().await {
                let level = player_data.level;

                // --- 修改后的逻辑：仅当等级在目标范围内，且与上次通知的等级不同时才发送 ---
                match level {
                    1 | 7 | 11 | 15 => {
                        if level != last_notified_level {
                            let _ = window.emit("game-update", &level);
                            last_notified_level = level; // 更新已记录等级
                        }
                    }
                    _ => {
                        // 如果等级变成了其他值，可以考虑是否重置 last_notified_level
                        // 但通常等级是往上涨的，这里不需要额外操作
                    }
                }

                // 4. 等级逻辑判断
                if level >= 15 {
                    // 到达15级，退出前确保最后一次信号已发送（上面逻辑已覆盖）
                    break;
                }

                // 5. 动态计算下一次查询的间隔
                let delay_seconds = match level {
                    6 | 10 | 14 => 1, // 接近关键等级，1秒一次
                    _ => 10,          // 其他时间，10秒一次
                };

                sleep(Duration::from_secs(delay_seconds)).await;
            } else {
                // 如果查询失败（可能游戏退出了），等待5秒重试
                sleep(Duration::from_secs(5)).await;
            }
        }

        // 任务结束，重置状态
        is_hex_running.store(false, Ordering::SeqCst);
        println!("Polling stopped.");
    });

    Ok(())
}

#[tauri::command]
pub async fn stop_hex_game_polling(state: State<'_, FrankState>) -> Result<(), String> {
    // 设置开关为 false，循环会在下一次执行前检测到并退出
    state.is_hex_running.store(false, Ordering::SeqCst);
    println!("Polling stopped by hand.");
    Ok(())
}

// 检查是否游戏窗口模式为无边框
#[tauri::command]
pub async fn check_borderless_mode(config_path: &str) -> Result<i32, String> {
    // 1. 如果文件不存在，按照要求返回 -1
    if !Path::new(config_path).exists() {
        return Ok(-1);
    }

    // 2. 加载配置文件
    let mut config = Ini::new();
    if let Err(e) = config.load(config_path) {
        return Err(format!("读取配置文件失败: {}", e));
    }

    // 3. 读取 [General] 下的 WindowMode
    if let Some(mode_str) = config.get("General", "WindowMode") {
        // 将字符串转换成整数 (i32)
        match mode_str.trim().parse::<i32>() {
            Ok(id) => Ok(id),
            Err(_) => Err(format!("配置项格式非法: {}", mode_str)),
        }
    } else {
        // 如果文件存在但没找到 WindowMode 字段，通常是因为文件损坏或版本不同
        // 这里可以根据需要返回一个特殊 ID 或错误
        Err("配置文件中缺少 WindowMode 项".into())
    }
}

// 设置游戏窗口模式为无边框
#[tauri::command]
pub async fn set_borderless_mode(config_path: &str) -> Result<String, String> {
    let path = Path::new(config_path);

    // 1. 检查文件是否存在
    if !path.exists() {
        return Err("找不到游戏配置文件，请确认路径是否正确。".into());
    }

    // 2. 处理只读属性 (这是关键，否则写入会失败)
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    let mut permissions = metadata.permissions();
    if permissions.readonly() {
        permissions.set_readonly(false);
        fs::set_permissions(path, permissions).map_err(|e| e.to_string())?;
    }

    // 3. 加载配置文件
    let mut config = Ini::new();
    // 强制保留原始大小写（League的cfg有时对大小写敏感）
    config.set_comment_symbols(&[';', '#']);

    config.load(config_path).map_err(|e| e.to_string())?;

    // 4. 修改配置项
    // WindowMode: 0=全屏, 1=窗口, 2=无边框
    config.set("General", "WindowMode", Some("2".to_string()));

    // 5. 写入文件
    match config.write(config_path) {
        Ok(_) => Ok("成功设置为无边框模式".into()),
        Err(e) => Err(format!("写入文件失败: {}", e)),
    }
}

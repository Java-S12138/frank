mod global_key;
mod listener;
mod matchlisthanle;

use matchlisthanle::MatchListDetails;

use crate::lcu::global_key::init_global_keyboard;
use crate::lcu::listener::listen_current_champ_select;
use crate::shaco::ingame;
use crate::shaco::rest::RESTClient;
use crate::shaco::utils::process_info::{get_auth_info, AuthResponse};
use configparser::ini::Ini;
use listener::{listen_champ_select, listen_client};
use once_cell::sync::OnceCell;
use serde_json::{from_value, Value};
use std::fs;
use std::path::Path;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

// 定义全局的 REST 客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> Result<&'static RESTClient, Value> {
    REST_CLIENT
        .get()
        .ok_or(Value::Null)
}

#[tauri::command]
pub async fn invoke_lcu(method: &str, uri: &str, body: &str) -> Result<Value, Value> {
    let client = get_client()?; // 获取全局的 REST_CLIENT
    if method == "get" {
        match client.get(uri).await {
            Ok(res) => Ok(res),
            Err(_) => Err(Value::Null),
        }
    } else if method == "patch" {
        let parsed = serde_json::from_str::<Value>(body).unwrap_or(Value::Null);
        match client.patch(uri, parsed).await {
            Ok(res) => Ok(res),
            Err(_) => Err(Value::Null),
        }
    } else if method == "post" {
        let parsed = serde_json::from_str::<Value>(body).unwrap_or(Value::Null);
        match client.post(uri, parsed).await {
            Ok(res) => Ok(res),
            Err(_) => Err(Value::Null),
        }
    } else if method == "delete" {
        match client.delete(uri).await {
            Ok(res) => Ok(res),
            Err(_) => Err(Value::Null),
        }
    } else {
        Ok(Value::Null)
    }
}

#[tauri::command]
pub async fn get_match_list(uri: &str) -> Result<MatchListDetails, Value> {
    let client = get_client()?;
    let res = match client.get(uri).await {
        Ok(res) => res,
        Err(_) => return Err(Value::Null),
    };
    match from_value::<MatchListDetails>(res) {
        Ok(match_list) => Ok(match_list),
        Err(_) => Err(Value::Null),
    }
}

#[tauri::command]
pub fn get_lol_region() -> Result<String, String> {
    match get_auth_info() {
        Ok(info) => Ok(info.region),
        Err(_) => Err("客户端未运行".to_string()),
    }
}

#[tauri::command]
pub fn listen_for_client_start(app: AppHandle) {
    tokio::spawn({
        async move {
            let start_time = Instant::now();
            let timeout = Duration::from_secs(180); // 设置一个超时时间，例如 180 秒

            loop {
                // 获取客户端信息
                let is_exist = get_auth_info();
                match is_exist {
                    Ok(value) => {
                        if let Ok(client) = RESTClient::new(value.token, value.port) {
                            let _ = REST_CLIENT
                                .set(client)
                                .map_err(|_| "REST_CLIENT is already initialized".to_string());
                            let _ = app.emit_to("background", "client_status", "ClientStarted");
                            break; // 找到客户端信息后退出循环
                        }
                    }
                    Err(_) => {}
                }

                // 超过指定的超时时间则退出
                if start_time.elapsed() > timeout {
                    println!("客户端启动超时，未能获取信息。");
                    break;
                }

                // 每隔一段时间重新检查
                tokio::time::sleep(Duration::from_secs(3)).await;
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

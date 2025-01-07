mod listener;
mod matchlisthanle;
mod global_key;

use matchlisthanle::{MatchListDetails};

use crate::lcu::global_key::init_global_keyboard;
use listener::{listen_client,listen_champ_select};
use crate::shaco::utils::process_info::get_auth_info;
use futures_util::stream::StreamExt;
use crate::shaco::rest::RESTClient;
use serde_json::{from_value, Value};
use tauri::{AppHandle, Emitter};
use once_cell::sync::OnceCell;
use serde::Serialize;
use tauri::ipc::IpcResponse;
use crate::shaco::{ingame};
use std::time::{Duration, Instant};
use std::thread;
use crate::lcu::listener::listen_current_champ_select;

// 定义全局的 REST 客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> Result<&'static RESTClient, String> {
    REST_CLIENT
        .get()
        .ok_or_else(|| "REST_CLIENT is not initialized".to_string())
}

#[tauri::command]
pub async fn invoke_lcu(method: &str, uri: &str,body:&str) -> Result<Value, Value> {
    let client = get_client()?; // 获取全局的 REST_CLIENT
    if method == "get" {
        let res = client.get(uri).await;
        match res {
            Ok(res) => {return  Ok(res)},
            Err(e) => {return  Err(Value::Null)}
        }
    }else if method == "patch" {
        let parsed: Value = serde_json::from_str(body).expect("Failed to parse JSON string");
        let _res = client.patch(uri,serde_json::json!(parsed)).await.unwrap();
    }else if method == "post" {
        let parsed = serde_json::from_str::<Value>(body);
        match parsed {
            Ok(parsed) => {
                let _res = client.post(uri,parsed).await.unwrap();
            },
            Err(e) => {
                let _res = client.post(uri,Value::Null).await.unwrap();
            }
        }
    }else if method == "delete" {
        let _res = client.delete(uri).await.unwrap();
    }
    Ok(Value::Null)
}

#[tauri::command]
pub async fn get_match_list(uri: &str) -> Result<MatchListDetails,Value> {
    let client = get_client()?;
    let res:Value = client.get(uri).await.expect("Failed to Url");
    match from_value::<MatchListDetails>(res.clone()) {
        Ok(match_list) => Ok(match_list),
        Err(e) => { Err(Value::Null) }
    }
}

#[tauri::command]
pub fn is_lol_cilent() -> bool {
    let is_exist = get_auth_info();
    match is_exist {
        Ok(_value) => {
            true
        },
        Err(_error) => false,
    }
}

#[tauri::command]
pub fn listen_for_client_start(app: AppHandle) {
    tokio::spawn({
        async move {
            let start_time = Instant::now();
            let timeout = Duration::from_secs(180);  // 设置一个超时时间，例如 30 秒

            loop {
                // 获取客户端信息
                let is_exist = get_auth_info();
                match is_exist {
                    Ok(value) => {
                        let _ = REST_CLIENT
                            .set(RESTClient::new(value.0,value.1).unwrap())
                            .map_err(|_| "REST_CLIENT is already initialized".to_string());
                        app.emit_to("background", "client_status", "ClientStarted").expect("sent background error");
                        break; // 找到客户端信息后退出循环
                    },
                    Err(_) => {}
                }

                // 超过指定的超时时间则退出
                if start_time.elapsed() > timeout {
                    println!("客户端启动超时，未能获取信息。");
                    break;
                }

                // 每隔一段时间重新检查
                thread::sleep(Duration::from_secs(3));  // 每秒钟检查一次
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
pub async fn is_game_start()-> bool {
    let client = ingame::IngameClient::new().expect("Game unstart");
    client.active_game_loadingscreen().await
}


#[tauri::command]
pub async fn init_keyboard(app: AppHandle) {
    tokio::spawn(async move {
        init_global_keyboard(app)
    });
}


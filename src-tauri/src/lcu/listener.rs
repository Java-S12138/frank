use crate::shaco::{model::ws::LcuSubscriptionType, ws};
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter, EventTarget};

pub async fn listen_client(app: AppHandle) {
    let mut client = ws::LcuWebsocketClient::connect().await.unwrap();
    client
        .subscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-gameflow/v1/gameflow-phase".to_string(),
        ))
        .await
        .unwrap();

    while let Some(event) = client.next().await {
        // println!("Event: {:?}", event);
        app.emit_to(
            EventTarget::labeled("background"),
            "client_status",
            event.data,
        )
            .unwrap();
    }
}

pub async fn listen_champ_select(app: AppHandle) {
    let mut client = ws::LcuWebsocketClient::connect().await.unwrap();
    client
        .subscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-champ-select/v1/session".to_string(),
        ))
        .await
        .unwrap();
    while let Some(event) = client.next().await {
        app.emit_to(
            EventTarget::labeled("background"),
            "lol-champ-select",
            event.data).unwrap();
    }
}

pub async fn listen_current_champ_select(app: AppHandle) {
    let mut client = ws::LcuWebsocketClient::connect().await.unwrap();
    client
        .unsubscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-champ-select/v1/session".to_string(),
        ))
        .await
        .unwrap();

    client
        .subscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-champ-select/v1/current-champion".to_string(),
        ))
        .await
        .unwrap();

    while let Some(event) = client.next().await {
        app.emit_to(
            EventTarget::labeled("background"),
            "lol-current-champ-select",
            event.data).unwrap();
    }
}
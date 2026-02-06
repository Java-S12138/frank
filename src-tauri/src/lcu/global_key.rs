use rdev::{listen, Event, EventType, Key};
use tauri::{AppHandle, Emitter, Manager};

pub fn init_global_keyboard(app: AppHandle) {
    let mut shift_state: bool = false;
    // 捕获全局键盘事件
    if let Err(error) = listen(move |event: Event| callback(event, &mut shift_state, &app)) {
        println!("Error: {:?}", error);
    }
}

fn callback(event: Event, shift_state: &mut bool, app: &AppHandle) {
    match event.event_type {
        // 处理按键按下事件
        EventType::KeyPress(key_event) => match key_event {
            Key::ShiftLeft | Key::ShiftRight => handle_shift_press(shift_state), // 同时也支持右侧 Shift
            Key::Tab => handle_tab_press(shift_state, app),
            Key::KeyZ => handle_z_press(shift_state, app), // 新增 Shift + Z
            Key::KeyX => handle_x_press(shift_state, app), // 新增 Shift + X
            _ => (),
        },

        // 处理按键释放事件
        EventType::KeyRelease(key_event) => {
            if (key_event == Key::ShiftLeft || key_event == Key::ShiftRight) && *shift_state {
                // 重置 Shift 键状态
                *shift_state = false;
            }
        }
        _ => (),
    }
}

// 处理 Shift 键按下
fn handle_shift_press(shift_state: &mut bool) {
    if !*shift_state {
        *shift_state = true;
    }
}

// 处理 Shift + Tab
fn handle_tab_press(shift_state: &mut bool, app: &AppHandle) {
    if *shift_state {
        // 如果你想让组合键触发后必须重新按下 Shift 才能触发下一个，可以保留下面这行
        // *shift_state = false;

        let win = app.get_webview_window("recentMatchWindow");
        if let Some(win) = win {
            if !win.is_visible().unwrap_or(false) {
                win.show().expect("show window failed");
            }
        }
    }
}

// --- 新增功能 ---

// 处理 Shift + Z
fn handle_z_press(shift_state: &mut bool, app: &AppHandle) {
    if *shift_state {
        if let Some(win) = app.get_webview_window("hexRecommend") {
            let _ = win.emit("game-update", 99);
        }
    }
}

// 处理 Shift + X
fn handle_x_press(shift_state: &mut bool, app: &AppHandle) {
    if *shift_state {
        if let Some(win) = app.get_webview_window("hexRecommend") {
            win.hide().expect("hide window failed");
        }
    }
}

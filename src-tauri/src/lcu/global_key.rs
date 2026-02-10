use rdev::{listen, Event, EventType, Key};
use tauri::{AppHandle, Manager};

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
            Key::Tab => handle_show_hide_window(shift_state, app, "recentMatchWindow"),
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
fn handle_show_hide_window(shift_state: &mut bool, app: &AppHandle, win_name: &str) {
    if *shift_state {
        if let Some(win) = app.get_webview_window(win_name) {
            // 检查窗口当前是否可见
            match win.is_visible() {
                Ok(true) => {
                    // 如果可见，则隐藏
                    win.hide().expect("hide window failed");
                }
                Ok(false) => {
                    // 如果隐藏，则显示
                    win.show().expect("show window failed");
                }
                Err(e) => {
                    // 处理错误情况
                    eprintln!("Error checking window visibility: {}", e);
                }
            }
        }
    }
}

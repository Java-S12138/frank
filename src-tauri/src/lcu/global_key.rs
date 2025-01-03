use rdev::{listen, Event, EventType, Key};
use tauri::{AppHandle, Manager};

pub fn init_global_keyboard(app: AppHandle) {
    let mut shift_state: bool = false;
    // Capture global keyboard events
    if let Err(error) = listen(move |event: Event| callback(event, &mut shift_state, &app)) {
        println!("Error: {:?}", error);
    }
}

fn callback(event: Event, shift_state: &mut bool, app: &AppHandle) {
    match event.event_type {
        // Handle key press events
        EventType::KeyPress(key_event) => match key_event {
            Key::ShiftLeft => handle_shift_press(shift_state),
            Key::Tab => handle_tab_press(shift_state, event, app),
            _ => (),
        },

        // Handle key release events
        EventType::KeyRelease(key_event) => {
            if key_event == Key::ShiftLeft && *shift_state {
                // Reset Shift key status
                *shift_state = false;
            }
        }
        _ => (),
    }
}

// 处理 Shift 键按下事件
fn handle_shift_press(shift_state: &mut bool) {
    if !*shift_state {
        // The Shift key is pressed for the first time
        *shift_state = true;
    }
}

// Handle Tab key press event
fn handle_tab_press(shift_state: &mut bool, event: Event, app: &AppHandle) {
    if *shift_state {
        *shift_state = false;
        let win = app.get_webview_window("recentMatchWindow");
        if let Some(win) = win {
            if !win.is_visible().unwrap_or(false) {
                win.show().expect("hide window failed");
            }
        }
    }
}

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{Manager, PhysicalPosition, WebviewWindow};
use windows::core::PCWSTR;
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_EXTENDED_FRAME_BOUNDS};
use windows::Win32::UI::WindowsAndMessaging::{FindWindowW, IsIconic, IsWindow};

pub struct LolTracker;

impl LolTracker {
    // 接收控制信号 is_enabled
    pub fn start_tracking(
        window: WebviewWindow,
        is_enabled: Arc<AtomicBool>,
        dock_side: Arc<Mutex<String>>,
    ) {
        thread::spawn(move || {
            let mut last_pos: Option<RECT> = None;
            let mut last_side: Option<String> = None;
            let mut was_visible = true;
            let mut is_tracked = false;

            loop {
                if window.inner_position().is_err() {
                    break;
                }

                if !is_enabled.load(Ordering::Relaxed) {
                    thread::sleep(Duration::from_millis(500));
                    continue;
                }

                unsafe {
                    let lol_info = Self::get_lol_visible_rect();
                    match lol_info {
                        Some((hwnd, visible_rect)) => {
                            let is_minimized = IsIconic(hwnd).as_bool();
                            let is_offscreen = visible_rect.left <= 0 && visible_rect.top <= 0;
                            if is_minimized || is_offscreen {
                                if was_visible {
                                    let _ = window.hide();
                                    was_visible = false;
                                }
                            } else {
                                if !is_tracked {
                                    is_tracked = true;
                                }
                                if !was_visible {
                                    let _ = window.show();
                                    was_visible = true;
                                    last_pos = None;
                                }

                                // 获取当前的吸附配置
                                let current_side = {
                                    let s = dock_side.lock().unwrap();
                                    s.clone()
                                };

                                // 核心逻辑：位置改变 OR 吸附方向改变
                                let pos_changed = !Self::is_same_pos(last_pos, visible_rect);
                                let side_changed = Some(&current_side) != last_side.as_ref();

                                // 检查位置或吸附方向是否变化
                                if pos_changed || side_changed {
                                    // 计算目标 X 坐标
                                    let target_x = if current_side == "Left" {
                                        visible_rect.left - 328 // 吸附在左侧
                                    } else {
                                        visible_rect.right - 8 // 吸附在右侧
                                    };

                                    let target_y = visible_rect.top - 2;

                                    let _ = window.set_position(PhysicalPosition {
                                        x: target_x,
                                        y: target_y,
                                    });
                                    last_pos = Some(visible_rect);
                                    last_side = Some(current_side);
                                }
                            }
                        }
                        None => {
                            if is_tracked {
                                std::process::exit(0);
                            }
                        }
                    }
                }
                thread::sleep(Duration::from_millis(16));
            }
        });
    }
    /// 获取 LOL 窗口真正的可见矩形（排除阴影）
    unsafe fn get_lol_visible_rect() -> Option<(HWND, RECT)> {
        // LOL 客户端可能有两种标题（大厅和游戏内）
        let titles = ["League of Legends"];
        for title in titles {
            let title_wide: Vec<u16> =
                std::os::windows::ffi::OsStrExt::encode_wide(std::ffi::OsStr::new(title))
                    .chain(std::iter::once(0))
                    .collect();

            let hwnd = FindWindowW(None, PCWSTR(title_wide.as_ptr()));

            if hwnd.0 != 0 && IsWindow(hwnd).as_bool() {
                let mut rect = RECT::default();
                // 使用 DWM 属性获取排除阴影后的真实尺寸
                let result = DwmGetWindowAttribute(
                    hwnd,
                    DWMWA_EXTENDED_FRAME_BOUNDS,
                    &mut rect as *mut _ as *mut _,
                    std::mem::size_of::<RECT>() as u32,
                );

                if result.is_ok() {
                    return Some((hwnd, rect));
                }
            }
        }
        None
    }

    fn is_same_pos(last: Option<RECT>, current: RECT) -> bool {
        match last {
            Some(old) => {
                old.left == current.left
                    && old.top == current.top
                    && old.right == current.right
                    && old.bottom == current.bottom
            }
            None => false,
        }
    }
}

pub struct AppState {
    pub is_enabled: Arc<AtomicBool>,
    pub is_running: Arc<AtomicBool>,   // 防止重复启动的锁
    pub dock_side: Arc<Mutex<String>>, // "Left" 或 "Right"
}

#[tauri::command]
pub fn sync_tracker_config(enabled: bool, side: String, state: tauri::State<'_, AppState>) {
    state.is_enabled.store(enabled, Ordering::Relaxed);
    {
        let mut dock = state.dock_side.lock().unwrap();
        *dock = side;
    }
}

#[tauri::command]
pub fn start_tracking_loop(state: tauri::State<'_, AppState>, window: tauri::WebviewWindow) {
    // 【防止重复启动的关键】
    // 如果 is_running 原本是 true，则 swap 返回 true，直接 return
    // 如果原本是 false，则设置为 true 并进入后续逻辑
    if state.is_running.swap(true, Ordering::SeqCst) {
        return;
    }
    let main_win = window
        .get_webview_window("mainWindow")
        .expect("not found mainWindow");
    LolTracker::start_tracking(main_win, state.is_enabled.clone(), state.dock_side.clone());
}

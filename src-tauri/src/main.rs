// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[allow(unused)]

fn main() {
    frank_lib::run();
}

use crate::shaco::error::ProcessInfoError;
use base64::{engine::general_purpose, Engine};
use sysinfo::{ProcessesToUpdate, System};

#[cfg(target_os = "windows")]
const TARGET_PROCESS: &str = "LeagueClientUx.exe";
// #[cfg(target_os = "linux")]
// const TARGET_PROCESS: &str = "LeagueClientUx.";
// #[cfg(target_os = "macos")]
// const TARGET_PROCESS: &str = "LeagueClientUx";

pub struct AuthResponse {
    pub token: String,
    pub port: String,
    pub region: String, // 即 rso_platform_id
}

pub(crate) fn get_auth_info() -> Result<AuthResponse, ProcessInfoError> {
    let mut sys = System::new_all();

    sys.refresh_processes(ProcessesToUpdate::All,true);

    let args = sys
        .processes()
        .values()
        .find(|p| p.name() == TARGET_PROCESS)
        .map(|p| p.cmd())
        .ok_or(ProcessInfoError::ProcessNotAvailable)?;

    let port = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--app-port="))
        .map(|arg| arg.to_string_lossy().strip_prefix("--app-port=").unwrap().to_string())
        .ok_or(ProcessInfoError::PortNotFound)?;
    let auth_token = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--remoting-auth-token="))
        .map(|arg| {
            arg.to_string_lossy().strip_prefix("--remoting-auth-token=")
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::AuthTokenNotFound)?;

    let rso_platform_id = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--rso_platform_id="))
        .map(|arg| arg.to_string_lossy().strip_prefix("--rso_platform_id=").unwrap().to_string())
        .ok_or(ProcessInfoError::PlatformIdNotFound)?;

    Ok(AuthResponse {
        token: general_purpose::STANDARD.encode(format!("riot:{}", auth_token)),
        port,
        region: rso_platform_id,
    })
}

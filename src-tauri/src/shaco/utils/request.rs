use std::time::Duration;

use reqwest::{header, Certificate};

pub(crate) fn build_reqwest_client(auth_token: Option<String>) -> reqwest::Client {
    let cert = Certificate::from_pem(include_bytes!("../riotgames.pem")).unwrap();
    let mut headers = header::HeaderMap::new();

    if let Some(token) = auth_token {
        let auth_header =
            header::HeaderValue::from_str(format!("Basic {}", token).as_str()).unwrap();
        headers.insert("Authorization", auth_header);
    }

    reqwest::ClientBuilder::new()
        .add_root_certificate(cert)
        .default_headers(headers)
        .timeout(Duration::from_millis(3000))
        .build()
        .unwrap()
}

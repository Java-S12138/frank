use std::{error::Error, fmt, fmt::Display};

/// Errors that can occur when trying to get the Riot process information
#[derive(Debug, Clone)]
pub(crate) enum ProcessInfoError {
    /// League client has not been started
    ProcessNotAvailable,
    /// There has been an error getting the API port
    PortNotFound,
    /// There has been an error getting the API auth token
    AuthTokenNotFound,
}

impl Error for ProcessInfoError {}

impl Display for ProcessInfoError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ProcessNotAvailable => write!(
                f,
                "{:?}: Riot/League client process could not be found",
                self
            ),
            Self::PortNotFound => write!(
                f,
                "{:?}: API port could not be parsed from process arguments",
                self
            ),
            Self::AuthTokenNotFound => write!(
                f,
                "{:?}: API auth token could not be parsed from process arguments",
                self
            ),
        }
    }
}

/// Errors for the Ingame API
#[derive(Debug, Clone)]
pub enum IngameClientError {
    /// An API might not be available yet during the loading screen
    ApiNotAvailableInSpectatorMode,
    ApiNotAvailableDuringLoadingScreen,
    /// An error occurred on the client side probably because of a malformed request \
    /// Corresponds to HTTP status responses 400 – 499, excluding 400 and 404 which are [IngameClientError::ApiNotAvailableInSpectatorMode] and [IngameClientError::ApiNotAvailableDuringLoadingScreen]
    ClientError(String),
    /// An error ocurred on the server side \
    /// Corresponds to HTTP status responses 500 – 599
    ServerError(String),
    /// There was an error deserializing the received data
    DeserializationError(String),
    /// All errors not caught by the other [IngameClientError] variants are categorised as a [IngameClientError::ConnectionError]
    ConnectionError(String),
}

impl From<reqwest::Error> for IngameClientError {
    fn from(error: reqwest::Error) -> Self {
        if let Some(status) = error.status() {
            if status == 400 {
                return IngameClientError::ApiNotAvailableInSpectatorMode;
            } else if status == 404 {
                return IngameClientError::ApiNotAvailableDuringLoadingScreen;
            } else if status.is_client_error() {
                return IngameClientError::ClientError(status.to_string());
            } else if status.is_server_error() {
                return IngameClientError::ServerError(status.to_string());
            }
        }
        if error.is_decode() {
            return IngameClientError::DeserializationError(error.to_string());
        }
        IngameClientError::ConnectionError(error.to_string())
    }
}

impl Error for IngameClientError {}

impl Display for IngameClientError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(self, f)
    }
}

/// Errors for the Websocket connection to the LCU API
#[derive(Debug, Clone)]
pub enum LcuWebsocketError {
    /// The Lcu API can't be reached
    LcuNotAvailable(String),
    /// There was an error preparing the authentication credentials for the connection
    AuthError,
    /// There was an error sending a un-/subscrive messaage to the API
    SendError,
    /// The connection was terminated
    Disconnected(String),
}

impl Error for LcuWebsocketError {}

impl Display for LcuWebsocketError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::LcuNotAvailable(s) => write!(f, "LCU API not available: {}", s),
            Self::AuthError => write!(f, "Authentication error"),
            Self::SendError => write!(f, "Error sending message"),
            Self::Disconnected(s) => write!(f, "Websocket disconnected: {}", s),
        }
    }
}

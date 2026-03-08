use thiserror::Error;

/// Errors that can occur when trying to get the Riot process information
#[derive(Debug, Clone,Error)]
pub(crate) enum ProcessInfoError {
    /// League client has not been started
    #[error("Riot/League client process could not be found")]
    ProcessNotAvailable,
    /// There has been an error getting the API port
    #[error("API port could not be parsed from process arguments")]
    PortNotFound,
    /// There has been an error getting the API auth token
    #[error("API auth token could not be parsed from process arguments")]
    AuthTokenNotFound,
    /// There has been an error getting the RSO platform ID
    #[error("RSO platform ID could not be parsed from process arguments")]
    PlatformIdNotFound,
}

/// Errors for the Ingame API
#[derive(Error, Debug, Clone)]
pub enum IngameClientError {
    /// An API might not be available yet during the loading screen
    #[error("API not available in spectator mode")]
    ApiNotAvailableInSpectatorMode,

    /// An API might not be available yet during the loading screen
    #[error("API not available during loading screen")]
    ApiNotAvailableDuringLoadingScreen,

    /// An error occurred on the client side probably because of a malformed request
    /// Corresponds to HTTP status responses 400 – 499, excluding 400 and 404
    #[error("Client error: {0}")]
    ClientError(String),

    /// An error occurred on the server side
    /// Corresponds to HTTP status responses 500 – 599
    #[error("Server error: {0}")]
    ServerError(String),

    /// There was an error deserializing the received data
    #[error("Deserialization error: {0}")]
    DeserializationError(String),

    /// All errors not caught by the other variants
    #[error("Connection error: {0}")]
    ConnectionError(String),
}

impl From<reqwest::Error> for IngameClientError {
    fn from(error: reqwest::Error) -> Self {
        if let Some(status) = error.status() {
            match status.as_u16() {
                400 => return Self::ApiNotAvailableInSpectatorMode,
                404 => return Self::ApiNotAvailableDuringLoadingScreen,
                _ if status.is_client_error() => return Self::ClientError(status.to_string()),
                _ if status.is_server_error() => return Self::ServerError(status.to_string()),
                _ => {}
            }
        }
        if error.is_decode() {
            return Self::DeserializationError(error.to_string());
        }
        Self::ConnectionError(error.to_string())
    }
}

/// Errors for the Websocket connection to the LCU API
#[derive(Error, Debug, Clone)]
pub enum LcuWebsocketError {
    /// The Lcu API can't be reached
    #[error("LCU API not available: {0}")]
    LcuNotAvailable(String),

    /// There was an error preparing the authentication credentials for the connection
    #[error("Authentication error")]
    AuthError,

    /// There was an error sending a un-/subscribe message to the API
    #[error("Error sending message")]
    SendError,

    /// The connection was terminated
    #[error("Websocket disconnected: {0}")]
    Disconnected(String),
}

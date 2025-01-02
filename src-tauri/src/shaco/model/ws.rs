use std::{fmt, fmt::Display};

use serde::{de, Deserialize, Deserializer};
use serde_json::Value;

/// The Websocket connection returns LcuEvents
#[derive(Debug, Clone)]
pub struct LcuEvent {
    pub subscription_type: LcuSubscriptionType,
    pub data: Value,
    pub event_type: String,
}

/// LcuEvents first get deserialized to deserialize::DeEvent and then to LcuEvent
/// because the data formats are not directly deserializable by serde
impl<'de> Deserialize<'de> for LcuEvent {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        /// Intermediate data-structure for deserializing LcuEvents
        #[derive(Deserialize, Debug)]
        pub struct DeEvent {
            _opcode: i64,
            pub(crate) subscription_type: LcuSubscriptionType,
            pub(crate) data: Data,
        }
        /// Intermediate data-structure for deserializing LcuEvents
        #[derive(Deserialize, Debug)]
        #[serde(rename_all = "camelCase")]
        pub struct Data {
            pub(crate) data: Value,
            pub(crate) event_type: String,
        }

        let de_event = DeEvent::deserialize(deserializer)?;
        Ok(Self {
            subscription_type: de_event.subscription_type,
            data: de_event.data.data,
            event_type: de_event.data.event_type,
        })
    }
}

/// The Websocket events to subscribe to.
/// Look at the in-official documentation for event strings to subscribe to.
///
/// <https://www.mingweisamuel.com/lcu-schema/tool/#/>
///
/// e.g.: [LcuSubscriptionType::JsonApiEvent]\("/lol-gameflow/v1/gameflow-phase".to_string())
#[derive(Debug, Clone)]
pub enum LcuSubscriptionType {
    AllJsonApiEvents,
    AllLcdsEvents,
    JsonApiEvent(String),
    LcdsEvent(String),
}

impl Display for LcuSubscriptionType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LcuSubscriptionType::AllJsonApiEvents => f.write_str("OnJsonApiEvent"),
            LcuSubscriptionType::AllLcdsEvents => f.write_str("OnJsonApiEvent"),
            LcuSubscriptionType::JsonApiEvent(s) => f.write_str(&format!(
                "OnJsonApiEvent_{}",
                s.trim_start_matches('/').replace('/', "_")
            )),
            LcuSubscriptionType::LcdsEvent(s) => f.write_str(&format!(
                "OnLcdsEvent_{}",
                s.trim_start_matches('/').replace('/', "_")
            )),
        }
    }
}

/// Custom deserializer to differentiate between the different subscription types
impl<'de> Deserialize<'de> for LcuSubscriptionType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;

        if s.starts_with("OnJsonApiEvent") {
            if s.len() > 14 {
                Ok(LcuSubscriptionType::JsonApiEvent(s[15..].to_string()))
            } else {
                Ok(LcuSubscriptionType::AllJsonApiEvents)
            }
        } else if s.starts_with("OnLcdsApiEvent") {
            if s.len() > 14 {
                Ok(LcuSubscriptionType::LcdsEvent(s[15..].to_string()))
            } else {
                Ok(LcuSubscriptionType::AllLcdsEvents)
            }
        } else {
            Err(de::Error::custom(format!(
                "Unknown SubscriptionType: {}",
                s
            )))
        }
    }
}

//! # Shaco
//!
//! A wrapper for the League-Client and LoL-Ingame APIs
//!
//! - [RESTClient](rest::RESTClient): A REST client for the League-Client(LCU) API
//! - [LcuWebsocketClient](ws::LcuWebsocketClient): Subscription based Websocket API for the League-Client(LCU) API
//! - [IngameClient](ingame::IngameClient): A REST client for the LoL-Ingame API
//! - [EventStream](ingame::EventStream): A wrapper around polling ingame events implementing the [futures_util::Stream] Trait
//!
//! If you are looking for a Rust library for the Riot Games API see [Riven](https://docs.rs/riven/latest/riven/)

/// Error types for the whole library
pub mod error;
/// Contains the [IngameClient](ingame::IngameClient) and [IngameClient](ingame::EventStream)
pub mod ingame;
/// Contains all the type definitions for the data returned by the library
pub mod model;
/// Contains the [RESTClient](rest::RESTClient)
pub mod rest;
mod utils;
/// Contains the [LcuWebsocketClient](ws::LcuWebsocketClient)
pub mod ws;

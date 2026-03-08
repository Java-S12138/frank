use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Bans {
    champion_id: i16,
    pick_turn: i16,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Games {
    games: Vec<Games1>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Games1 {
    end_of_game_result: String,
    game_creation: i64,
    game_creation_date: String,
    game_duration: i16,
    game_id: i64,
    game_mode: String,
    game_type: String,
    game_version: String,
    map_id: i16,
    participant_identities: Vec<ParticipantIdentities>,
    participants: Vec<Participants>,
    platform_id: String,
    queue_id: i16,
    season_id: i16,
    teams: Vec<Teams>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ParticipantIdentities {
    participant_id: i16,
    player: Player,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Participants {
    champion_id: i16,
    highest_achieved_season_tier: String,
    participant_id: i16,
    spell1_id: i16,
    spell2_id: i16,
    stats: Stats,
    team_id: i16,
    timeline: Timeline,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Player {
    account_id: i64,
    current_account_id: i64,
    current_platform_id: String,
    game_name: String,
    match_history_uri: String,
    platform_id: String,
    profile_icon: i16,
    puuid: String,
    summoner_id: i64,
    summoner_name: String,
    tag_line: String,
}

// #[derive(Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// struct RootInterface {
//     account_id: i64,
//     games: Games,
//     platform_id: String,
// }

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Stats {
    assists: i16, //1
    champ_level: i16,//1
    deaths: i16,// 1
    item0: i32,//1
    item1: i32,//1
    item2: i32,//1
    item3: i32,//1
    item4: i32,//1
    item5: i32,//1
    item6: i32,//1
    kills: i16, //1
    win: bool,// 1
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Teams {
    bans: Vec<Bans>,
    baron_kills: i16,
    dominion_victory_score: i16,
    dragon_kills: i16,
    first_baron: bool,
    first_blood: bool,
    first_dargon: bool,
    first_inhibitor: bool,
    first_tower: bool,
    horde_kills: i16,
    inhibitor_kills: i16,
    rift_herald_kills: i16,
    team_id: i16,
    tower_kills: i16,
    vilemaw_kills: i16,
    win: String,
}

#[derive(Serialize, Deserialize)]
struct Timeline {
    lane: String,
    participant_id: i16,
    role: String,
}

#[derive(Serialize, Deserialize)]
pub struct MatchListDetails {
    pub account_id: i64,
    pub games:Games,
    pub platform_id:String,
}
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Bans {
    championId: i16,
    pickTurn: i16,
}

#[derive(Serialize, Deserialize)]
struct Games {
    games: Vec<Games1>,
}

#[derive(Serialize, Deserialize)]
struct Games1 {
    endOfGameResult: String,
    gameCreation: i64,
    gameCreationDate: String,
    gameDuration: i16,
    gameId: i64,
    gameMode: String,
    gameType: String,
    gameVersion: String,
    mapId: i16,
    participantIdentities: Vec<ParticipantIdentities>,
    participants: Vec<Participants>,
    platformId: String,
    queueId: i16,
    seasonId: i16,
    teams: Vec<Teams>,
}

#[derive(Serialize, Deserialize)]
struct ParticipantIdentities {
    participantId: i16,
    player: Player,
}

#[derive(Serialize, Deserialize)]
struct Participants {
    championId: i16,
    highestAchievedSeasonTier: String,
    participantId: i16,
    spell1Id: i16,
    spell2Id: i16,
    stats: Stats,
    teamId: i16,
    timeline: Timeline,
}

#[derive(Serialize, Deserialize)]
struct Player {
    accountId: i64,
    currentAccountId: i64,
    currentPlatformId: String,
    gameName: String,
    matchHistoryUri: String,
    platformId: String,
    profileIcon: i16,
    puuid: String,
    summonerId: i64,
    summonerName: String,
    tagLine: String,
}

#[derive(Serialize, Deserialize)]
struct RootInterface {
    accountId: i64,
    games: Games,
    platformId: String,
}

#[derive(Serialize, Deserialize)]
struct Stats {
    assists: i16, //1
    champLevel: i16,//1
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
struct Teams {
    bans: Vec<Bans>,
    baronKills: i16,
    dominionVictoryScore: i16,
    dragonKills: i16,
    firstBaron: bool,
    firstBlood: bool,
    firstDargon: bool,
    firstInhibitor: bool,
    firstTower: bool,
    hordeKills: i16,
    inhibitorKills: i16,
    riftHeraldKills: i16,
    teamId: i16,
    towerKills: i16,
    vilemawKills: i16,
    win: String,
}

#[derive(Serialize, Deserialize)]
struct Timeline {
    lane: String,
    participantId: i16,
    role: String,
}

#[derive(Serialize, Deserialize)]
pub struct MatchListDetails {
    pub accountId: i64,
    pub games:Games,
    pub platformId:String,
}


/*assists: i16, //1
causedEarlySurrender: bool,
champLevel: i16,//1
combatPlayerScore: i16,
damageDealtToObjectives: i32,
damageDealtToTurrets: i32,
damageSelfMitigated: i32,
deaths: i16,// 1
doubleKills: i16,
earlySurrenderAccomplice: bool,
firstBloodAssist: bool,
firstBloodKill: bool,
firstInhibitorAssist: bool,
firstInhibitorKill: bool,
firstTowerAssist: bool,
firstTowerKill: bool,
gameEndedInEarlySurrender: bool,
gameEndedInSurrender: bool,
goldEarned: i16,
goldSpent: i16,
inhibitorKills: i16,
item0: i16,//1
item1: i16,//1
item2: i16,//1
item3: i16,//1
item4: i16,//1
item5: i16,//1
item6: i16,//1
killingSprees: i16,
kills: i16, //1
largestCriticalStrike: i16,
largestKillingSpree: i16,
largestMultiKill: i16,
longestTimeSpentLiving: i16,
magicDamageDealt: i32,
magicDamageDealtToChampions: i32,
magicalDamageTaken: i32,
neutralMinionsKilled: i16,
neutralMinionsKilledEnemyJungle: i16,
neutralMinionsKilledTeamJungle: i16,
objectivePlayerScore: i16,
participantId: i16,
pentaKills: i16,
perk0: i16,
perk0Var1: i16,
perk0Var2: i16,
perk0Var3: i16,
perk1: i16,
perk1Var1: i16,
perk1Var2: i16,
perk1Var3: i16,
perk2: i16,
perk2Var1: i16,
perk2Var2: i16,
perk2Var3: i16,
perk3: i16,
perk3Var1: i16,
perk3Var2: i16,
perk3Var3: i16,
perk4: i16,
perk4Var1: i16,
perk4Var2: i16,
perk4Var3: i16,
perk5: i16,
perk5Var1: i16,
perk5Var2: i16,
perk5Var3: i16,
perkPrimaryStyle: i16,
perkSubStyle: i16,
physicalDamageDealt: i32,
physicalDamageDealtToChampions: i32,
physicalDamageTaken: i32,
playerAugment1: i16,
playerAugment2: i16,
playerAugment3: i16,
playerAugment4: i16,
playerAugment5: i16,
playerAugment6: i16,
playerScore0: i16,
playerScore1: i16,
playerScore2: i16,
playerScore3: i16,
playerScore4: i16,
playerScore5: i16,
playerScore6: i16,
playerScore7: i16,
playerScore8: i16,
playerScore9: i16,
playerSubteamId: i16,
quadraKills: i16,
sightWardsBoughtInGame: i16,
subteamPlacement: i16,
teamEarlySurrendered: bool,
timeCCingOthers: i16,
totalDamageDealt: i32,
totalDamageDealtToChampions: i32,
totalDamageTaken: i32,
totalHeal: i16,
totalMinionsKilled: i16,
totalPlayerScore: i16,
totalScoreRank: i16,
totalTimeCrowdControlDealt: i16,
totalUnitsHealed: i16,
tripleKills: i16,
trueDamageDealt: i32,
trueDamageDealtToChampions: i32,
trueDamageTaken: i32,
turretKills: i16,
unrealKills: i16,
visionScore: i16,
visionWardsBoughtInGame: i16,
wardsKilled: i16,
wardsPlaced: i16,
win: bool,// 1*/
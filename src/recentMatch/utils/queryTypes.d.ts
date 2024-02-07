export interface PlayerChampionSelection {
  championId: number;
  selectedSkinIndex: number;
  spell1Id: number;
  spell2Id: number;
  summonerInternalName: string;
}

export interface GameTypeConfig {
  advancedLearningQuests: boolean;
  allowTrades: boolean;
  banMode: string;
  banTimerDuration: number;
  battleBoost: boolean;
  crossTeamChampionPool: boolean;
  deathMatch: boolean;
  doNotRemove: boolean;
  duplicatePick: boolean;
  exclusivePick: boolean;
  id: number;
  learningQuests: boolean;
  mainPickTimerDuration: number;
  maxAllowableBans: number;
  name: string;
  onboardCoopBeginner: boolean;
  pickMode: string;
  postPickTimerDuration: number;
  reroll: boolean;
  teamChampionPool: boolean;
}

export interface QueueReward {
  isChampionPointsEnabled: boolean;
  isIpEnabled: boolean;
  isXpEnabled: boolean;
  partySizeIpRewards: any[];
}

export interface Queue {
  allowablePremadeSizes: number[];
  areFreeChampionsAllowed: boolean;
  assetMutator: string;
  category: string;
  championsRequiredToPlay: number;
  description: string;
  detailedDescription: string;
  gameMode: string;
  gameTypeConfig: GameTypeConfig;
  id: number;
  isRanked: boolean;
  isTeamBuilderManaged: boolean;
  lastToggledOffTime: number;
  lastToggledOnTime: number;
  mapId: number;
  maximumParticipantListSize: number;
  minLevel: number;
  minimumParticipantListSize: number;
  name: string;
  numPlayersPerTeam: number;
  queueAvailability: string;
  queueRewards: QueueReward;
  removalFromGameAllowed: boolean;
  removalFromGameDelayMinutes: number;
  shortName: string;
  showPositionSelector: boolean;
  spectatorEnabled: boolean;
  type: string;
}


export interface TeamData {
  championId: number;
  lastSelectedSkinIndex: number;
  profileIconId: number;
  puuid: string;
  selectedPosition: string;
  selectedRole: string;
  summonerId: number;
  summonerInternalName: string;
  summonerName: string;
  teamOwner: boolean;
  teamParticipantId: number;
}

export interface GameDataTypes {
  gameId: number;
  gameName: string;
  isCustomGame: boolean;
  password: string;
  playerChampionSelections: PlayerChampionSelection[];
  queue: Queue;
  spectatorsAllowed: boolean;
  teamOne: TeamData[];
  teamTwo: TeamData[];
}
export interface SessionTypes {
  gameClient: any;
  gameData: GameDataTypes;
  gameDodge: any;
  map: any;
  phase: string;
}
export interface RecentSumInfo {
  summonerId: number;
  rankPoint: string[];
  summonerName: string;
  puuid: string;
  summonerState: string;
  championUrl: string;
  teamParticipantId: number;
  matchList:MatchItemTypes[];
}
export interface RecentAllSumInfo {
  friendList:RecentSumInfo[];
  enemyList:RecentSumInfo[];
  queueId:number;
}
export interface MatchItemTypes {
  champImg: string;
  kills: number;
  deaths: number;
  assists: number;
  isWin: boolean;
  gameId: number;
  queueId: number;
}
export interface SuperChampTypes {
  championId: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  formattedChampionPoints: string;
  formattedMasteryGoal: string;
  highestGrade: string;
  lastPlayTime: number;
  playerId: number;
  tokensEarned: number;
}

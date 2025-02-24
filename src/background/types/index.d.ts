export interface ConfigSettingTypes {
  autoPickChampion: { championId: string; isAuto: boolean };
  autoBanChampion: { championId: string; isAuto: boolean };
  autoIsOne:boolean;
  autoAccept: number;
  theme: string;
  isGameInWindow:boolean;
  isGameInTips:boolean;
  autoWriteBlock:boolean;
  inWinOpacity:number;
  warmTips:{
    autoRune:boolean,
    rankTips:boolean,
    teamTips:boolean,
  }
}
export interface ConfigRank {
  tier: number;
  lane: string;
  is101: boolean;
}
export interface sumInfoTypes{
  name:string;
  puuid:string;
  summonerId:number;
  platformId:string;
}

export interface ChampionSession {
  actions:              Array<Action[]>;
  allowBattleBoost:     boolean;
  allowDuplicatePicks:  boolean;
  allowLockedEvents:    boolean;
  allowRerolling:       boolean;
  allowSkinSelection:   boolean;
  bans:                 Bans;
  benchChampions:       any[];
  benchEnabled:         boolean;
  boostableSkinCount:   number;
  chatDetails:          ChatDetails;
  counter:              number;
  gameId:               number;
  hasSimultaneousBans:  boolean;
  hasSimultaneousPicks: boolean;
  isCustomGame:         boolean;
  isSpectating:         boolean;
  localPlayerCellId:    number;
  lockedEventIndex:     number;
  myTeam:               MyTeam[];
  pickOrderSwaps:       any[];
  recoveryCounter:      number;
  rerollsRemaining:     number;
  skipChampionSelect:   boolean;
  theirTeam:            any[];
  timer:                Timer;
  trades:               any[];
}

export interface Action {
  actorCellId:  number;
  championId:   number;
  completed:    boolean;
  id:           number;
  isAllyAction: boolean;
  isInProgress: boolean;
  pickTurn:     number;
  type:         string;
}

export interface Bans {
  myTeamBans:    any[];
  numBans:       number;
  theirTeamBans: any[];
}

export interface ChatDetails {
  mucJwtDto:             MucJwtDto;
  multiUserChatId:       string;
  multiUserChatPassword: string;
}

export interface MucJwtDto {
  channelClaim: string;
  domain:       string;
  jwt:          string;
  targetRegion: string;
}

export interface MyTeam {
  assignedPosition:     string;
  cellId:               number;
  championId:           number;
  championPickIntent:   number;
  nameVisibilityType:   string;
  obfuscatedPuuid:      string;
  obfuscatedSummonerId: number;
  puuid:                string;
  selectedSkinId:       number;
  spell1Id:             number;
  spell2Id:             number;
  summonerId:           number;
  team:                 number;
  wardSkinId:           number;
}

export interface Timer {
  adjustedTimeLeftInPhase: number;
  internalNowInEpochMs:    number;
  isInfinite:              boolean;
  phase:                   string;
  totalTimeInPhase:        number;
}

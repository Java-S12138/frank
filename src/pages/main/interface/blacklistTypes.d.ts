export interface PlayerInfo {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  playerId: string;
  haterIdList: string;
}

export interface OnlineBlacklistTpye {
  sumIdList: string[],
  nickname: string
}

export interface Hater {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  sumId: string;
  area: string;
  nickName: string;
  signCount: number;
  blacklist: HaterItem[];
}

export interface HaterItem {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  hId: number;
  playerSumName: string;
  playerSumId: string;
  matchId: string;
  sumId: string;
  tag: string;
  content: string;
  handAdd: boolean;
  isShow: boolean;
}

export interface PCSelections {
  championId: number;
  selectedSkinIndex: number;
  spell1Id: number;
  spell2Id: number;
  summonerInternalName: string;
}

export interface SumListDetail {
  name: string,
  summonerId: number,
  selectChamp: string,
  index: number
}

export interface SummonerInfoList {
  name: string,
  summonerId: string,
  puuid: string,
  profileIconId:number,
  summonerLevel:number
}

export interface PlayerInfo {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  playerId: string;
  haterIdList: string;
}

export interface OnlineBlacklistTpye {
  nickname:string,
  playerSumId:string
  sumIdList:string[]
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

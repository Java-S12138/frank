export interface UserInfos {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  playerId: string;
  haterIdList: string;
}

export interface ExsitDataTypes {
  nickname: string,
  sumIdList: string[]
}

export interface SumIdToHateListType {
  [summonerId: string]: ExsitDataTypes
}

export interface HateIdListType {
  [platformId: string]: SumIdToHateListType
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

export interface HaterStructTypes {
  sumId: string;
  area: string;
  nickName: string;
  signCount: number;
  isShow: boolean;
}
export interface BlacklistListTypes {
  list:HaterItem[]
}

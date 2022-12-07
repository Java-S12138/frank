export interface OnlineBlacklist {
  nickname:string,
  playerSumId:string
  sumIdList:string[]
}

export interface Hater {
  iD: number;
  createdAt: string;
  updatedAt: string;
  sumId: string;
  area: string;
  nickName: string;
  signCount: number;
  blacklist: HaterItem[];
}

export interface HaterItem {
  iD: number;
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

export interface lcuSummonerInfo {
  accountId: number;
  displayName: string;
  internalName: string;
  nameChangeFlag: boolean;
  percentCompleteForNextLevel: number;
  privacy: string;
  profileIconId: number;
  puuid: string;
  rerollPoints: IRerollPoint;
  summonerId: number;
  summonerLevel: number;
  unnamed: boolean;
  xpSinceLastLevel: number;
  xpUntilNextLevel: number;
}

interface IRerollPoint {
  currentPoints: number;
  maxRolls: number;
  numberOfRolls: number;
  pointsCostToRoll: number;
  pointsToReroll: number;
}

export interface summonerInfo {
  name:string,
  imgUrl:string,
  lv:string,
  xpSL:number,
  xpNL:number,
  puuid:string,
  currentId:number
}

interface Statstone {
  championId: string;
  name: string;
  imgUrl: string;
  value: string;
}

export interface CurrentSummonerInfo {
  rank: any[];
  honorData: string[];
  champLevel: any[][];
  statstones: Statstone[];
}

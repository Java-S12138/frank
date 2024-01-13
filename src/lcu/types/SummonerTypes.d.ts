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
  httpStatus?:number
  tagLine:string
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
  lv:string|number,
  xpSL:number,
  xpNL:number,
  puuid:string,
  currentId:number,
  tagLine:string|undefined
}

interface Statstone {
  championId: string;
  name: string;
  imgUrl: string;
  value: string;
}

export interface SummonerData {
  summonerInfo:summonerInfo|null;
  rankList: [string,string,string]|null;
  honorData: string[]|null;
  champLevel: any[][]|null;
  statstones: Statstone[]|null;
}

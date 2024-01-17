import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";

export interface MyTeamObject {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  nameVisibilityType: string;
  obfuscatedPuuid: string;
  obfuscatedSummonerId: number;
  puuid: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
}
export interface SummonerInfoList {
  name: string,
  summonerId: string,
  puuid: string,
  profileIconId:number,
  match:{
    rank:string,
    recentMatchList:SimpleMatchTypes[]
  }
}
export interface SummonerDetailTypes {
  name:string,
  summonerId:string,
  puuid:string
  rank:string,
  profileIconId:number,
  matchList:SimpleMatchTypes[]
}

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
  profileIconId: number,
  rank: string,
}

export interface CurrentSumInfoTypes {
  kda:number,
  name: string,
  puuid: string
  rank: string,
  profileIconId: number,
  index: number,
}

export interface RoleCountMapTypes {
  assassin: number;
  fighter: number;
  mage: number;
  marksman: number;
  support: number;
  tank: number;
}

export interface RencentDataAnalysisTypes {
  top3Champions: { champId: number; count: number; }[],
  totalChampions: number,
  roleCountMap: RoleCountMapTypes
}

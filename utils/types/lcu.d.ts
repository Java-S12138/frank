export interface credentials {
  port:string|number
  pid:number
  password:string
  certificate:string
}

export interface champMastery {
  championId: number
  championLevel: number
  championPoints: number
  championPointsSinceLastLevel: number
  championPointsUntilNextLevel: number
  chestGranted: boolean
  formattedChampionPoints: string
  formattedMasteryGoal: string
  highestGrade: string
  lastPlayTime: number
  playerId: number
  tokensEarned: number
}

export interface summonerInfo {
  name: string;
  imgUrl: string;
  lv: string;
}

interface ChapmLevel {
  0: string;
  1: number;
  2: number;
}

export interface homeData {
  rank: string[];
  carry: string[];
  honorData: string[];
  chapmLevel: ChapmLevel[];
}
export interface ConfigSettingTypes {
  autoPickChampion: { championId: string; isAuto: boolean };
  autoBanChampion: { championId: string; isAuto: boolean };
  autoIsOne:boolean;
  autoAccept: number;
  theme: string;
  isGameInWindow:boolean;
  isGameInTips:boolean;
  autoWriteBlock:boolean;
}

export interface ConfigRank {
  tier: number;
  lane: string;
  is101: boolean;
}
export interface GameInfo {
  credentials: { port: string; token: string };
  game_flow: { phase: string };
  game_info: { game_version: string };
  summoner_info: {
    web_language: string;
    web_region: string;
    summoner_id: number;
    summoner_level: number;
    account_id: number;
    internal_name: string;
    platform_id: string;
    profile_icon_id: number;
    locale: string;
    region: string;
    display_name: string
  };
  json_api_event: { raw_data: string };
}

export interface sumInfoTypes{
  name:string
  summonerId:number;
  platformId:string;
}

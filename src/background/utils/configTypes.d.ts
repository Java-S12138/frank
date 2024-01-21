export interface ConfigSettingTypes {
  autoPickChampion: { championId: string; isAuto: boolean };
  autoBanChampion: { championId: string; isAuto: boolean };
  autoIsOne:boolean;
  autoAccept: number;
  theme: string;
}

export interface ConfigRank {
  tier: number;
  lane: string;
  is101: boolean;
}

export interface ChampInfo {
  sortId: number;
  imgUrl: string;
  name: string;
  tLevel: string;
  win: string;
  ban: string;
  appearance: string;
  champId: number;
}

export interface ChampDetailDrawer {
  champId: number;
  lane: string;
  tier: number;
  is101: boolean;
  selectedList: string[];
}

export interface Item {
  id: string;
  count: number;
}

export interface Block {
  type: string;
  items: Item[];
}

export interface ItemBuild {
  title: string;
  associatedMaps: number[];
  associatedChampions: number[];
  blocks: Block[];
  map: string;
  mode: string;
  preferredItemSlots: any[];
  sortrank: number;
  startedFrom: string;
  type: string;
}

export interface Rune {
  alias: string;
  name: string;
  position: string;
  pickCount: number;
  winRate?: string;
  primaryStyleId: number;
  subStyleId: number;
  selectedPerkIds: number[];
  score?: number;
  type?: string;
}

export interface OnlineRunes {
  index: number;
  id: string;
  version: string;
  officialVersion: string;
  pickCount: number;
  winRate: string;
  timestamp: number;
  alias: string;
  name: string;
  position: string;
  skills: string[];
  spells?: any;
  itemBuilds: ItemBuild[];
  runes: Rune[];
  skillsImg: string[];
}

export interface RuneStoreState {
  currentChamp: number
  currentChampImgUrl: string
  currentChampAlias: string
  currentChampTitle: string
  runeDataList: Rune[]
  blockDataList: {position:string,buildItems:ItemBuild,ps:string}[]
  skillsList: string[][],
  hexItemList:  string[][],
  hexAugments:Augments|null,
}

export interface RuneStoreActions {
  mapChampInfo(champId: number): void
  initStore(champId: number,queueId:number): Promise<boolean>
}

export interface HexInfoTypes {
  augments:  Augments;
  items:     Array<string[]>;
  skillsImg: string[];
  skills:    string[];
}

export interface Augments {
  sliver: Gold[];
  gold:   Gold[];
  prism:  Gold[];
}

export interface Gold {
  name:  string;
  desc:  string;
  level: string;
  skill: string;
}

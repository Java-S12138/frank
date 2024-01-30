import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {RencentDataAnalysisTypes} from "@/main/views/teammate/teammateTypes";

export interface SummonerAnaInfo {
  name: string;
  summonerId: string;
  queueId: number;
  isThumbUp: boolean;
  showType: boolean;
  imgUrl: string;
  rankList: string[];
  matchList: SimpleMatchTypes[];
  matchAnalysis:  RencentDataAnalysisTypes;
  openDetailDrawer:  (gameId:number,summonerId:number) => void;
}

import {defineStore} from "pinia";
import {SummonerInfoList} from "@/main/pages/assist/views/teammate/teammateTypes";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";

export const useTeammateStore = defineStore('useTeammate', {
  state: () => {
    return {
      summonerInfo: [] as SummonerInfoList[],
      recentMatchList: [] as SimpleMatchTypes[][],
      masteryChampList:[] as string[][][],
      isLcuErr:false
    }
  },
  actions: {
    clearStore(){
      this.summonerInfo = []
      this.recentMatchList = []
      this.masteryChampList = []
      this.isLcuErr = false
    },
  }
})

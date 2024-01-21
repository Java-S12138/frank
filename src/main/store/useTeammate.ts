import {defineStore} from "pinia";
import {SummonerInfoList} from "@/main/pages/assist/views/teammate/teammateTypes";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {QueryMatch} from "@/main/pages/assist/views/teammate/queryMatch";
import {queryMasteryChampList} from "@/main/pages/assist/views/teammate/utils";

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
    async initStore(summonerInfo:SummonerInfoList[],queueId:number) {
      this.summonerInfo = summonerInfo
      const useMatch = new QueryMatch(queueId)

      let showMateryChamp = false

      for (const [index, summoner] of summonerInfo.entries()) {
        const matchList = await useMatch.getResultInfo(summoner.puuid, index)

        if (matchList.length === 0 || showMateryChamp) {
          showMateryChamp = true
          const masteryList = await queryMasteryChampList(summoner.puuid)
          if (masteryList !== null) {
            this.masteryChampList.push(masteryList)
          }
        } else {
          this.recentMatchList.push(matchList)
        }
      }
      // 查询最近战绩出错
      if (showMateryChamp) {
        this.isLcuErr = true
      }
    },
    clearStore(){
      this.summonerInfo = []
      this.recentMatchList = []
      this.masteryChampList = []
      this.isLcuErr = false
    },
  }
})

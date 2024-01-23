import {defineStore} from "pinia";
import {SummonerInfoList} from "@/main/views/teammate/teammateTypes";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {QueryMatch} from "@/main/views/teammate/queryMatch";
import {queryMasteryChampList} from "@/lcu/aboutSummoner";

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
          this.masteryChampList.push(await queryMasteryChampList(summoner.puuid))
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

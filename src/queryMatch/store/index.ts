import {defineStore} from "pinia";
import {ParticipantsInfo, SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {summonerInfo} from "@/lcu/types/SummonerTypes";
import BaseMatch from "@/queryMatch/utils/baseMatch";
import {SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";
import MatchDetails from "@/queryMatch/utils/matchDetails";

const baseMatch = new BaseMatch()
const matchDetials = new MatchDetails()

const useMatchStore = defineStore('useMatchStore', {
  state: () => {
    return {
      summonerId: -1,
      localSumId: -1,
      matchList: [] as SimpleMatchDetailsTypes[]|null,
      participantsInfo: null as null|ParticipantsInfo,
      sumInfo: null as { info: summonerInfo, rank: string[] } | null
    }
  },
  actions: {
    async init(summonerId?:number) {
      const sumResult = await baseMatch.gerSummonerInfo(summonerId)
      if (sumResult === null) {
        return
      }
      if (summonerId === undefined){
        this.localSumId = sumResult.summonerInfo.currentId
      }
      this.sumInfo = { info: sumResult.summonerInfo, rank: sumResult.rankList }
      this.summonerId = sumResult.summonerInfo.currentId
      await this.getMatchList()
    },
    async getMatchList(page=1){
      if (this.sumInfo === null){
        return false
      }
      const matchItems =
        await baseMatch.dealMatchHistory(this.sumInfo.info.puuid, (page-1)*9, page*9-1)
      // 获取战绩详细数据
      if (matchItems === null) {
        this.matchList = null
        return false
      }else if (matchItems.length === 0) {
        this.matchList = []
        return false
      }

      this.getMatchDetail(matchItems[0].gameId)
      this.matchList = matchItems
      return true
    },
    async getMatchDetail(gameId: number) {
      this.participantsInfo = await matchDetials.queryGameDetail(gameId, this.summonerId)
    },
  }
})

export default useMatchStore

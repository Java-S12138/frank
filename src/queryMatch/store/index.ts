import {defineStore} from "pinia";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import {summonerInfo} from "@/lcu/types/SummonerTypes";
import BaseMatch from "@/queryMatch/utils/baseMatch";
import {SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";
import MatchDetails from "@/queryMatch/utils/matchDetails";
import {RencentDataAnalysisTypes} from "@/main/views/teammate/teammateTypes";
import {findTopChamp} from "@/main/views/teammate/utils";

const baseMatch = new BaseMatch()
const matchDetials = new MatchDetails()

const useMatchStore = defineStore('useMatchStore', {
  state: () => {
    return {
      summonerId: -1,
      localSumId: -1,
      matchList: [] as SimpleMatchDetailsTypes[] | null,
      recentMatchList20: [] as SimpleMatchDetailsTypes[],
      specialMatchList: [] as SimpleMatchDetailsTypes[],
      participantsInfo: null as null | ParticipantsInfo,
      sumInfo: null as { info: summonerInfo, rank: string[] } | null,
      matchLoading:true,
      analysisData:null as  RencentDataAnalysisTypes | null
    }
  },
  actions: {
    async init(summonerId?: number,locSumId?:number) {
      const sumResult = await baseMatch.gerSummonerInfo(summonerId)
      if (sumResult === null) {
        return
      }
      if (summonerId === undefined && locSumId === undefined) {
        this.localSumId = sumResult.summonerInfo.currentId
      }else if (locSumId !== undefined) {
        this.localSumId = locSumId as number
      }
      this.sumInfo = {info: sumResult.summonerInfo, rank: sumResult.rankList}
      this.summonerId = sumResult.summonerInfo.currentId

      this.matchLoading = true

      this.matchList = []
      this.recentMatchList20 = []
      this.analysisData = null
      // 获取最近二十场对局
      this.fetchAndProcessMatches(this.sumInfo.info.puuid).then(() => {
        if (this.matchLoading){
          setTimeout(() => {
            this.matchLoading = false
          },500)
        }
      })
    },
    async getMatchList(page = 1) {
      if (this.sumInfo === null) {
        return false
      }
      if (page < 3 && this.recentMatchList20.length > 18) {
        // 从缓存的20局中数据取值
        this.matchList = this.recentMatchList20.slice((page - 1) * 9, page * 9)
        this.getMatchDetail(this.matchList[0].gameId)
        return true
      }else {
        this.getMatchFromPage(page,this.sumInfo.info.puuid)
        return true
      }
    },
    async fetchAndProcessMatches(puuid:string) {
      const matchResults =
        await baseMatch.dealMatchHistory(puuid, 0, 19)
      if (matchResults !== null) {
        // 处理结果
        for (let i = 0; i < matchResults.length; i++) {
          const matchItems = matchResults[i]
          if (matchItems !== null) {
            if (i === 0) {
              this.getMatchDetail(matchItems.gameId)
            }
            this.recentMatchList20.push(matchItems)
          }
        }
      }
      // 更新 matchList 和 analysisData
      this.matchList = this.recentMatchList20.slice(0, 9)
      this.analysisData = findTopChamp(this.recentMatchList20 as any)
    },
    async getMatchFromPage(page: number,puuid:string) {
      const matchItems =
        await baseMatch.dealMatchHistory(puuid, (page - 1) * 9, page * 9 - 1)
      // 获取战绩详细数据
      if (matchItems === null) {
        this.matchList = null
        return false
      } else if (matchItems.length === 0) {
        this.matchList = []
        return false
      }
      this.matchList = matchItems
      this.getMatchDetail(this.matchList[0].gameId)
    },
    async getSpecialMatchList(queueId: number,puuid?: string, ) {
      if (queueId === 0) {
        this.specialMatchList = []
        this.getMatchList()
        return
      }

      const matchSpecialList = await baseMatch.querySpecialMatch(<string>puuid, queueId)
      if (matchSpecialList.length !== 0){
        this.specialMatchList = matchSpecialList
        this.fromSpecialToMatchList()
      }else {
        this.matchList = []
      }
    },
    async getMatchDetail(gameId: number) {
      this.participantsInfo = await matchDetials.queryGameDetail(gameId, this.summonerId)
    },
    async queryMatchDetail(gameId: number,summonerId:number) {
      return await matchDetials.queryGameDetail(gameId, summonerId)
    },
    fromSpecialToMatchList(page= 1){
      this.matchList = this.specialMatchList.slice(9*(page-1),9*page)
      if (this.matchList.length!==0){
        this.getMatchDetail(this.matchList[0].gameId)
      }
    }
  }
})

export default useMatchStore

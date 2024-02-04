import {defineStore} from "pinia";
import {SummonerInfoList} from "@/main/views/teammate/teammateTypes";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {QueryMatch} from "@/main/views/teammate/queryMatch";
import {queryMasteryChampList} from "@/lcu/aboutSummoner";
import {Hater, HaterItem, BlackItemsTypes} from "@/main/views/record/blackListTypes";

const useMatch = new QueryMatch()

export const useTeammateStore = defineStore('useTeammate', {
  state: () => {
    return {
      summonerInfo: [] as SummonerInfoList[],
      recentMatchList: [] as SimpleMatchTypes[][],
      cacheMatchList: {} as { [key: string]: SimpleMatchTypes[] },
      masteryChampList: [] as string[][][],
      blackItems: [] as BlackItemsTypes[],
      isLcuErr: false,
      isCacheSuccess: false,
    }
  },
  actions: {
    async initStore(summonerInfo: SummonerInfoList[], queueId: number, blacklist: Hater[] | null) {
      this.summonerInfo = summonerInfo
      await this.getMatchList(summonerInfo)
      await this.cacheMatchRecord(summonerInfo, queueId)

      if (blacklist !== null) {
        setTimeout(() => {
          this.addBlackList(blacklist)
        }, 500)
      }
    },
    async getMatchList(summonerInfo: SummonerInfoList[]) {
      for (const [index, summoner] of summonerInfo.entries()) {
        const matchList = await useMatch.getMatchHis(summoner.puuid)
        if (matchList.length === 0) {
          // 查询最近战绩出错
          this.recentMatchList = []
          this.summonerInfo = summonerInfo
          return this.getMatchListFromChamp(summonerInfo)
        } else {
          this.summonerInfo[index].kda = this.calculateAverageKDA(matchList)
          this.recentMatchList.push(matchList)
        }
      }
    },
    // 战绩获取失败，获取英雄数据
    async getMatchListFromChamp(summonerInfo: SummonerInfoList[]) {
      for (const summoner of summonerInfo) {
        const list = await queryMasteryChampList(summoner.puuid)
        this.masteryChampList.push(list || [])
      }
      this.isLcuErr = true
    },
    // 缓存战绩数据
    async cacheMatchRecord(summonerInfo: SummonerInfoList[], queueId: number) {
      if (this.recentMatchList.length === 0) {
        return
      }

      for (const [index, summoner] of summonerInfo.entries()) {
        const matchHis20: SimpleMatchTypes[] = JSON.parse(JSON.stringify(this.recentMatchList[index]))

        if (queueId === 420 || queueId === 440) {
          const matchList = await useMatch.getSpecialMatchHis(summoner.puuid, matchHis20, queueId)
          const cacheList = matchList.length === 0 ? matchHis20.slice(0, 10) : matchList
          this.cacheMatchList[summoner.summonerId] = cacheList
        } else {
          this.cacheMatchList[summoner.summonerId] = matchHis20.slice(0, 10)
        }
      }
      this.isCacheSuccess = true
    },
    // 计算kda
    calculateAverageKDA(statsArray: SimpleMatchTypes[]) {
      const firstSixStats = statsArray.slice(0, 6)

      const sumKDA = firstSixStats.reduce(
        (sum, stats) => sum + stats.kda, 0)
      const averageKDA = sumKDA / firstSixStats.length
      return averageKDA.toFixed(1)
    },
    // 获取黑名单数据
    addBlackList(blacklist: Hater[]) {
      for (const [index,hater] of blacklist.entries()) {
        const hInfo = {name: hater.nickName, sumId: hater.sumId}
        if (hater.blacklist.length === 0) {
          continue
        }
        const hContent: HaterItem = hater.blacklist[0]

        this.blackItems.push({
          hInfo: hInfo,
          hContent: hContent,
        })
        const haterSum = this.summonerInfo
          .find(sum => sum.summonerId === hInfo.sumId)
        // @ts-ignore
        haterSum['hater'] = hContent.isShow;haterSum['haterIndex'] = index
      }
    },
  }
})

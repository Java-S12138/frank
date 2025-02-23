import {defineStore} from "pinia";
import {SummonerInfoList} from "@/main/views/teammate/teammateTypes";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {QueryMatch} from "@/main/views/teammate/queryMatch";
import {queryMasteryChampList} from "@/lcu/aboutSummoner";
import {Hater, HaterItem, BlackItemsTypes} from "@/main/views/record/blackListTypes";
import {window} from "@tauri-apps/api";
import {emitTo} from "@tauri-apps/api/event";

const useMatch = new QueryMatch()

export const useTeammateStore = defineStore('useTeammate', {
  state: () => {
    return {
      summonerInfo: [] as SummonerInfoList[],
      recentMatchList: [] as SimpleMatchTypes[][],
      cacheMatchList: {} as { [key: string]: SimpleMatchTypes[] },
      masteryChampList: [] as string[][][],
      blackItems: [] as BlackItemsTypes[][],
      isLcuErr: false,
      isCacheSuccess: 0,
      queueId:0,
      blacklist:null as Hater[] | null
    }
  },
  actions: {
    async initStore(summonerInfo: SummonerInfoList[], queueId: number, blacklist: Hater[] | null,isReGet:boolean) {
      if (this.summonerInfo.length !== 0 ){
        this.$reset()
      }
      this.summonerInfo = summonerInfo
      this.queueId = queueId
      await this.getMatchList(summonerInfo,isReGet)
      if (!isReGet) {
        await this.cacheMatchRecord(summonerInfo, queueId)
      }
      this.updateBlacklist(blacklist)
    },
    async getMatchList(summonerInfo: SummonerInfoList[],isReGet:boolean) {
      for (const [index, summoner] of summonerInfo.entries()) {
        const matchList = await useMatch.getMatchHis(summoner.puuid,isReGet)
        if (matchList === null) {
          // 查询最近战绩出错
          this.recentMatchList = []
          this.summonerInfo = summonerInfo
          this.getMatchListFromChamp(summonerInfo)
          return
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
      this.isCacheSuccess = -1
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
      this.isCacheSuccess = 1
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
        const tempList:BlackItemsTypes[]= []
        const hContent: HaterItem = hater.blacklist[0]
        for (const hContent of hater.blacklist) {
          tempList.push({
            hInfo: hInfo,
            hContent: hContent,
          })
        }
        this.blackItems.push(tempList)

        const haterSum = this.summonerInfo
          .find(sum => sum.summonerId === hInfo.sumId)
        // @ts-ignore
        haterSum['hater'] = hContent.isShow;haterSum['haterIndex'] = index
      }
    },
    // 重新获取数据，MatchList进行限制
    reInit(){
      this.initStore(this.summonerInfo,this.queueId,this.blacklist,true)
    },
    // 黑名单自动弹出
    async updateBlacklist(blacklist: Hater[] | null) {
      if (!blacklist) return; // 提前返回，避免不必要的处理

      this.blacklist = blacklist;

      // 延迟执行
      await new Promise(resolve => setTimeout(resolve, 500));

      this.addBlackList(blacklist);

      if (blacklist.length === 1) {
        const mainWindow = await window.Window.getByLabel('mainWindow');
        if (mainWindow) {
          emitTo('mainWindow', 'blacklist-team', true);
        }
      }
    }
  }
})

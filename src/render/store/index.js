import { defineStore } from 'pinia'


export const assistStore = defineStore('app', {
  state: () => {
    return {
      summonerInfo:[],// 当前对局中队友的信息
      endGameAfterInfo:[[],[]],// 当前对局敌我双方信息
      currentBlackList:[],// 当前对局中出现的黑名单队友
      showSummonerInfoModal:false,
    }
  }
})

export const matchStore = defineStore('query',{
  state: () => {
    return {
      pageCount:1,// 首页页面切换计数器
      summonerInfo:[],// 当前对局中队友的信息
      enemySummonerInfo:[], // 敌方信息
      echartsData:{name:[],data:[],kdaHistory:[],horse:[],summonerId:[]},// 图表基础数据
      enemyEchartsData:{name:[],data:[],kdaHistory:[],horse:[],summonerId:[]},// 图表基础数据
      currentEchartData:{name:[],data:[],kdaHistory:[],horse:[],summonerId:[]},
      currentQueryGameId:0,
      currentSummonerName:'',
      currentTeam:1, // 当前队伍
    }
  }
})

export const queryStore = defineStore('query',{
  state: () => {
    return {
      querySummonerId:null,
      summoner:{
        rankData:[],
        summonerInfo:{},
        honorLevel:[],
        superChampList:[]
      },
      begIndex : 0,
      endIndex : 8,
      page:1,
      currentMode:'全部模式',
      showChart:false,
      matchList:[],
      currentGameId:0,
      currentMatchIndex:0,
      localSummoner:null
    }
}
})

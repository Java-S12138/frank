import { defineStore } from 'pinia'


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

export const assistStore = defineStore('assist', {
  state: () => {
    return {
      summonerInfo:[],// 当前对局中队友的信息
      endGameAfterInfo:[[],[]],// 当前对局敌我双方信息
      currentBlackList:[],// 当前对局中出现的黑名单队友
      showSummonerInfoModal:false,
    }
  }
})

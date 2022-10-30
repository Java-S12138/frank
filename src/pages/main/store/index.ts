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

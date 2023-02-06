import { defineStore } from 'pinia'

export const queryStore = defineStore('query',{
  state: () => {
    return {
      querySummonerId: '0', // 召唤师ID
      summoner: {         // 召唤师信息
        rankData: [],     // 排位数据
        summonerInfo: {}, // 召唤师基本信息
        superChampList: []// 英雄熟练度
      },
      begIndex: 0,      // 召唤战绩接口 起始页面
      endIndex: 8,      // 同上
      page: 1,            // 页数
      currentMode: '全部模式', // 当前查询战绩的模式
      showChart: false,       // 是否显示数据图表
      matchList: [],          // 战绩列表 (用于查询指定战绩模式的时候)
      currentGameId: 0,       // 当前模式ID
      currentMatchIndex: 0,   // 当前的战绩索引
      localSummoner: null,     // 本地召唤师的昵称
      assistGameId:undefined
    }
  }
})

export const assistStore = defineStore('assist', {
  state: () => {
    return {
      summonerInfo:[],// 当前对局中队友的信息
      endGameAfterInfo:[[],[],0],// 当前对局敌我双方信息
      currentBlackList:[],// 当前对局中出现的黑名单队友
      showSummonerInfoModal:false,
      onlinePlayerInfo:{},
      localSummonerInfo:{playerSumId:'',playerSumName:''},
      addHater:0
    }
  }
})

export const matchStore = defineStore('matchHistory',{
  state: () => {
    return {
      querySummonerId:'0',
      pageCount:1,// 首页页面切换计数器
      summonerInfo:[],// 当前对局中队友的信息
      echartsData:{name:[],data:[],kdaHistory:[],horse:[],summonerId:[]},// 图表基础数据
      currentQueryGameId:0,
      currentSummonerName:''
    }
  }
})


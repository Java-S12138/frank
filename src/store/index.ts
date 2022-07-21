import { defineStore } from 'pinia'

export const useStore = defineStore('app', {
  state: () => {
    return {
      pageCount:1,// 首页页面切换计数器
      echartsData:{name:[],data:[],kdaHistory:[],horse:[]},// 图表基础数据
      enemyEchartsData:{name:[],data:[],kdaHistory:[],horse:[]},// 图表基础数据
      currentEchartData:{name:[],data:[],kdaHistory:[],horse:[]},
      currentQueryGameId:0,
      currentSummonerName:'',
      currentTeam:1, // 当前队伍
      frankVersion:'1.16.1213'
    }
  },
  actions:{
    pageIncrease(){
      this.pageCount +=1
      if (this.pageCount >2){
        this.pageReset()
      }
    },
    pageReset(){
      this.pageCount = 1
    },
  }
})

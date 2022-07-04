import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('app', {
  state: () => {
    return {
      pageCount:1,// 首页页面切换计数器
      echartsData:{name:[],data:[],kdaHistory:[],horse:[]},// 图表基础数据
      currentQueryGameId:0,
      currentSummonerName:''
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

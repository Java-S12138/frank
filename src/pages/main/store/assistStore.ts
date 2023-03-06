import {defineStore} from "pinia";
import {SumListDetail} from "../interface/blacklistTypes";

const assistStore = defineStore('assist', {
  state: () => {
    return {
      summonerInfo:[] as {name: string, summonerId: string}[],// 当前对局中队友的信息
      endGameAfterInfo:[[],[],0] as [SumListDetail[], SumListDetail[], number],// 当前对局敌我双方信息
      currentBlackList:[] as any[],// 当前对局中出现的黑名单队友
      showSummonerInfoModal:false,
      onlinePlayerInfo:{} as any,
      localSummonerInfo:{playerSumId:'',playerSumName:''},
      addHater:0
    }
  }
})

export default assistStore

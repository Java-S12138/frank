import {defineStore} from 'pinia'
import {Hater, UserInfos} from "@/main/views/record/blackListTypes";
import BlackList from "@/main/views/record/blackList";
import MatchDetails from "@/queryMatch/utils/matchDetails";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import {invokeLcu} from "@/lcu";
import {SessionTypes} from "@/recentMatch/utils/queryTypes";
import {sumInfoTypes} from "@/background/utils/backgroundTypes";

const blackList = new BlackList()
const matchDetail = new MatchDetails()

export const useRecordStore = defineStore('useRecordStore', {
  state: () => {
    return {
      haterList: [] as Hater[] | null,
      userInfos: null as UserInfos|null,
      localSumInfo:null as sumInfoTypes|null,
      cubeUserId:null as string|null,
      participantsInfo:null as ParticipantsInfo | null,
      showGameEnd:false
    }
  },
  actions: {
    async init(){
      this.localSumInfo = this.localSumInfo|| JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

      if (this.cubeUserId === null){
        this.cubeUserId = (await cube.profile.getCurrentUser())?.userId
      }

      const resBlack = await blackList.queryBlacklist(this.cubeUserId)

      if (resBlack === null) {
        this.haterList = null
        return
      }
      this.haterList = await blackList.querySumDetails(resBlack[0])
      this.userInfos = resBlack[1]
      // 判断是否数据量匹配
      this.handleHaterVolume(resBlack[0])
    },
    handleHaterVolume(sumIdList:string[]){
      if (this.haterList === null || sumIdList.length ===0){
        return
      }
      const validSumId = this.haterList.map(hater => hater.sumId)
      if (validSumId.length !== sumIdList.length){
        blackList.updateUserInfo(JSON.parse(JSON.stringify(this.userInfos)),validSumId)
      }
    },
    async checkFriSum(sumIdList:string[]){
      const existSumDetails = await blackList.querySumDetails(sumIdList)
      if (existSumDetails === null ||existSumDetails.length === 0){
        return null
      }
      return existSumDetails
    },
    async getParticipantsInfo(){
      this.localSumInfo = this.localSumInfo || JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

      const session =  await invokeLcu('get','/lol-gameflow/v1/session') as SessionTypes
      if (session.map?.id !== 12 && session.map?.id !==11){
        return
      }

      const gameId = session.gameData.gameId
      matchDetail.queryGameDetail(gameId, this.localSumInfo.summonerId).then((info) => {
        if (info !== null) {
          this.participantsInfo = info
          this.showGameEnd = true
        }
      })
    }
  }
})

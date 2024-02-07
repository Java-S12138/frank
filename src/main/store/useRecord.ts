import {defineStore} from 'pinia'
import {Hater, UserInfos} from "@/main/views/record/blackListTypes";
import BlackList from "@/main/views/record/blackList";

const blackList = new BlackList()

export const useRecordStore = defineStore('useRecordStore', {
  state: () => {
    return {
      haterList: [] as Hater[] | null,
      userInfos: null as UserInfos|null,
      localSumInfo:blackList.sumInfo,
      cubeUserId:null as string|null
    }
  },
  actions: {
    async init(){
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
      if (existSumDetails === null ||existSumDetails.length===0){
        return null
      }
      return existSumDetails
    }
  }
})

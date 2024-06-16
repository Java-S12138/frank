import {defineStore} from 'pinia'
import {BlacklistPlanbTypes, Hater, ParticipantsInfoPlanB, UserInfos} from "@/main/views/record/blackListTypes";
import BlackList from "@/main/views/record/blackList";
import MatchDetails from "@/queryMatch/utils/matchDetails";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import {invokeLcu} from "@/lcu";
import {SessionTypes, TeamData} from "@/recentMatch/utils/queryTypes";
import {sumInfoTypes} from "@/background/utils/backgroundTypes";
import {champDict} from "@/resources/champList";

const blackList = new BlackList()
const matchDetail = new MatchDetails()

export const useRecordStore = defineStore('useRecordStore', {
  state: () => {
    return {
      haterList: [] as Hater[] | null,
      userInfos: null as UserInfos | null,
      localSumInfo: null as sumInfoTypes | null,
      cubeUserId: null as string | null,
      participantsInfo: null as ParticipantsInfo | null,
      participantsInfoPlanB: null as ParticipantsInfoPlanB | null,
      showGameEnd: false
    }
  },
  actions: {
    async init() {
      this.localSumInfo = this.localSumInfo || JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

      if (this.cubeUserId === null) {
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
    handleHaterVolume(sumIdList: string[]) {
      if (this.haterList === null || sumIdList.length === 0) {
        return
      }
      const validSumId = this.haterList.map(hater => hater.sumId)
      if (validSumId.length !== sumIdList.length) {
        blackList.updateUserInfo(JSON.parse(JSON.stringify(this.userInfos)), validSumId)
      }
    },
    async checkFriSum(sumIdList: string[]) {
      const existSumDetails = await blackList.querySumDetails(sumIdList)
      if (existSumDetails === null || existSumDetails.length === 0) {
        return null
      }
      return existSumDetails
    },
    async getParticipantsInfo(addGameId?:number) {
      this.participantsInfo = null
      this.participantsInfoPlanB = null

      this.localSumInfo = this.localSumInfo ?? JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

      const gameId = addGameId ?? (await this.getGameIdFromSession(this.localSumInfo.summonerId))

      if (!gameId) {
        return null
      }

      return this.executeAsyncWithRetry(gameId, this.localSumInfo.summonerId).then((info) => {
        if (info !== null) {
          this.participantsInfo = info
          this.showGameEnd = true
          return true
        }else {
          this.participantsInfo = info
          this.showGameEnd = true
          return true
        }
      })
    },
    async getGameIdFromSession(localSumId:number) {
      const session = (await invokeLcu('get', '/lol-gameflow/v1/session')) as SessionTypes

      if (session.map?.id !== 12 && session.map?.id !== 11) {
        return null
      }
      this.executePlanB(session,localSumId)

      return session.gameData.gameId
    },
    async executeAsyncWithRetry(gameId: number, sumId: number) {
      let retryCount = 0
      while (retryCount < 4) {
        const result = await matchDetail.queryGameDetail(gameId, sumId)
        if (result !== null) {
          return result
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        retryCount++
      }
      return null
    },
    // 对局数据获取失败，PlanB
    executePlanB(session:SessionTypes,localSumId:number) {
      const dftTeamOne = session.gameData.teamOne
      const dftTeamTwo = session.gameData.teamTwo
      const isTeamOne = dftTeamOne.find((v) => v.summonerId === localSumId) !== undefined

      const teamOne = isTeamOne ? this.handleTeamData(dftTeamOne) : this.handleTeamData(dftTeamTwo)
      const teamTwo = isTeamOne ? this.handleTeamData(dftTeamTwo) : this.handleTeamData(dftTeamOne)
      this.participantsInfoPlanB = {
        teamOne:teamOne,
        teamTwo:teamTwo,
        headerInfo: [],
        queueId:420,
        gameId:session.gameData.gameId
      }
    },
    // 处理Team字段数据
    handleTeamData(teamData:TeamData[]):BlacklistPlanbTypes[] {
      return teamData.map((player:TeamData) => {
        return {
          name:player.summonerName,
          accountId:player.summonerId,
          champImgUrl:`${champDict[player.championId].alias}.png`,
          score:'-1',
          iconList:[],
          isWin:false,
          isMvp:false
        }
      })
    }
  }
})

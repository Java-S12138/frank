import {englishToChinese, getPosition} from "@/lcu/utils";
import {aliasToId, champDict} from "@/resources/champList";
import {invokeLcu} from "@/lcu";
import {sessionInf} from "./sessionTest"
import {PlayerChampionSelection, RecentSumInfo, SessionTypes, TeamData,SuperChampTypes} from "@/recentMatch/utils/queryTypes";



class QuerySummoner {
  public matchSession: null|SessionTypes = null
  public currentId: number = 0
  public queueId: number = 0
  public playerChampionSelections: any = {}

  // 初始化数据
  public init = async () => {
    try {
      // this.matchSession = sessionInf
      this.matchSession = await invokeLcu('get','/lol-gameflow/v1/session') as SessionTypes
      this.queueId = this.matchSession.gameData.queue.id
    }catch (e){
      this.matchSession = null
      this.queueId = 0
      return
    }

    this.currentId = (await invokeLcu('get', '/lol-summoner/v1/current-summoner')).summonerId
    this.matchSession.gameData.playerChampionSelections.forEach((res: PlayerChampionSelection) => {
      this.playerChampionSelections[(res.summonerInternalName).toLowerCase()] = res.championId
    })
  }
  // 通过Lcu接口查询数据
  public fromLcuQuery = async () => {
    await this.init()
    if (this.matchSession === null){
      return null
    }
    const isTeamOne = this.matchSession.gameData.teamOne.find((i: TeamData) => i.summonerId === this.currentId) !== undefined?true:false
    const [friendList,enemyList] = await Promise.all([
      isTeamOne === true
        ? this.simplifySummonerInfo(this.matchSession.gameData.teamOne)
        : this.simplifySummonerInfo(this.matchSession.gameData.teamTwo),
      isTeamOne === true
        ? this.simplifySummonerInfo(this.matchSession.gameData.teamTwo)
        : this.simplifySummonerInfo(this.matchSession.gameData.teamOne)
    ])
    return {friendList, enemyList,queueId:this.queueId}
  }
  // 获取召唤师Icon
  public getIconAlias = (summoner:TeamData) => {
    if (summoner.championId !== undefined){
      return  champDict[summoner.championId].alias
    }
    return  champDict[this.playerChampionSelections[(summoner.summonerName.toLowerCase())]].alias
  }
  // 通过lcu接口获取数据再次进行解析
  public simplifySummonerInfo = async (summonerList: TeamData[]) => {
    try {
      const promisesList:Promise<RecentSumInfo>[] =  summonerList.map(async (summoner:TeamData) => {
        const iconAlias = this.getIconAlias(summoner)
        const summonerState = await this.querySummonerSuperChampData(summoner.puuid, iconAlias)
        const rankPoint = await this.queryRankPoint(summoner.puuid)
        return <RecentSumInfo> {
          matchList:[],
          rankPoint:rankPoint,
          summonerState: summonerState,
          summonerId: summoner.summonerId,
          puuid:summoner.puuid,
          summonerName: summoner.summonerName,
          index: getPosition(summoner.selectedPosition),
          teamParticipantId:summoner.teamParticipantId,
          championUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${iconAlias}.png`
        }
      })

      const reSumInfoList = await Promise.all(promisesList)
      return reSumInfoList.sort((x: RecentSumInfo, y: RecentSumInfo) => {
        return x.teamParticipantId - y.teamParticipantId
      })
    }catch (e) {
      return [] as RecentSumInfo[]
    }
  }
  // 获取段位数据
  public queryRankPoint = async (puuid: string):Promise<string[]> => {
    return await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`).then((res: any) => {
      const rankData = res.queueMap
      if (rankData ===undefined){
        return ['error','error']
      }
      return ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].reduce((res: any, item: string) => {
        const tier = rankData[item].tier === "" ? '未定级' : englishToChinese(rankData[item].tier)
        const division = rankData[item].division === 'NA' ? '' : rankData[item].division
        return res.concat([
          tier !== '未定级' ? `${tier}${division}`: '未定级'
        ])
      }, [])
    }).catch(() => {
      return []
    })
  }
  // 获取召唤师英雄绝活数据 Z:正常 A:绝活 B:熟练 D:小代 Y:未知 (需要进行下一步判断)
  public querySummonerSuperChampData = async (puuid:string,champAlias:string) => {
    if (localStorage.getItem('isSubscribe') ==='f'){
      return 'Z'
    }
    if (this.queueId === 420 || this.queueId === 440){
      const superList:SuperChampTypes[] = (await invokeLcu('get',`/lol-collections/v1/inventories/${puuid}/champion-mastery`)).slice(0,20)
      const champId = aliasToId[champAlias]

      for (let i = 0; i < superList.length; i++) {
        if (champId === superList[i].championId && superList[i].championLevel > 5 && i< 3){
          return 'A'
        }else if (champId === superList[i].championId && superList[i].championLevel > 5){
          return 'B'
        }
      }
      return 'Y'
    }else {
      return "Z"
    }
  }
}

export default QuerySummoner

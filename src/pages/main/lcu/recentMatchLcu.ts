import {invokeLcu} from "./index";
import {englishToChinese, getPosition} from "./utils";
import {champDict} from "../resources/champList";


export class recentMatch {
  public matchSession: any
  public playerChampionSelections: any = {}
  public currentId: number = 0
  public gameType: number = 420

  public init = async () => {
    // this.matchSession = (await request({
    //   'url': 'https://cdn.syjun.vip/frank/sessionTest.json',
    //   method: 'GET',
    // })).data

    this.matchSession = await invokeLcu('get','/lol-gameflow/v1/session')

    this.gameType = this.matchSession?.gameData?.queue?.id
    this.currentId = (await invokeLcu('get', '/lol-summoner/v1/current-summoner')).summonerId
    this.matchSession?.gameData?.playerChampionSelections.forEach((res: any) => {
      this.playerChampionSelections[(res.summonerInternalName)] = res.championId
    })
  }

  public simplifySummonerInfo = async (summonerList: {}[]) => {
    try {
      const info: any = await summonerList.reduce(async (res: any, item: any) => {
        return (await res).concat({
          summonerId:`${item.summonerId}`,
          rankPoint: await this.queryRankPoint(item.puuid),
          summonerName: item.summonerName,
          matchHistory:[],
          index: getPosition(item.selectedPosition),
          championUrl: (this.gameType === 420 || this.gameType === 440) ? `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(this.playerChampionSelections[(item.summonerName.toLowerCase())])].alias}.png`:
            `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${item.profileIconId}.png`
        })
      }, [])
      return info.sort((x: any, y: any) => {
        return x.index - y.index
      })
    }catch (e) {
      return []
    }
  }

  public queryAllSummonerInfo = async () => {
    await this.init()
    if (this.gameType===undefined){return {friendList: []}}
    const isTeamOne = this.matchSession.gameData.teamOne.find((i: any) => i.accountId === this.currentId) !== undefined?true:false
    const [friendList,enemyList] = await Promise.all([
      isTeamOne === true ? this.simplifySummonerInfo(this.matchSession.gameData.teamOne) : this.simplifySummonerInfo(this.matchSession.gameData.teamTwo),
      isTeamOne === true ? this.simplifySummonerInfo(this.matchSession.gameData.teamTwo) : this.simplifySummonerInfo(this.matchSession.gameData.teamOne)
    ])
    return {friendList, enemyList,gameType:this.gameType}
  }
  // 获取段位数据
  public queryRankPoint = (puuid: string) => {
    return invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`).then((res: any) => {
      const rankData = res.queueMap
      return ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].reduce((res: any, item: string) => {
        const tier = rankData[item].tier === "NONE" ? '未定级' : englishToChinese(rankData[item].tier)
        const division = rankData[item].division === 'NA' ? '' : rankData[item].division
        return res.concat([
          tier !== '未定级' ? `${tier}${division}`: '未定级'
        ])
      }, [])
    }).catch(() => {
      return null
    })
  }

}

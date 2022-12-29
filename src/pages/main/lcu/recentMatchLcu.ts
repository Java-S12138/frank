import {invokeLcu} from "./index";
import {englishToChinese, getPosition} from "./utils";
import {champDict} from "../resources/champList";

export class recentMatch {
  public matchSession: any
  public playerChampionSelections: any = {}
  public currentId: number = 0
  public gameType: number = 420
  public teamOneList:[number,number] = [0,0]
  public teamTwoList:[number,number] = [0,0]

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

  public simplifySummonerInfo = async (summonerList: {}[],isTeamOne:boolean) => {
    const info: any = await summonerList.reduce(async (res: any, item: any) => {
      const matchHistory = await this.queryMatchHistory(item.summonerId,isTeamOne)
      return (await res).concat({
        summonerId:`${item.summonerId}`,
        rankPoint: await this.queryRankPoint(item.puuid),
        summonerName: item.summonerName,
        mathcHistory: matchHistory.classicMode,
        index: getPosition(item.selectedPosition),
        championUrl: (this.gameType === 420 || this.gameType === 440) ? `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(this.playerChampionSelections[(item.summonerName.toLowerCase())])].alias}.png`:
          `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${item.profileIconId}.png`
      })
    }, [])
    return info.sort((x: any, y: any) => {
      return x.index - y.index
    })
  }

  public queryAllSummonerInfo = async () => {
    await this.init()
    if (this.gameType===undefined){return {friendList: []}}
    const isTeamOne = this.matchSession.gameData.teamOne.find((i: any) => i.accountId === this.currentId) !== undefined?true:false
    const [friendList,enemyList] = await Promise.all([
      isTeamOne === true ? this.simplifySummonerInfo(this.matchSession.gameData.teamOne,true) : this.simplifySummonerInfo(this.matchSession.gameData.teamTwo,false),
      isTeamOne === true ? this.simplifySummonerInfo(this.matchSession.gameData.teamTwo,false) : this.simplifySummonerInfo(this.matchSession.gameData.teamOne,true)
    ])
    return {friendList, enemyList,isTeamOne,teamOneList:this.teamOneList,teamTwoList:this.teamTwoList}
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

  // 查询比赛记录 (最近10场排位)
  public queryMatchHistory = async (summonerId: number,isTeamOne:boolean) => {
    let classicMode: any = []
    let matchCount = 0
    let winCount = 0
    mainfor:
    for (let i = 0; i < 100; i += 20) {
      const matchList = (await invokeLcu('get', `/lol-match-history/v3/matchlist/account/${summonerId}`, [i, i + 20]))['games']['games'].reverse()
      for (let j = 0; j < matchList.length; j++) {
        if (matchList[j].queueId === this.gameType) {
          if (matchCount === 10) {
            break mainfor
          }
          matchCount += 1
          winCount = matchList[j].participants[0].stats.win ===true ? winCount+1:winCount
          classicMode.push({
            champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchList[j].participants[0].championId)].alias}.png`,
            kill: matchList[j].participants[0].stats.kills,
            deaths: matchList[j].participants[0].stats.deaths,
            assists: matchList[j].participants[0].stats.assists,
            isWin: matchList[j].participants[0].stats.win,
          })
        }
      }
    }
    isTeamOne === true ? (this.teamOneList[0]+=winCount,this.teamOneList[1]+=matchCount) :
      (this.teamTwoList[0]+=winCount, this.teamTwoList[1]+=matchCount)
    return {classicMode}
  }
}

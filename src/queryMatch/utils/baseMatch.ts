import {queryRankPoint, querySummonerInfo} from "@/lcu/aboutSummoner"
import {Games, SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";
import {queryMatchHistory} from "@/lcu/aboutMatch";
import {queryGameType} from "@/lcu/utils"
import {champDict} from "@/resources/champList";

export default class BaseMatch {

  public gerSummonerInfo = async (summonerId?: number, summonerName?: string) => {
    const summonerInfo = await querySummonerInfo(summonerId, summonerName)
    if (summonerInfo !== null) {
      const rankList = await queryRankPoint(summonerInfo.puuid)
      return {summonerInfo,rankList}
    }
    return null
  }

  public dealMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<SimpleMatchDetailsTypes[]|null> => {
    const matchList = await queryMatchHistory(puuid, begIndex, endIndex)

    if (matchList === null) {
      return null
    }

    return matchList.map((matchListElement) => {
        return this.getSimpleMatch(matchListElement)
      })
  }

  public getSimpleMatch = (match: Games): SimpleMatchDetailsTypes => {
    const times = this.timestampToDate(match.gameCreation)
    const kills = match.participants[0].stats.kills
    const deaths = match.participants[0].stats.deaths
    const assists = match.participants[0].stats.assists
    const kda = deaths===0? kills+assists : Math.round((kills+assists)/deaths*3)

    return {
      gameId:match.gameId,
      champImgUrl: `${champDict[String(match.participants[0].championId)].alias}.png`,
      // 是否取得胜利
      isWin: match.participants[0].stats.win === true ? true : false,
      // 击杀数目
      kills: kills,
      // 死亡数目
      deaths: deaths,
      // 助攻数目
      assists: assists,
      //kda
      kda: kda,
      // 游戏时间
      matchTime: times[1],
      // 开始时间 22:00
      startTime:times[0],
      // 游戏模式
      gameModel:queryGameType(match.queueId),
      //游戏对局ID
      queueId:match.queueId
    }
  }

  public querySpecialMatch = async (puuid: string,queueId:number) => {
    const matchList = await queryMatchHistory(puuid, 0, 99)
    if (matchList === null){
      return []
    }
    const specialList = matchList
      .filter(matchList => matchList.queueId === queueId)

    return specialList.map((matchListElement) => {
      return this.getSimpleMatch(matchListElement)
    })
  }
  public timestampToDate = (timestamp: number):[string,string] => {
    const date = new Date(timestamp)
    // 获取时间
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return [
      `${hours} : ${minutes}`,
      (date.getMonth() + 1 < 10 ?
        '0' + (date.getMonth() + 1) :
        date.getMonth() + 1)
      + '-' + (date.getDate() <10 ? '0'+date.getDate() : date.getDate())
    ]
  }
}


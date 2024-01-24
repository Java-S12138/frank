import {queryCurrentRankPoint, querySummonerInfo} from "@/lcu/aboutSummoner"
import {Game, SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";
import {isRevGames, queryMatchHistory} from "@/lcu/aboutMatch";
import {champDict} from "@/resources/champList";

export default class BaseMatch {

  public gerSummonerInfo = async (summonerId?: number, summonerName?: string) => {
    const summonerInfo = await querySummonerInfo(summonerId, summonerName)
    if (summonerInfo !== null) {
      const rankList = await queryCurrentRankPoint(summonerInfo.puuid)
      return {summonerInfo,rankList}
    }
    return null
  }

  public dealMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<SimpleMatchDetailsTypes[]> => {
    const matchList = await queryMatchHistory(puuid, begIndex, endIndex)

    if (matchList === null) {
      return []
    }
    if (matchList?.games?.games?.length === 0 || matchList?.games?.games === undefined) {
      return []
    }

    return isRevGames(matchList.games.games)
      .map((matchListElement) => {
        return this.getSimpleMatch(matchListElement)
      })
  }

  public getSimpleMatch = (match: Game): SimpleMatchDetailsTypes => {
    const times = this.timestampToDate(match.gameCreation)
    return {
      gameId:match.gameId,
      champImgUrl: `${champDict[String(match.participants[0].championId)].alias}.png`,
      // 是否取得胜利
      isWin: match.participants[0].stats.win === true ? true : false,
      // 击杀数目
      kills: match.participants[0].stats.kills,
      // 死亡数目
      deaths: match.participants[0].stats.deaths,
      // 助攻数目
      assists: match.participants[0].stats.assists,
      // 游戏时间
      matchTime: times[1],
      // 开始时间 22:00
      startTime:times[0],
      // 游戏模式
      gameModel:this.queryGameType(match.queueId),
      //游戏对局ID
      queueId:match.queueId
    }
  }

  public timestampToDate = (timestamp: number):[string,string] => {
    const date = new Date(timestamp)
    // 获取时间
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return [
      `${hours} : ${minutes}`,
      (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate()
    ]
  }

  public queryGameType = (queueId: number) => {
    switch (queueId) {
      case 420 :
        return '单双排位';
      case 430 :
        return '匹配模式';
      case 440 :
        return '灵活排位';
      case 450 :
        return '极地乱斗';
      case 1700 :
        return '斗魂竞技';
    }
    return '其它模式'
  }
}


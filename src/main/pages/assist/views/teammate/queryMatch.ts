import {isRevGames, queryMatchHistory} from "@/lcu/aboutMatch";
import {Game, SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {champDict} from "@/resources/champList";
import {getItemImgUrl, getspellImgUrl, querySummonerPosition} from "@/lcu/utils";

export class QueryMatch {
  constructor(queueId: number) {
    this.currentMode = queueId
  }

  private currentMode = 0
  public cacheSpecialMatch: SimpleMatchTypes[][] = []

  public timestampToDate = (timestamp: number) => {
    var date = new Date(timestamp)
    return (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate()
  }

  public queryGameType = (queueId: number) => {
    switch (queueId) {
      case 420 :
        return '单双';
      case 430 :
        return '匹配';
      case 440 :
        return '灵活';
      case 450 :
        return '极地';
      case 1700 :
        return '斗魂';
    }
    return '其它'
  }

  public getSimpleMatch = (match: Game): SimpleMatchTypes => {
    return {
      champImgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(match.participants[0].championId)].alias}.png`,
      // 是否取得胜利
      isWin: match.participants[0].stats.win === true ? true : false,
      // 击杀数目
      kills: match.participants[0].stats.kills,
      // 死亡数目
      deaths: match.participants[0].stats.deaths,
      // 助攻数目
      assists: match.participants[0].stats.assists,
      // 游戏时间
      matchTime: this.timestampToDate(match.gameCreation),
      // 游戏模式
      gameModel:this.queryGameType(match.queueId),
      // 召唤师技能1
      spell1Id : getspellImgUrl(match.participants[0].spell1Id),
      // 召唤师技能2
      spell2Id : getspellImgUrl(match.participants[0].spell2Id),
      // 物品
      item0 :  getItemImgUrl(match.participants[0].stats.item0),
      item1 :  getItemImgUrl(match.participants[0].stats.item1),
      item2 :  getItemImgUrl(match.participants[0].stats.item2),
      item3 :  getItemImgUrl(match.participants[0].stats.item3),
      item4 :  getItemImgUrl(match.participants[0].stats.item4),
      item5 :  getItemImgUrl(match.participants[0].stats.item5),
      item6 :  getItemImgUrl(match.participants[0].stats.item6),
      // 召唤师位置
      lane : querySummonerPosition(match.participants[0].timeline.lane),
      // 等级
      level:match.participants[0].stats.champLevel,
      queueId:match.queueId
    }
  }
  // 处理战绩数据
  public dealMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<SimpleMatchTypes[]> => {
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
  // query the record of a specific mode
  public querySpecialMatch = async (puuid: string, matchHis20: SimpleMatchTypes[]) => {
    const specialList = matchHis20
      .filter(matchList => matchList.queueId === this.currentMode)
      .slice(0, 10)
    const speListLen = specialList.length

    if (speListLen === 10 || matchHis20.length < 20) {
      this.cacheSpecialMatch.push(specialList)
    } else {
      const matchHis40 = await this.dealMatchHistory(puuid, 20, 59)
      this.cacheSpecialMatch.push(
        [...specialList,
          ...matchHis40.filter(matchList => matchList.queueId === this.currentMode)
            .slice(0, 10 - speListLen)]
      )
    }
  }
  // return result
  public getResultInfo = async (puuid: string) => {
    const matchHis20 = await this.dealMatchHistory(puuid, 0, 19)

    if (this.currentMode === 420 || this.currentMode === 440) {
      this.querySpecialMatch(puuid, matchHis20)
      return matchHis20
    }
    return matchHis20
  }
}

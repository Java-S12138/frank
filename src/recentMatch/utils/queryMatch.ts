import {MatchItemTypes} from "@/recentMatch/utils/queryTypes";
import {champDict} from "@/resources/champList";
import {queryMatchHistory} from "@/lcu/aboutMatch";
import {Games} from "@/lcu/types/queryMatchLcuTypes";

class QueryMatch {
  public winCount = 0

  public queryMatchHistory = async (puuid: string, queueId: number, summonerState: string):Promise<[MatchItemTypes[],number,boolean]> => {
    let matchList

    if (queueId === 420 || queueId === 440) {
      matchList = await this.findSpecialMatch(puuid, queueId)
    } else {
      matchList = await this.findMatch(puuid)
    }

    const winCount = this.winCount
    const isExcel = this.isExcelPlayer(summonerState, matchList)
    this.winCount = 0
    return [matchList, winCount, isExcel]
  }

  public parseMatch = (games: Games) => {
    this.winCount = games.participants[0].stats.win === true ? this.winCount + 1 : this.winCount
    return <MatchItemTypes>{
      champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(games.participants[0].championId)].alias}.png`,
      kill: games.participants[0].stats.kills,
      deaths: games.participants[0].stats.deaths,
      assists: games.participants[0].stats.assists,
      isWin: games.participants[0].stats.win,
      gameId: games.gameId,
      queueId: games.queueId
    }
  }

  public isExcelPlayer = (summonerState: string,matchList:MatchItemTypes[]) => {
    // 判断是否为小代
    if (summonerState === "Y") {
      let excellentCount = 0
      let cycleCount = 0
      for (let match of matchList) {
        cycleCount += 1
        if (cycleCount > 5) {
          break
        }
        if (match.kill >= 12) {
          excellentCount += 1
        }
      }
      if (excellentCount >= 3) {
        summonerState = 'S'
      }
    }
    return summonerState ==='S'
  }

  public findMatch = async (puuid: string): Promise<MatchItemTypes[]> => {
    const matchList = await queryMatchHistory(puuid, 0, 9)
    if (matchList !== null) {
      return matchList.map(games => this.parseMatch(games))
    } else {
      return []
    }
  }
  public findSpecialMatch = async (puuid: string, queueId: number): Promise<MatchItemTypes[]> => {
    const specialList = (await this.findMatch(puuid))
      .filter(matchList => matchList.queueId === queueId)
    if (specialList.length === 10) {
      return specialList
    }
    const otherList = await queryMatchHistory(puuid, 10, 99)
    if (otherList===null){
      return specialList
    }
    for (const games of otherList) {
      if (games.queueId === queueId) {
        specialList.push(this.parseMatch(games))
        if (specialList.length===10){
          return specialList
        }
      }
    }
    return specialList
  }

}

export default QueryMatch

import {MatchItemTypes} from "@/recentMatch/utils/queryTypes";
import {champDict} from "@/resources/champList";
import {queryMatchHistory} from "@/lcu/aboutMatch";
import {Games} from "@/lcu/types/queryMatchLcuTypes";

class QueryMatch {
  public winCount = 0

  public queryMatchHistory = async (puuid: string, queueId: number, summonerState: string): Promise<[MatchItemTypes[], number, boolean]> => {
    let matchList

    if (queueId === 420 || queueId === 440) {
      matchList = await this.findSpecialMatch(puuid, queueId)
    } else {
      matchList = await this.findMatch(puuid)
    }

    const winCount = matchList.length > 0 ? this.winCount : 0
    const isExcel = this.isExcelPlayer(summonerState, matchList)
    this.winCount = 0
    return [matchList, winCount, isExcel]
  }

  public parseMatch = (games: Games) => {
    this.winCount = games.participants[0].stats.win === true ? this.winCount + 1 : this.winCount
    return <MatchItemTypes>{
      champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(games.participants[0].championId)].alias}.png`,
      kills: games.participants[0].stats.kills,
      deaths: games.participants[0].stats.deaths,
      assists: games.participants[0].stats.assists,
      isWin: games.participants[0].stats.win,
      gameId: games.gameId,
      queueId: games.queueId
    }
  }

  public isExcelPlayer = (summonerState: string, matchList: MatchItemTypes[]) => {
    // 判断是否为小代
    if (summonerState !== "Y") {
      return false
    }
    let excellentCount = 0

    for (let match of matchList.slice(0, 5)) {
      const kda = match.deaths === 0 ? (match.kills + match.assists) * 2 : (match.kills + match.assists) / match.deaths * 3
      if (kda >= 12) {
        excellentCount += 1
      }
    }
    return excellentCount >= 3
  }

  public findMatch = async (puuid: string): Promise<MatchItemTypes[]> => {
    const matchList = await queryMatchHistory(puuid, 0, 9)
    if (matchList !== null) {
      return matchList.map((games) => this.parseMatch(games))
    } else {
      return []
    }
  }

  public findSpecialMatch = async (puuid: string, queueId: number): Promise<MatchItemTypes[]> => {
    const latestMatch = await queryMatchHistory(puuid, 0, 9)
    const specialList: MatchItemTypes[] = []

    let offset = 0
    while (offset < 30 ) {
      const matchHistory =
        offset === 0 ? latestMatch : await queryMatchHistory(puuid, offset, offset+9)
      if (!matchHistory || matchHistory.length === 0) {
        break
      }
      const filterMatch =  matchHistory.filter((games) => queueId === games.queueId)

      for (const game of filterMatch) {
        specialList.push(this.parseMatch(game))
        if (specialList.length === 10) {
          return specialList
        }
      }

      offset += 10
    }
    if (specialList.length === 0 && latestMatch !== null){
      return latestMatch.map((games) => this.parseMatch(games))
    }else return specialList
  }
}

export default QueryMatch

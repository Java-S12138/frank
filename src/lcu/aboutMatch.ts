import {invokeLcu} from "@/lcu/index";
import {Games, LcuMatchList} from "./types/queryMatchLcuTypes";

// 根据召唤师ID查询战绩
export const queryMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<Games[]|null> => {
  try {
    const matchList:LcuMatchList = await invokeLcu(
      'get',
      `/lol-match-history/v1/products/lol/${puuid}/matches`,
      [begIndex, endIndex])

    const games = matchList.games.games
    if (games.length===0){
      return []
    }
    if (games[0].gameCreation > games[games.length-1].gameCreation) {
      return games
    }
    return games.reverse()
  }catch (e){
    return null
  }
}

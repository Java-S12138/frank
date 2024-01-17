import {invokeLcu} from "@/lcu/index";
import {Game, LcuMatchList} from "./types/queryMatchLcuTypes";

// 根据召唤师ID查询战绩
export const queryMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<LcuMatchList|null> => {
  const res = await invokeLcu(
    'get',
    `/lol-match-history/v1/products/lol/${puuid}/matches`,
    [begIndex, endIndex])
  if (res?.success === false){
    return null
  }
  return res
}

export const isRevGames = (games:Game[]):Game[]  =>  {
  if (games[0].gameCreation > games[games.length-1].gameCreation) {
    return games
  }
  return games.reverse()
}

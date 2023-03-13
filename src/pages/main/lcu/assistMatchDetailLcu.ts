import {invokeLcu} from "./index";
import {champDict} from "../resources/champList";
import {dealDivsion, englishToChinese} from "./utils";

export const querySuperChampList = async (summonerId: string,dataCount:number) => {
  try {
    const summonerSuperChampData:any = await invokeLcu('get', `/lol-collections/v1/inventories/${summonerId}/champion-mastery`)
    return  summonerSuperChampData.slice(0, dataCount).reduce((res: any, item: any) => {
      return res.concat([
       `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`
      ])
    }, [])
  } catch (e) {
    return []
  }
}

export const querySummonerRank = async (puuid:string) => {
  const rankPoint = (await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`)).queues
  const rankSolo = rankPoint.find((i: any) => i.queueType === "RANKED_SOLO_5x5")
  const rankSr = rankPoint.find((i: any) => i.queueType === "RANKED_FLEX_SR")
  const RANKED_SOLO = rankSolo.tier === "NONE" ? '未定级' : `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  const RANKED_FLEX_SR = rankSr.tier === "NONE" ? '未定级' : `${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  return [RANKED_SOLO, RANKED_FLEX_SR]
}

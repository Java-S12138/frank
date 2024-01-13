// 处理本地召唤师英雄熟练度数据
import {champDict} from "@/resources/champList";

import {
  queryChampionExp,
  queryCurrentRankPoint,
  queryCurrentSummonerInfo, queryStatstones,
  querySummonerHonorLevel
} from "@/lcu/aboutSummoner";

const dealSuperChamp = (summonerSuperChampData: any, index: number, end: number) => {
  const superChampList:[string,number,number,number][] = summonerSuperChampData.slice(index, end).reduce((res: any, item: any) => {
    res.push([
      `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
      item.championLevel,
      item.championPoints,
      item.championId
    ])
    return res
  }, [])
  return superChampList
}

// 返回首页最终需要的数据
export const getCurrentSummonerAllInfo = async () => {
  const summonerInfo = await queryCurrentSummonerInfo()

  if (summonerInfo.currentId === undefined && summonerInfo.name === undefined) {
    return null
  }
  const [rankList, summonerSuperChampData, honorData, statstones] = await Promise.all([
    queryCurrentRankPoint(),
    queryChampionExp(summonerInfo.puuid),
    querySummonerHonorLevel(),
    queryStatstones(summonerInfo.puuid)
  ])
  const champLevel:[string,number,number,number][] = dealSuperChamp(summonerSuperChampData, 0, 15)
  return { summonerInfo, rankList, honorData, champLevel, statstones }
}

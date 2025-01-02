import {
  queryRankPoint,
  querySummonerInfo,
  querySummonerHonorLevel,
  queryMasteryChampList
} from "@/lcu/aboutSummoner";


// 返回首页最终需要的数据
export const getCurrentSummonerAllInfo = async () => {
  const summonerInfo = await querySummonerInfo()

  if (summonerInfo===null) {
    return null
  }

  const [rankList, honorData,champLevel] = await Promise.all([
    queryRankPoint(),
    querySummonerHonorLevel(),
    queryMasteryChampList()
  ])

  rankList.push(honorData)
  return { summonerInfo, rankList,champLevel}
}

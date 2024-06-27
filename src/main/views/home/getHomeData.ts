import {
  queryRankPoint,
  querySummonerInfo,
  querySummonerHonorLevel
} from "@/lcu/aboutSummoner";


// 返回首页最终需要的数据
export const getCurrentSummonerAllInfo = async () => {
  const summonerInfo = await querySummonerInfo()

  if (summonerInfo===null) {
    return null
  }

  const [rankList, honorData] = await Promise.all([
    queryRankPoint(),
    querySummonerHonorLevel(),
  ])

  rankList.push(honorData)
  return { summonerInfo, rankList}
}

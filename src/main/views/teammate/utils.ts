import {invokeLcu} from "@/lcu";
import {summonerInfo} from "@/lcu/types/SummonerTypes";
import {
  MyTeamObject,
  RencentDataAnalysisTypes,
  RoleCountMapTypes,
  SummonerInfoList
} from "./teammateTypes";
import {dealDivsion, englishToChinese} from "@/lcu/utils";
import {champDict} from "@/resources/champList";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {querySummonerInfo} from "@/lcu/aboutSummoner";
import {ChampionSession} from "@/background/types";

// 获取选择英雄时 获取所以友方召唤师ID /lol-champ-select/v1/session 的值
export const queryAllSummonerId = async (islistenSession:boolean) => {
  await new Promise(resolve => setTimeout(resolve, 666));

  const mactchSession = await invokeLcu<ChampionSession>('get','/lol-champ-select/v1/session')
  if (mactchSession===null) return null;

  const getChampId = islistenSession === false ? await invokeLcu<number|null>('get','/lol-champ-select/v1/current-champion') : 0

  const myTeam: MyTeamObject[] = mactchSession.myTeam
  let summonerIdList: number[] = []
  if (myTeam) {
    for (const summoner of myTeam) {
      summonerIdList.push(summoner.summonerId)
    }
    return {
      summonerIdList:summonerIdList,
      champId:getChampId === null ? 0 : getChampId
    }
  }
  return null
}

// 获取排位段位数据
const querySummonerRank = async (puuid: string) => {
  // @ts-ignore
  const rankPoint = (await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`))?.queues
  if (rankPoint === undefined) {
    return ['error', 'error']
  }
  const rankSolo = rankPoint.find((i: any) => i.queueType === "RANKED_SOLO_5x5")
  const rankSr = rankPoint.find((i: any) => i.queueType === "RANKED_FLEX_SR")
  const RANKED_SOLO = rankSolo.tier === "" ? '未定级' : `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  const RANKED_FLEX_SR = rankSr.tier === "" ? '未定级' : `${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  return [RANKED_SOLO, RANKED_FLEX_SR]
}

// 获取我方召唤师ID和昵称
export const queryFriendInfo = async (islistenSession:boolean): Promise<{list: SummonerInfoList[],champId:number }> => {
  const summonerInfoList: SummonerInfoList[] = []
  const summonerInfos = await queryAllSummonerId(islistenSession)

  if (summonerInfos === null) {
    return {list:[],champId:0}
  }

  for (const summonerId of summonerInfos.summonerIdList) {
    const currentSummonerInfo = await querySummonerInfo(summonerId) as summonerInfo
    const rankHandler = await querySummonerRank(currentSummonerInfo.puuid)
    summonerInfoList.push({
      name: currentSummonerInfo.name,
      summonerId: `${summonerId}`,
      puuid: currentSummonerInfo.puuid,
      imgUrl: currentSummonerInfo.imgUrl,
      rank: `${rankHandler[0]} • ${rankHandler[1]}`,
    })
  }
  return {list:summonerInfoList,champId:summonerInfos.champId}
}

export const findTopChamp = (match: SimpleMatchTypes[]|undefined|null): RencentDataAnalysisTypes | null => {
  if (match === undefined || match===null) {
    return null
  }
  const oneGameId = match[0].gameId
  // 使用 Map 统计每个 champId 出现的次数
  const champIdCountMap = new Map<number, number>()
  const roleCountMap: RoleCountMapTypes = {
    assassin: 0,
    fighter: 0,
    mage: 0,
    marksman: 0,
    support: 0,
    tank: 0
  }

  // 初始化 champIdCountMap 并统计 roleCountMap
  for (const champion of match) {
    const {champId} = champion
    const role = champDict[champId].roles[0]
    // @ts-ignore
    roleCountMap[role] = roleCountMap[role] + 1
    champIdCountMap.set(champId, (champIdCountMap.get(champId) || 0) + 1)
  }

  // 计算总数
  const totalChampions = match.length

  // 将 Map 转换为数组，并按出现次数和原数组顺序排序
  const sortedChampIdCount = Array.from(champIdCountMap.entries()).sort(
    (a, b) => {
      // 如果出现次数相同，按照原数组顺序排序
      if (a[1] === b[1]) {
        const indexA = match.findIndex((c) => c.champId === a[0])
        const indexB = match.findIndex((c) => c.champId === b[0])
        return indexA - indexB
      }

      // 按出现次数降序排序
      return b[1] - a[1]
    }
  )

  // 计算百分比并添加到结果中
  const top3Champions = sortedChampIdCount.slice(0, 3).map((entry) => {
    const [champId, count] = entry
    return {
      champId,
      count
    }
  })
  return {top3Champions, totalChampions, roleCountMap,oneGameId}
}

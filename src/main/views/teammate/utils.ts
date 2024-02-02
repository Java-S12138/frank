import {invokeLcu} from "@/lcu";
import {lcuSummonerInfo, summonerInfo} from "@/lcu/types/SummonerTypes";
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

// 获取选择英雄时 获取所以友方召唤师ID /lol-champ-select/v1/session 的值
export const queryAllSummonerId = async (mactchSession?:any) => {
  if (mactchSession === undefined || mactchSession?.myTeam === undefined){
    mactchSession = await invokeLcu('get','/lol-champ-select/v1/session')
  }
  const myTeam: MyTeamObject[] = mactchSession?.myTeam
  let summonerIdList: number[] = []
  if (myTeam) {
    for (const summoner of myTeam) {
      summonerIdList.push(summoner.summonerId)
    }
    return summonerIdList
  }
  return null
}

// 获取排位段位数据
const querySummonerRank = async (puuid: string) => {
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
export const queryFriendInfo = async (mactchSession?:any): Promise<SummonerInfoList[]> => {
  console.log('获取我方召唤师ID和昵称')
  const summonerInfoList: SummonerInfoList[] = []
  const allSummonerId = await queryAllSummonerId(mactchSession)
  if (allSummonerId === null) {
    return []
  }

  for (const summonerId of allSummonerId) {
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
  return summonerInfoList
}

export const findTopChamp = (match: SimpleMatchTypes[]|undefined): RencentDataAnalysisTypes | null => {
  if (match === undefined) {
    return null
  }

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
  return {top3Champions, totalChampions, roleCountMap}
}

// 写入游戏数据到localstore
export const writeGameInfo = async () => {
  const res: any = await invokeLcu('get', '/lol-gameflow/v1/session')
  let queueId = 0
  // 获取对局ID和地图ID
  if (res?.gameData !== undefined) {
    queueId = res.gameData.queue.id
    localStorage.setItem('gameInfo',
      String(JSON.stringify({
        queueId: res.gameData.queue.id,
        mapId: res.gameData.queue.mapId})
      )
    )
  }
  return queueId
}

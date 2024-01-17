import {invokeLcu} from "@/lcu";
import {lcuSummonerInfo} from "@/lcu/types/SummonerTypes";
import {MyTeamObject, SummonerInfoList} from "./teammateTypes";
import {test} from "./test";
import {dealDivsion, englishToChinese} from "@/lcu/utils";
import {champDict} from "@/resources/champList";

// 根据召唤师ID查询信息
const querySummonerInfo = async (summonerId: number|string): Promise<lcuSummonerInfo> => {
  return await invokeLcu('get', `/lol-summoner/v1/summoners/${summonerId}`)
}

// 获取选择英雄时 获取所以友方召唤师ID /lol-champ-select/v1/session 的值
export const queryAllSummonerId = async () => {
  // const mactchSession = await invokeLcu('get','/lol-champ-select/v1/session')
  const mactchSession= test
  const myTeam:MyTeamObject[] = mactchSession?.myTeam
  let summonerIdList:number[] = []
  if (myTeam){
    for (const summoner of myTeam){
      summonerIdList.push(summoner.summonerId)
    }
    return summonerIdList
  }
  return null
}

// 获取排位段位数据
const querySummonerRank = async (puuid:string) => {
  const rankPoint = (await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`))?.queues
  if (rankPoint === undefined){
    return ['error','error']
  }
  const rankSolo = rankPoint.find((i: any) => i.queueType === "RANKED_SOLO_5x5")
  const rankSr = rankPoint.find((i: any) => i.queueType === "RANKED_FLEX_SR")
  const RANKED_SOLO = rankSolo.tier === "" ? '未定级' : `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  const RANKED_FLEX_SR = rankSr.tier === "" ? '未定级' : `${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  return [RANKED_SOLO, RANKED_FLEX_SR]
}


// 获取我方召唤师ID和昵称
export const queryFriendInfo = async ():Promise<SummonerInfoList[]> => {
  console.log('获取我方召唤师ID和昵称')
  const summonerInfoList:SummonerInfoList[] = []
  const allSummonerId = await queryAllSummonerId()
  if (allSummonerId === null) {
    return []
  }

  for (const summonerId of allSummonerId) {
    const currentSummonerInfo = await querySummonerInfo(summonerId)
    const rankHandler= await querySummonerRank(currentSummonerInfo.puuid)
    summonerInfoList.push({
      name: currentSummonerInfo.displayName,
      summonerId: `${summonerId}`,
      puuid:currentSummonerInfo.puuid,
      profileIconId:currentSummonerInfo.profileIconId,
      match:{
        rank: `${rankHandler[0]} • ${rankHandler[1]}`,
        recentMatchList:[]
      }
    })
  }
  return summonerInfoList
}

export const queryChampList = async (summonerPuuid: string) => {
  if (summonerPuuid==='') {
    return null
  }
  try {
    const summonerSuperChampData:any = await invokeLcu('get', `/lol-collections/v1/inventories/${summonerPuuid}/champion-mastery`)
    return  summonerSuperChampData.slice(0, 20).reduce((res: any, item: any) => {
      return res.concat([[
        `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
        `${champDict[String(item.championId)].label} ${champDict[String(item.championId)].title}`,
        `英雄等级 ${item.championLevel} / 熟练度 ${item.championPoints}`
      ]])
    }, [])
  } catch (e) {
    return null
  }
}

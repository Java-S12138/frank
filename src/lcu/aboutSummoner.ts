import {invokeLcu} from "./index"
import {lcuSummonerInfo, summonerInfo,ChampionMasteryTypes} from "./types/SummonerTypes";
import {dealDivsion, englishToChinese} from "./utils";
import {champDict} from "@/resources/champList";

// 查询本地召唤师信息
export const querySummonerInfo = async (summonerId?:number,summonerName?:string):Promise<summonerInfo | null> => {
  let summonerInfo:lcuSummonerInfo
  if (summonerId!==undefined){
    summonerInfo = await invokeLcu('get', `/lol-summoner/v1/summoners/${summonerId}`)
  }else if (summonerName!==undefined){
    summonerInfo =  await invokeLcu('get',`/lol-summoner/v1/summoners`,[summonerName])
  }else {
    summonerInfo = await invokeLcu('get','/lol-summoner/v1/current-summoner')
  }

  return {
    puuid:summonerInfo.puuid,
    tagLine:summonerInfo.tagLine,
    name:summonerInfo.displayName,
    currentId: summonerInfo.summonerId,
    lv:"Lv "+summonerInfo.summonerLevel,
    xp:parseInt(String((summonerInfo.xpSinceLastLevel / summonerInfo.xpUntilNextLevel ) * 100)),
    imgUrl:`https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  }
}

// 查询召唤师排位分数
export const queryRankPoint = async (puuid?:string):Promise<string[]> => {
  let rankPoint
  if (puuid===undefined){
    rankPoint = (await invokeLcu("get", '/lol-ranked/v1/current-ranked-stats'))?.queues
  }else {
    rankPoint = (await invokeLcu("get",`/lol-ranked/v1/ranked-stats/${puuid}`))?.queues
  }

  if (rankPoint === undefined) {
    return ['Error','Error','Error']
  }
  // 单双排位/ 灵活排位/ 云顶之亦
  let rankSolo = rankPoint.find((i:any) => i.queueType==="RANKED_SOLO_5x5")
  let rankSr = rankPoint.find((i:any) => i.queueType==="RANKED_FLEX_SR")
  let rankTft = rankPoint.find((i:any) => i.queueType==="RANKED_TFT")
  let RANKED_SOLO:string =  rankSolo.tier ==="" ? '未定级': `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  let RANKED_FLEX_SR:string =  rankSr.tier ==="" ? '未定级':`${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  let RANKED_TFT:string=  rankTft.tier ==="" ? '未定级':`${englishToChinese(rankTft.tier)}${dealDivsion(rankTft.division)} ${rankTft.leaguePoints}`

  return [RANKED_SOLO,RANKED_FLEX_SR,RANKED_TFT]
}


// 查看本地召唤师荣誉等级
export const querySummonerHonorLevel = async ():Promise<string> => {
  const summonerHonor = await invokeLcu('get','/lol-honor-v2/v1/profile')
  if (summonerHonor?.honorLevel===undefined){
    return 'Error'
  }
  return '荣誉等级'+summonerHonor?.honorLevel + ' 里程'+summonerHonor?.checkpoint
}


// 查询召唤师绝活英雄数据
export const queryMasteryChampList = async (summonerPuuid: string) => {
  if (summonerPuuid === '') {
    return []
  }
  try {
    const summonerSuperChampData: ChampionMasteryTypes[] = await invokeLcu('get', `/lol-collections/v1/inventories/${summonerPuuid}/champion-mastery`)
    return summonerSuperChampData.slice(0, 20).reduce((res: string[][], item: ChampionMasteryTypes) => {
      return res.concat([[
        `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
        `${champDict[String(item.championId)].label}•${champDict[String(item.championId)].title}`,
        `英雄等级 ${item.championLevel} / 熟练度 ${item.championPoints}`
      ]])
    }, [])
  } catch (e) {
    return []
  }
}

import {invokeLcu} from "./index"
import {lcuSummonerInfo, summonerInfo} from "./types/SummonerTypes";
import {dealDivsion, englishToChinese} from "./utils";
import {champDict} from "@/resources/champList";

// 查询本地召唤师信息
export const queryCurrentSummonerInfo = async ():Promise<summonerInfo> => {
  const summonerInfo:lcuSummonerInfo = await invokeLcu('get','/lol-summoner/v1/current-summoner')
  const imgUrl:string = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {
    name:summonerInfo.displayName,
    imgUrl:imgUrl,
    lv:"Lv "+summonerInfo.summonerLevel,
    xpSL:summonerInfo.xpSinceLastLevel,
    xpNL:summonerInfo.xpUntilNextLevel,
    puuid:summonerInfo.puuid,
    currentId: summonerInfo.summonerId,
    tagLine:summonerInfo.tagLine
  }
}

// 查询召唤师排位分数
export const queryCurrentRankPoint = async ():Promise<[string,string,string]> => {
  const rankPoint = (await invokeLcu("get", '/lol-ranked/v1/current-ranked-stats')).queues
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

// 查询召唤师英雄熟练度
export const queryChampionExp = async (puuid:string) => {
  return await invokeLcu('get',`/lol-collections/v1/inventories/${puuid}/champion-mastery`)
}

// 查看本地召唤师荣誉等级
export const querySummonerHonorLevel = async ():Promise<[string,string]> => {
  const summonerHonor = await invokeLcu('get','/lol-honor-v2/v1/profile')
  return ['荣誉等级 '+summonerHonor.honorLevel,'里程点数 '+summonerHonor.checkpoint]
}

// 获取永痕星碑数据
export const queryStatstones = async (puuid:string) => {
  try {
    const statstones:Array<Object> = await invokeLcu('get',`/lol-statstones/v1/profile-summary/${puuid}`)
    const statstonesList = statstones.reduce((res:any,item:any) => {
      return res.concat({
        championId:`${champDict[String(item.championId)].label}`,
        name:item.name,
        imgUrl:(item.imageUrl).split('LCU/')[1],
        value:item.value
      })
    },[])
    return statstonesList
  }catch (e) {
    return []
  }
}

// 处理英雄永恒星碑数据
export const dealChampStatstones = (statstones:any) => {
  const simpleStatstonesList = statstones.reduce((res:any,item:any) => {
    return res.concat({
      name:item.name,
      value:item.formattedValue,
      imgUrl:(item.imageUrl).split('LCU/')[1],
      milestoneLevel: item.formattedMilestoneLevel
    })
  },[])
  return simpleStatstonesList
}

// 查看指定英雄的永恒星碑
export const queryCurrentChampStatstones = async (champId:any) => {
  try {
    const champSta:Array<Object> = await invokeLcu("get", `/lol-statstones/v2/player-statstones-self/${champId}`)
    const champStatstonesList = champSta.reduce((res:any,item:any) => {
      return res.concat({
        name: item.name,
        simpleStatstonesList:dealChampStatstones(item.statstones)
      })
    },[])

    if (champStatstonesList[0].simpleStatstonesList[0].value ==='' &&champStatstonesList[1].simpleStatstonesList[1].value ==='' ){
      return `${champDict[champId].label} 暂无永恒星碑`
    }
    return champStatstonesList
  }catch (e) {
    return null
  }
}

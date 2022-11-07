import {invokeLcu} from "./index";
import {dealDivsion,englishToChinese} from "./utils"
import {champDict} from "../resources/champList"
import {summonerInfo,lcuSummonerInfo,CurrentSummonerInfo} from "./types/homeLcuTypes"

// 查询本地召唤师信息
const queryCurrentSummonerInfo = async ():Promise<summonerInfo> => {
  const summonerInfo:lcuSummonerInfo = await invokeLcu('get','/lol-summoner/v1/current-summoner')
  const imgUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {
    name:summonerInfo.displayName,
    imgUrl,
    lv:"Lv "+summonerInfo.summonerLevel,
    xpSL:summonerInfo.xpSinceLastLevel,
    xpNL:summonerInfo.xpUntilNextLevel,
    puuid:summonerInfo.puuid,
    currentId: summonerInfo.summonerId
  }
}

// 查询召唤师排位分数
export const queryCurrentRankPoint = async ():Promise<[string,string,string]> => {
  const rankPoint = (await invokeLcu("get", '/lol-ranked/v1/current-ranked-stats')).queues
  // 单双排位/ 灵活排位/ 云顶之亦
  let rankSolo = rankPoint.find((i:any) => i.queueType==="RANKED_SOLO_5x5")
  let rankSr = rankPoint.find((i:any) => i.queueType==="RANKED_FLEX_SR")
  let rankTft = rankPoint.find((i:any) => i.queueType==="RANKED_TFT")

  let RANKED_SOLO =  rankSolo.tier ==="NONE" ? '未定级': `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  let RANKED_FLEX_SR =  rankSr.tier ==="NONE" ? '未定级':`${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  let RANKED_TFT =  rankTft.tier ==="NONE" ? '未定级':`${englishToChinese(rankTft.tier)}${dealDivsion(rankTft.division)} ${rankTft.leaguePoints}`

  return [RANKED_SOLO,RANKED_FLEX_SR,RANKED_TFT]
}

// 查询本地召唤师英雄熟练度
const queryCurrentChamp = async (currentId:number) => {
  return await invokeLcu('get',`/lol-collections/v1/inventories/${currentId}/champion-mastery`)
}

// 查看召唤师荣誉等级
const querySummonerHonorLevel = async ():Promise<[string,string]> => {
  const summonerHonor = await invokeLcu('get','/lol-honor-v2/v1/profile')
  return ['荣誉等级 '+summonerHonor.honorLevel,'里程点数 '+summonerHonor.checkpoint]
}

// 处理本地召唤师英雄熟练度数据
const dealSuperChamp = (summonerSuperChampData:any,index:number,end:number) => {
  const superChampList = summonerSuperChampData.slice(index,end).reduce((res:any,item:any) => {
    res.push([
      // @ts-ignore
      `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
      item.championLevel,
      item.championPoints,
      item.championId
    ])
    return res
  },[])
  return superChampList
}

// 处理英雄永恒星碑数据
const dealChampStatstones = (statstones:any) => {
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

// 获取永痕星碑数据
const queryStatstones = async (puuid:string) => {
  const statstones:Array<Object> = await invokeLcu('get',`/lol-statstones/v1/profile-summary/${puuid}`)
  const statstonesList = statstones.reduce((res:any,item:any) => {
    return res.concat({
          // @ts-ignore
          championId:`${champDict[String(item.championId)].label}`,
          name:item.name,
          imgUrl:(item.imageUrl).split('LCU/')[1],
          value:item.value
    })
  },[])
  return statstonesList
}


// 返回首页最终需要的数据
export const getCurrentSummonerInfo = async ():Promise<CurrentSummonerInfo> => {
  const summonerInfo =  await queryCurrentSummonerInfo()
  if (summonerInfo.currentId===undefined && summonerInfo.name===undefined){
    // @ts-ignore
    return null
  }
  const rankList = await queryCurrentRankPoint()
  const rank=  [summonerInfo.name,summonerInfo.lv,rankList[0],rankList[1],rankList[2],
    "S12季前赛",[summonerInfo.xpSL,summonerInfo.xpNL],summonerInfo.imgUrl]

  const summonerSuperChampData = await queryCurrentChamp(summonerInfo.currentId)

  const honorData = await querySummonerHonorLevel()
  const champLevel = dealSuperChamp(summonerSuperChampData,0,15)
  const statstones = await queryStatstones(summonerInfo.puuid)
  return {rank,honorData,champLevel,statstones}
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
      // @ts-ignore
      return `${champDict[champId].label} 暂无永恒星碑`
    }
    return champStatstonesList
  }catch (e) {
    console.log(e)
    return null
  }
}


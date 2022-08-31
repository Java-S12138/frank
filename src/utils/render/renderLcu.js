import {createHttp1Request,createHttpSession,createHttp2Request} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList";

let currentId

// 查询本地召唤师信息
const queryCurrentSummonerInfo = async (credentials) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/current-summoner`,
  }, credentials)).json()
  currentId = summonerInfo.summonerId
  const imgUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {name:summonerInfo.displayName,
    imgUrl,
    lv:"Lv "+summonerInfo.summonerLevel,
    xpSL:summonerInfo.xpSinceLastLevel,
    xpNL:summonerInfo.xpUntilNextLevel,
    puuid:summonerInfo.puuid
  }
}

// 查询本地召唤师英雄熟练度
export const queryCurrentChapm = async (credentials) => {
  const summonerSuperChampData = (await createHttp1Request({
    method: "GET",
    url: `/lol-collections/v1/inventories/${currentId}/champion-mastery`,
  }, credentials)).json()
  return summonerSuperChampData
}

// 处理本地召唤师英雄熟练度数据
const dealSuperChapm = (summonerSuperChampData,index,end) => {
  let superChampList = []
  for (const summonerSuperChampDatum of summonerSuperChampData.slice(index,end)) {

    let champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(summonerSuperChampDatum.championId)].alias}.png`
    let championPoints = summonerSuperChampDatum.championPoints
    let champLevel = summonerSuperChampDatum.championLevel
    let championId = summonerSuperChampDatum.championId
    superChampList.push([champImgUrl,champLevel,championPoints,championId])
  }
  return superChampList
}

// 查询召唤师排位分数
const queryCurrentRankPoint = async (credentials) => {
  // const rankPoint = (await createHttp1Request({
  //   method:"GET",
  //   url:'/lol-ranked/v1/current-ranked-stats'
  // },credentials)).json().queues
  const session = await createHttpSession(credentials)
  const rankPoint = (await createHttp2Request({
    method:"GET",
    url:'/lol-ranked/v1/current-ranked-stats'
  }, session, credentials)).json().queues
  session.close()
  // 单双排位/ 灵活排位/ 云顶之亦
  let rankSolo = rankPoint.find((i) => i.queueType=="RANKED_SOLO_5x5")
  let rankSr = rankPoint.find((i) => i.queueType=="RANKED_FLEX_SR")
  let rankTft = rankPoint.find((i) => i.queueType=="RANKED_TFT")

  let RANKED_SOLO =  rankSolo.tier =="NONE" ? '未定级': `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  let RANKED_FLEX_SR =  rankSr.tier =="NONE" ? '未定级':`${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  let RANKED_TFT =  rankTft.tier =="NONE" ? '未定级':`${englishToChinese(rankTft.tier)}${dealDivsion(rankTft.division)} ${rankTft.leaguePoints}`

  return [RANKED_SOLO,RANKED_FLEX_SR,RANKED_TFT]
}
// 处理段位数据
const dealDivsion = (divsion) => {
  return divsion === 'NA'?'':divsion
}
// 获取永痕星碑数据
const queryStatstones = async (credentials,puuid) => {
  const session = await createHttpSession(credentials)
  const statstones = (await createHttp2Request({
    method:"GET",
    url:`/lol-statstones/v1/profile-summary/${puuid}`
  }, session, credentials)).json()
  session.close()
  let statstonesList = []
  for (const statstonesElement of statstones) {
    const imgUrl = (statstonesElement.imageUrl).split('LCU/')[1]
    statstonesList.push({
      championId:`${champDict[String(statstonesElement.championId)].label}`,
      name:statstonesElement.name,
      imgUrl,
      value:statstonesElement.value
    })
  }
  return statstonesList
}

// 查看指定英雄的永恒星碑
export const queryCurrentChampStatstones = async (credentials,champId) => {
  try {
    const session = await createHttpSession(credentials)
    const champSta = (await createHttp2Request({
      method:"GET",
      url:`/lol-statstones/v2/player-statstones-self/${champId}`
    },session,credentials)).json()
    session.close()

    let champStatstonesList = []
    for (const champStaElement of champSta) {
      let name = champStaElement.name
      let simpleStatstonesList = dealChampStatstones(champStaElement.statstones)
      champStatstonesList.push({name,simpleStatstonesList})
    }
    if (champStatstonesList[0].simpleStatstonesList[0].value ==='' &&champStatstonesList[1].simpleStatstonesList[1].value ==='' ){
      return `${champDict[champId].label} 暂无永恒星碑`
    }
    return champStatstonesList
  }catch (e) {
    console.log(e)
    return null
  }

}
// 处理英雄永恒星碑数据
const dealChampStatstones = (statstones) => {
  let simpleStatstonesList = []
  for (const statstone of statstones) {
    let name = statstone.name
    let value = statstone.formattedValue
    let imgUrl = (statstone.imageUrl).split('LCU/')[1]
    let milestoneLevel = statstone.formattedMilestoneLevel
    simpleStatstonesList.push({name,value,imgUrl,milestoneLevel})
  }
  return simpleStatstonesList
}

// 返回最终需要的数据
export const returnRankData = async (credentials) => {
  const summonerInfo =  await queryCurrentSummonerInfo(credentials)
  const rankList = await queryCurrentRankPoint(credentials)
  const rank=  [summonerInfo.name,summonerInfo.lv,rankList[0],rankList[1],rankList[2],
    "S12季前赛",[summonerInfo.xpSL,summonerInfo.xpNL],summonerInfo.imgUrl]

  const summonerSuperChampData = await queryCurrentChapm(credentials)

  const honorData = await querySummonerHonorLevel(credentials)
  const chapmLevel = dealSuperChapm(summonerSuperChampData,0,15)
  const statstones = await queryStatstones(credentials,summonerInfo.puuid)
  return {rank,honorData,chapmLevel,statstones}
}


// 查看召唤师荣誉等级
export const querySummonerHonorLevel = async (credentials) => {
    const summonerHonor = (await createHttp1Request({
      method: "GET",
      url: `/lol-honor-v2/v1/profile`,
    },credentials)).json()
    return ['荣誉等级 '+summonerHonor.honorLevel,'里程点数 '+summonerHonor.checkpoint]
}

// 英文段位昵称转中文
const englishToChinese = (tier) => {
  switch (tier) {
    case 'CHALLENGER' :return '王者';
    case 'GRANDMASTER' :return '宗师';
    case 'MASTER' :return '大师';
    case 'DIAMOND' :return '钻石';
    case 'PLATINUM' :return '铂金';
    case 'GOLD' :return '黄金';
    case 'SILVER' :return '白银';
    case 'BRONZE' :return '青铜';
    case 'IRON' :return '黑铁';
  }
}

// 查询敌方召唤师ID
export const queryEnemySummonerId= async (credentials) => {
  await queryCurrentSummonerInfo(credentials)
  const mactchSession = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/session`,
  },credentials)).json()
  let enemyId = []

  if (mactchSession.gameData.teamOne.find((i) =>i.accountId === currentId )){
    var enemyInfo = mactchSession.gameData.teamTwo
  }else{
    var enemyInfo = mactchSession.gameData.teamOne
  }

  for (const enemy of enemyInfo) {
    enemyId.push(enemy.accountId)
  }
  // const enemyId =[4000557119,4009650116,2935173990,2928803974,4004032333]
  return enemyId
}

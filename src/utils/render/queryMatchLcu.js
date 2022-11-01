// 查询本地召唤师信息
import {createHttp1Request, createHttp2Request, createHttpSession} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList";

const queryCurrentSummonerId = async (credentials) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/current-summoner`,
  }, credentials)).json()
  return summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (credentials,summonerId) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/summoners/${summonerId}`,
  }, credentials)).json()
  const imgUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {
    name:summonerInfo.displayName,
    imgUrl,
    lv:summonerInfo.summonerLevel,
    xpSL:summonerInfo.xpSinceLastLevel,
    xpNL:summonerInfo.xpUntilNextLevel,
    puuid:summonerInfo.puuid,
    summonerId:summonerInfo.summonerId
  }
}
// 查询召唤师排位分数
const queryCurrentRankPoint = async (credentials,puuid) => {
  const session = await createHttpSession(credentials)
  const rankPoint = (await createHttp2Request({
    method:"GET",
    url:`/lol-ranked/v1/ranked-stats/${puuid}`
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
// 处理段位数据
const dealDivsion = (divsion) => {
  return divsion === 'NA'?'':divsion
}
// 获取召唤师英雄绝活数据
const querySummonerSuperChampData = async (credentials,summonerId) => {
  try {
    const summonerSuperChampData = (await createHttp1Request({
      method: "GET",
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery`,
    }, credentials)).json().slice(0,20)
    let superChampList = []
    for (const summonerSuperChampDatum of summonerSuperChampData) {
      let champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(summonerSuperChampDatum.championId)].alias}.png`
      let champLevel = summonerSuperChampDatum.championLevel
      let championPoints = summonerSuperChampDatum.championPoints
      superChampList.push({champImgUrl,champLevel,championPoints})
    }
    return superChampList
  }catch (e) {
    return []
  }

}

export const returnSummonerData = async (credentials,summonerId) => {
  if (summonerId === ''){ summonerId = await queryCurrentSummonerId(credentials)}
  const summonerInfo = await querySummonerInfo(credentials,summonerId)
  const rankData = await queryCurrentRankPoint(credentials,summonerInfo.puuid)
  const superChampList = await querySummonerSuperChampData(credentials,summonerId)
  return {summonerInfo,rankData,superChampList}
}
export const returnRankData = async (credentials,summonerId) => {
  const summonerInfo = await querySummonerInfo(credentials,summonerId)
  const rankData = await queryCurrentRankPoint(credentials,summonerInfo.puuid)
  return rankData
}

// matchDetailed Page ==================================================================== //

// 根据游戏模式ID判断 游戏模式
const queryGameType = (queueId) => {
  switch (queueId) {
    case 420 : return '排位赛 单排/双排';
    case 430 : return '匹配模式';
    case 440 : return '排位赛 灵活排位';
    case 450 : return '极地大乱斗';
  }
  return '其它模式'
}

// 根据召唤师ID查询战绩
export const queryMatchHistory = async (credentials,summonerId,begIndex,endIndex) => {
  const session = await createHttpSession(credentials)
  const matchList = (await createHttp2Request({
    method: "GET",
    url: `/lol-match-history/v3/matchlist/account/${summonerId}?begIndex=${begIndex}&endIndex=${endIndex}`,
  },session, credentials)).json()
  session.close()
  return matchList
}

// 处理战绩数据
export const dealMatchHistory = async (credentials,summonerId,begIndex,endIndex,mode) => {
  const matchList = await queryMatchHistory(credentials,summonerId,begIndex,endIndex)
  if ( matchList.httpStatus===500){return null}
  if (matchList['games']['games'].length ===0){return null}
  let simpleMatchList = []
  let specialSimpleMatchList = []
  for (const matchListElement of matchList['games']['games'].reverse()) {
    // 本局游戏ID
    let gameId = matchListElement.gameId
    // 召唤师选择的英雄
    let champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchListElement.participants[0].championId)].alias}.png`
    let champ = champDict[String(matchListElement.participants[0].championId)].title
    // 是否取得胜利
    let isWin = matchListElement.participants[0].stats.win == true ? true :false
    // 击杀数目
    let kills = matchListElement.participants[0].stats.kills
    // 死亡数目
    let deaths =matchListElement.participants[0].stats.deaths
    // 助攻数目
    let assists = matchListElement.participants[0].stats.assists
    // 游戏时间
    let matchTime = timestampToDate(matchListElement.gameCreation)
    // 游戏模式
    let queueId = queryGameType(matchListElement.queueId)
    if (queueId === mode){
      specialSimpleMatchList.push({gameId,champImgUrl,isWin,kills,deaths,assists,matchTime,queueId,champ})
    }
    if (mode === undefined){
      simpleMatchList.push({gameId,champImgUrl,isWin,kills,deaths,assists,matchTime,queueId,champ})
    }
  }
  if (mode === undefined){
    return simpleMatchList
  }else {
    return specialSimpleMatchList
  }
}
const timestampToDate = (timestamp)  => {
  var date = new Date(timestamp)
  return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+ date.getDate()
}

// 查看特定模式的战绩
export const querySpecialMatchHistory = async (credentials,summonerId,mode) => {
  let specialDict = []
  for (let i = 0; i < 8; i++) {
    const matchHistory = await dealMatchHistory(credentials,summonerId,20*i,20*(i+1),mode)
   specialDict = [...specialDict,...matchHistory]
  }
  return specialDict
}

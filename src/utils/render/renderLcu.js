import {appConfig} from "@/utils/main/config";
import {createHttp1Request} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList";

const credentials = appConfig.get('credentials')
let currentId

// 查询本地召唤师信息
const queryCurrentSummonerInfo = async () => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/current-summoner`,
  }, credentials)).json()
  currentId = summonerInfo.summonerId
  const imgUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {name:summonerInfo.displayName,imgUrl}
}

// 查询本地召唤师英雄熟练度
const queryCurrentChapm = async () => {
  const summonerSuperChampData = (await createHttp1Request({
    method: "GET",
    url: `/lol-collections/v1/inventories/${currentId}/champion-mastery`,
  }, credentials)).json().slice(0,3)
  let superChampList = []
  for (const summonerSuperChampDatum of summonerSuperChampData) {
    let champName = champDict[String(summonerSuperChampDatum.championId)].label
    let championPoints = "英雄熟练度：" +summonerSuperChampDatum.championPoints
    superChampList.push(champName,championPoints)
  }
  return superChampList
}
// 查询召唤师排位分数
const queryCurrentRankPoint = async () => {
  const rankPoint = (await createHttp1Request({
    method:"GET",
    url:'/lol-ranked/v1/current-ranked-stats'
  },credentials)).json().queues
  let RANKED_SOLO =  rankPoint[0].tier =="NONE" ? '未定级': `${rankPoint[0].tier} ${rankPoint[0].division} (${rankPoint[0].leaguePoints}胜点)`
  let RANKED_FLEX_SR =  rankPoint[1].tier =="NONE" ? '未定级':`${rankPoint[1].tier} ${rankPoint[1].division} (${rankPoint[1].leaguePoints}胜点)`
  let RANKED_TFT =  rankPoint[2].tier =="NONE" ? '未定级':`${rankPoint[2].tier} ${rankPoint[2].division} (${rankPoint[2].leaguePoints}胜点)`
  return [RANKED_SOLO,RANKED_FLEX_SR,RANKED_TFT]
}

// 返回最终需要的数据
export const returnRankData = async () => {
  if (appConfig.get('credentials.port') == ""){
    return null
  }
  const summonerInfo =  await queryCurrentSummonerInfo()
  const rankList = await queryCurrentRankPoint()
  let rank=  [summonerInfo.name,'Local',rankList[0],rankList[1],rankList[2],"S12季前赛",'INVINCIBLE',summonerInfo.imgUrl]
  let carry = await queryCurrentChapm()
  return {rank, carry}
}

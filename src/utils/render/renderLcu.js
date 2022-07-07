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
  return {name:summonerInfo.displayName,imgUrl,lv:"Lv "+summonerInfo.summonerLevel}
}

// 查询本地召唤师英雄熟练度
export const queryCurrentChapm = async (index,end) => {
  const summonerSuperChampData = (await createHttp1Request({
    method: "GET",
    url: `/lol-collections/v1/inventories/${currentId}/champion-mastery`,
  }, credentials)).json()
  let superChampList = []
  if (end>3){
    for (const summonerSuperChampDatum of summonerSuperChampData.slice(index,end)) {

      let champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(summonerSuperChampDatum.championId)].alias}.png`
      let championPoints = summonerSuperChampDatum.championPoints
      let champLevel = summonerSuperChampDatum.championLevel
      superChampList.push([champImgUrl,champLevel,championPoints])
    }
    return superChampList
  }else {
    for (const summonerSuperChampDatum of summonerSuperChampData.slice(index,end)) {
      let champName = champDict[String(summonerSuperChampDatum.championId)].label
      let championPoints = "英雄熟练度：" +summonerSuperChampDatum.championPoints
      superChampList.push(champName,championPoints)
    }
    return superChampList
  }

}
// 查询召唤师排位分数
const queryCurrentRankPoint = async () => {
  const rankPoint = (await createHttp1Request({
    method:"GET",
    url:'/lol-ranked/v1/current-ranked-stats'
  },credentials)).json().queues
  let RANKED_SOLO =  rankPoint[0].tier =="NONE" ? '未定级': `${englishToChinese(rankPoint[0].tier)} ${rankPoint[0].division} ${rankPoint[0].leaguePoints}胜点`
  let RANKED_FLEX_SR =  rankPoint[1].tier =="NONE" ? '未定级':`${englishToChinese(rankPoint[1].tier)} ${rankPoint[1].division} ${rankPoint[1].leaguePoints}胜点`
  let RANKED_TFT =  rankPoint[2].tier =="NONE" ? '未定级':`${englishToChinese(rankPoint[2].tier)} ${rankPoint[2].division} ${rankPoint[2].leaguePoints}胜点`
  return [RANKED_SOLO,RANKED_FLEX_SR,RANKED_TFT]
}

// 返回最终需要的数据
export const returnRankData = async () => {
  if (appConfig.get('credentials.port') == ""){
    return null
  }
  const summonerInfo =  await queryCurrentSummonerInfo()
  const rankList = await queryCurrentRankPoint()
  let rank=  [summonerInfo.name,summonerInfo.lv,rankList[0],rankList[1],rankList[2],"S12季前赛",'INVINCIBLE',summonerInfo.imgUrl]
  let carry = await queryCurrentChapm(0,3)
  return {rank, carry}
}


// 查看召唤师荣誉等级
export const querySummonerHonorLevel = async () => {
  if (appConfig.get('credentials.port') == ""){
    return null
  }
  try {
    const summonerHonor = (await createHttp1Request({
      method: "GET",
      url: `/lol-honor-v2/v1/profile`,
    }, credentials)).json()
    return ['荣誉等级:'+summonerHonor.honorLevel,'里程点数:'+summonerHonor.checkpoint]
  }catch (e) {
    return null
  }
}

// 英文段位昵称转中文
const englishToChinese = (tier) => {
  switch (tier) {
    case 'CHALLENGER' :return '王者';
    case 'GRANDMASTER' :return '宗师';
    case 'MASTER' :return '大师';
    case 'DIAMOND' :return '砖石';
    case 'PLATINUM' :return '铂金';
    case 'GOLD' :return '黄金';
    case 'SILVER' :return '白银';
    case 'BRONZE' :return '青铜';
    case 'IRON' :return '黑铁';
  }
}

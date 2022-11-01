// 获取一局游戏的详细数据
import {createHttp1Request} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList";

export const queryGameDetailsData = async (gameId, credentials)  => {
  const response = (await createHttp1Request({
    method: 'GET',
    url: `/lol-match-history/v1/games/${gameId}`
  }, credentials)).json()
  let detailsList =  getParticipantsDetails(response,response.participants, response.participantIdentities)
  return detailsList
}

// 获取召唤师participants下面的详细数据
const getParticipantsDetails = (res,participants, participantIdentities) => {
  const nameList = getparticipantIdAndName(participantIdentities)
  let titleList = getDetailsTitle(res)
  let detalisList = []
  let team100Kills = 0
  let team200Kills = 0
  let team100GoldEarned = 0
  let team200GoldEarned = 0
  for (let i = 0; i < 5; i++) {
    team100Kills += participants[i].stats.kills
    team200Kills += participants[i + 5].stats.kills
    team100GoldEarned += participants[i].stats.goldEarned
    team200GoldEarned += participants[i+5].stats.goldEarned

    detalisList.push([analyticalData(participants[i],nameList[i].name,nameList[i].summonerId),
      analyticalData(participants[i+5],nameList[i+5].name,nameList[i+5].summonerId)])
  }
  titleList.push(team100Kills,team200Kills,goldToStr(team100GoldEarned),goldToStr(team200GoldEarned))
  detalisList.push(titleList)
  return detalisList
}
// 解析对局数据
const analyticalData  = (participant,nameList,accountIdList) => {
  return{
    name: nameList,
    accountId:accountIdList,
    teamType: participant.teamId,
    champLevel:participant.stats.champLevel,
    champImgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[participant.championId].alias}.png`,
    spell1Id:getspellImgUrl(participant.spell1Id),
    spell2Id:getspellImgUrl(participant.spell2Id),
    item0:getItemImgUrl(participant.stats.item0),
    item1:getItemImgUrl(participant.stats.item1),
    item2:getItemImgUrl(participant.stats.item2),
    item3:getItemImgUrl(participant.stats.item3),
    item4:getItemImgUrl(participant.stats.item4),
    item5:getItemImgUrl(participant.stats.item5),
    item6:getItemImgUrl(participant.stats.item6),
    kills:participant.stats.kills,
    deaths:participant.stats.deaths,
    assists:participant.stats.assists,
    //物理伤害
    physicalDamageDealtToChampions:participant.stats.physicalDamageDealtToChampions,
    // 魔法伤害
    magicDamageDealtToChampions:participant.stats.magicDamageDealtToChampions,
    // 真实伤害
    trueDamageDealtToChampions:participant.stats.trueDamageDealtToChampions,
    // 伤害总和
    totalDamageDealtToChampions:participant.stats.totalDamageDealtToChampions,
    // 承受伤害
    totalDamageTaken:participant.stats.totalDamageTaken,
    // 击杀野怪
    neutralMinionsKilled:participant.stats.neutralMinionsKilled,
    // 击杀小兵
    totalMinionsKill:participant.stats.totalMinionsKilled,
    // 获得金钱
    goldEarned:participant.stats.goldEarned,
    // 花费金钱
    goldSpent:participant.stats.goldSpent,
    // 视野得分
    visionScore:participant.stats.visionScore,
    // 防止视野
    wardsPlaced:participant.stats.wardsPlaced,
    // 符问数据
    runesList:[participant.stats.perk0,participant.stats.perk1,participant.stats.perk2,
      participant.stats.perk3,participant.stats.perk4,participant.stats.perk5],
    totalMinionsKilled:participant.stats.totalMinionsKilled+participant.stats.neutralMinionsKilled
  }
}
// 获取召唤师participantId 和 name
const getparticipantIdAndName = (participantIdentities) => {
  let dataList = []
  for (const participantIdentity of participantIdentities) {
    dataList.push({
      name: participantIdentity.player.summonerName,
      summonerId:participantIdentity.player.accountId})
  }
  return dataList
}
// 获取当前页面顶部详细数据
const getDetailsTitle = (gameInfo) => {
  let createTime = (new Date(gameInfo.gameCreation).toLocaleString()).split(' ')
  let dateStr = createTime[0].slice(5)
  let timeStr = createTime[1].slice(0, 5)
  if (queryGameType(gameInfo.queueId).indexOf(' ') != -1){
    var lane = queryGameType(gameInfo.queueId).split(' ')[1]
  }else {
    var lane = queryGameType(gameInfo.queueId)
  }

  let gameDuration = ((gameInfo.gameDuration) / 60).toFixed(0)
  return [dateStr, timeStr, lane, gameDuration]
}
const goldToStr = (gold) => {
  return Number((gold/1000).toFixed(1))
}
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

// 通过召唤师id获取召唤师图片地址
const getspellImgUrl = (spellId) => {
  switch (spellId) {
    case 4:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_flash.png';
    case 14:return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerIgnite.png';
    case 11:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_smite.png';
    case 6:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_haste.png';
    case 12:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_teleport.png';
    case 21:return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerBarrier.png';
    case 3:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_exhaust.png';
    case 1:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_boost.png';
    case 7:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_heal.png';
    case 32:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_Mark.png'
  }
  return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerMana.png'
}

// 通过物品id获取图片地址
const getItemImgUrl = (item) => {
  if (item == 7013){
    return `https://game.gtimg.cn/images/lol/act/img/item/3802.png`
  }else if (item== 7004){
    return `https://game.gtimg.cn/images/lol/act/img/item/3068.png`
  }
  if (item == 0){
    return 'https://gw.alipayobjects.com/zos/rmsportal/wYnHWSXDmBhiEmuwXsym.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng'
  }else {
    return `https://game.gtimg.cn/images/lol/act/img/item/${item}.png`
  }
}

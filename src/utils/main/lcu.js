import {createHttp1Request, createHttp2Request, createHttpSession} from '../league-connect'
import {appConfig} from './config'
import {getGameScore} from "@/utils/main/gameScore";
import {champDict} from "@/utils/render/lolDataList";
//选择或者禁用英雄共用函数
const champSelectPatchAction = async (credentials, actionID, champId, type) => {
  let localBody = {
    "completed": true,
    "type": type,
    "championId": champId
  }

  try {
    const res = await createHttp1Request({
      method: "PATCH",
      url: `/lol-champ-select/v1/session/actions/${actionID}`,
      body: localBody
    }, credentials)
    return res.status
  } catch (e) {
    console.log('Json Error Can Ignore')
  }
}
//自动秒选英雄
export const autoPickChampion = async (credentials, actionID, type) => {
  const championPickId = appConfig.get('autoPickChampion.championId')
  // ReadyCheck GameStart InProgress
  return champSelectPatchAction(credentials, actionID, championPickId, type)
}
// 自动禁用英雄
export const autoBanChampion = async (credentials, actionID, type) => {
  const championBanId = appConfig.get('autoBanChampion.championId')
  // ReadyCheck
  return champSelectPatchAction(credentials, actionID, championBanId, type)
}
// 自动接受对局
export const autoAcceptGame = async (credentials) => {
  const isAutoAccept = appConfig.get('autoAccept')
  if (isAutoAccept<50){return}

  const setTime = (isAutoAccept-50)*200
  setTimeout( async ()=>{
    try {
      await createHttp1Request({
        method: "POST",
        url: '/lol-matchmaking/v1/ready-check/accept',
        body: null
      }, credentials)
    } catch (e) {
      console.log(e)
    }
  },setTime)
}
// 获取选人会话
export const champSelectSession = async (credentials,idSetInterval) => {
  const res = await createHttp1Request({
    method: "GET",
    url: '/lol-champ-select/v1/session'
  }, credentials)

  if (res.json().httpStatus == 404) {
    console.log(404)
    return
  }
  let localPlayerCellId = res.json().localPlayerCellId
  let actions = res.json().actions
  let userActionID
  for (let action of actions) {
    for (let actionElement of action) {
      if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
        userActionID = actionElement.id
        if (actionElement.type == 'pick' && !actionElement.completed && appConfig.get('autoPickChampion.isAuto')) {
          console.log('pick')
          autoPickChampion(credentials, userActionID, 'pick')
          clearInterval(idSetInterval)
        } else if (actionElement.type == 'ban' && !actionElement.completed && appConfig.get('autoBanChampion.isAuto')) {
          console.log('ban')
          autoBanChampion(credentials, userActionID, 'ban')
        } else {
          return
        }
      }
    }
  }
}
// 监听选择的英雄
export const listenChampSelect = async (ws, assistWindow, credentials) => {
  ws.subscribe('/lol-champ-select/v1/session', async (data) => {
    const currentChampId = await getCurrentChamp(credentials)
    if (currentChampId !=0 ){
      pickChampAram(assistWindow,currentChampId)
    }else {
      let localPlayerCellId = data.localPlayerCellId
      let actions = data.actions
      for (let action of actions) {
        for (let actionElement of action) {
          if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress && actionElement.type != 'ban') {
              pickChampRank(assistWindow,actionElement.championId)
          }
        }
      }
    }
  })
}
// 大乱斗选择英雄
const pickChampAram = async (assistWindow,currentChampId) => {
  if (currentChampId !=0){
    assistWindow.webContents.send('current-champ-select', {
      champId:currentChampId,mode:'aram'})
  }
}
// 排位或者匹配选择英雄
const pickChampRank = async (assistWindow,currentChampId) => {
  if (currentChampId != 0) {
    assistWindow.webContents.send('current-champ-select', {
      champId: currentChampId, mode: 'other'
    })
  }
}
// 查询当前游戏模式
const queryCurrentGameMode = async (credentials) => {
// 获取当前游戏模式信息
  const currentGameInfo = (await createHttp1Request({
    method: "GET",
    url: '/lol-gameflow/v1/session',
  }, credentials)).json()
  try {
    return currentGameInfo.gameData.queue.id
  }catch (e){
    return
  }
}
// 应用符文页面
export const applyRunePage = async (credentials, data) => {
  try {
    // 获取符文页信息
    const currentRuneList = (await createHttp1Request({
      method: "GET",
      url: 'lol-perks/v1/pages',
    }, credentials)).json()
    const current = currentRuneList.find((i) => i.current && i.isDeletable)
    if (current != undefined) {
      // 删除当前符文页
      await createHttp1Request({
        method: "DELETE",
        url: `lol-perks/v1/pages/${current.id}`,
      }, credentials)
    }
    // 写入新的符文页
    await createHttp1Request({
      method: "POST",
      url: 'lol-perks/v1/pages',
      body: data
    }, credentials)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
// 自动配置符文
export const setAutoRuneFromChamp = async (credentials, champId) => {
  // 获取符文页信息
  const currentRuneList = (await createHttp1Request({
    method: "GET",
    url: 'lol-perks/v1/pages',
  }, credentials)).json()
  const current = currentRuneList.find((i) => i.current && i.isDeletable)
  appConfig.set(`autoRune.${champId}`, current)
}
// 获取当前选择的英雄
const getCurrentChamp = async (credentials) => {
  const session = await createHttpSession(credentials)
  const currentChamp = (await createHttp2Request({
    method: "GET",
    url: '/lol-champ-select/v1/current-champion',
  }, session, credentials))
  session.close()
  return currentChamp.json()
}
// 获取选择英雄时的对局聊天组的ID
export const getChatSelectChampId = async (credentials) => {
  try {
    const chatList = (await createHttp1Request({
      method: "GET",
      url: '/lol-chat/v1/conversations',
    }, credentials))
    const chatSelectGroup = chatList.json().find((i) => i.type == "championSelect")
    return chatSelectGroup.id
  }catch (e){
    return null
  }
}
// 查询对局中的所有召唤师的Id
export const queryAllSummonerId = async (credentials) => {
  let summonerIdList = []
  const chatId = await getChatSelectChampId(credentials)
  if (chatId == null){return null}

  const summonersId = (await createHttp1Request({
    method: "GET",
    url: `/lol-chat/v1/conversations/${chatId}/messages`,
  }, credentials)).json()
  for (const summonersIdElement of summonersId) {
    summonerIdList.push(summonersIdElement.fromSummonerId)
  }
  // 数组去重
  summonerIdList = [... new Set(summonerIdList)]
  // // todo 测试
  // let summonerIdList = [2947489903,2943068890,2205753043394816,2937983583,2932246721]
  return summonerIdList
}

// 根据召唤师ID查询信息
const querySummonerInfo = async (credentials,summonerId) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/summoners/${summonerId}`,
  }, credentials)).json()
  return summonerInfo
}
// 获取召唤师昵称和等级和头像
export const getSummonerNickName = async (credentials,enemyIdList) => {
  console.log('[info] 获取召唤师昵称和等级和头像...')
  const session = await createHttpSession(credentials)
  let allSummonerId
  if (enemyIdList != null){
    allSummonerId = enemyIdList
  }else {
    allSummonerId = await queryAllSummonerId(credentials)
  }
  if (allSummonerId == null){
    return null
  }

  let allSummonerNickName = []
  for (const summonerId of allSummonerId) {
    const summonerInfo = await querySummonerInfo(credentials,summonerId)
    let name = summonerInfo.displayName
    let iconId = summonerInfo.profileIconId
    let level = summonerInfo.summonerLevel
    // 通过召唤师ID查询最近5场排位进行分数分析 得出匹马信息
    let gameSocreInfo = await getGameScore(credentials,summonerId,session)
    let rankPoint = await queryRankPoint(credentials,summonerInfo.puuid)
    if (rankPoint === null){
      rankPoint = `Lv: ${level}`
    }

    allSummonerNickName.push({name:name,iconId:iconId,score:gameSocreInfo['score'],
      horse:gameSocreInfo['horse'],kdaHistory:gameSocreInfo['kdaHistory'],summonerId:summonerId,
      rankPoint:rankPoint,simpleMatchHistory:gameSocreInfo.simpleMatchHistory
    })
  }
  session.close()
  return allSummonerNickName
}
// 获取当前排位模式的段位分数
const queryRankPoint = async (credentials,puuid) => {
  const currentMatchMode = await queryCurrentGameMode(credentials)
  if (currentMatchMode !=420 && currentMatchMode!= 440){
    return null
  }
  const rankData =  await accordingToRankModeQueryRankPoint(credentials,currentMatchMode,puuid)
  // 查询单双排的分数
  return rankData
}
// 查询不同排位模式的段位分数
const accordingToRankModeQueryRankPoint = async (credentials,mode,puuid) => {
  const matchType = mode === 420 ? 'RANKED_SOLO_5x5' : 'RANKED_FLEX_SR'
  const rankData = (await createHttp1Request({
    method:"GET",
    url:`/lol-ranked/v1/ranked-stats/${puuid}`
  },credentials)).json().queueMap[matchType]

  const tier = englishToChinese(rankData.tier)
  const division = rankData.division === 'NA' ? '' : rankData.division
  const leaguePoints = rankData.leaguePoints

  return `${tier}${division}  ${leaguePoints}`
}
// 发送消息到当前聊天界面
export const sendMessageToChat = async (credentials,message) => {
  const chatId = await getChatSelectChampId(credentials)
  await createHttp1Request({
    method: "POST",
    url: `/lol-chat/v1/conversations/${chatId}/messages`,
    body:{
      "body":message,
      "type":'chat'
    }
  }, credentials)
}
// 获取每局游戏中,召唤师的信息
export const queryMatchSummonerInfo = async (credentials,summonerId) => {
  const matchList = (await createHttp1Request({
    method: "GET",
    url: `/lol-match-history/v3/matchlist/account/${summonerId}`,
  }, credentials)).json()['games']['games'].reverse()
  let matchInfoList = []
  for (const matchListElement of matchList) {
    // 本局游戏ID
    let gameId = matchListElement.gameId
    // 召唤师选择的英雄
    let champImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchListElement.participants[0].championId)].alias}.png`
    // 是否取得胜利
    let isWin = matchListElement.participants[0].stats.win == true ? '胜利' :'失败'
    // 召唤师技能1
    let spell1Id = getspellImgUrl(matchListElement.participants[0].spell1Id)
    // 召唤师技能2
    let spell2Id = getspellImgUrl(matchListElement.participants[0].spell2Id)
    // 物品
    let item0 =  getItemImgUrl(matchListElement.participants[0].stats.item0)
    let item1 =  getItemImgUrl(matchListElement.participants[0].stats.item1)
    let item2 =  getItemImgUrl(matchListElement.participants[0].stats.item2)
    let item3 =  getItemImgUrl(matchListElement.participants[0].stats.item3)
    let item4 =  getItemImgUrl(matchListElement.participants[0].stats.item4)
    let item5 =  getItemImgUrl(matchListElement.participants[0].stats.item5)
    let item6 =  getItemImgUrl(matchListElement.participants[0].stats.item6)
    // 游戏模式
    let queueId = queryGameType(matchListElement.queueId)
    // 召唤师位置
    let lane = querySummonerPosition(matchListElement.participants[0].timeline.lane)
    // 击杀数目
    let kills = matchListElement.participants[0].stats.kills
    // 死亡数目
    let deaths =matchListElement.participants[0].stats.deaths
    // 助攻数目
    let assists = matchListElement.participants[0].stats.assists
    // 游戏时间
    let matchTime = (matchListElement.gameCreationDate).split('T')[0]
    let matchJson = {
      gameId,champImgUrl,isWin,spell1Id,spell2Id,item0,item1,item2,item3,item4,item5,item6,queueId,
      lane,kills,deaths,assists,matchTime}
    matchInfoList.push(matchJson)
  }
  matchInfoList.push(await querySummonerSuperChampData(credentials,summonerId))
  console.log('[info] 查询战绩函数执行了...')
  return matchInfoList
}
// 获取召唤师英雄绝活数据
const querySummonerSuperChampData = async (credentials,summonerId) => {
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
// 判断玩家位置
const querySummonerPosition = (lane) => {
  switch (lane) {
    case 'MIDDLE' : return '中单';
    case 'JUNGLE' : return '打野';
    case 'BOTTOM' : return '下路';
    case 'TOP' : return '上单';
    case 'NONE': return '未知'
  }
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
// 获取一局游戏的详细数据
export const queryGameDetailsData = async (gameId,credentials)  => {
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
    totalDamageDealtToChampions:participant.stats.totalDamageDealtToChampions,
    totalDamageTaken:participant.stats.totalDamageTaken,
    goldEarned:participant.stats.goldEarned,
    visionScore:participant.stats.visionScore,
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
// 英文段位昵称转中文
const englishToChinese = (tier) => {
  switch (tier) {
    case 'NONE' :return '未定级';
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

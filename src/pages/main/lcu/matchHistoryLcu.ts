// 查询本地召唤师信息
import {invokeLcu} from "../lcu";
import {lcuSummonerInfo} from "./types/homeLcuTypes";
import {queryAllSummonerId} from "../utils/blacklistUtils"
import {getGameScore,queryCurrentGameMode} from "../utils/gameScore"
import {englishToChinese,queryGameType,getspellImgUrl,getItemImgUrl,querySummonerPosition} from "./utils"
import {champDict} from "../resources/champList"

const queryLoaclSummoner = async () => {
  const summonerInfo:lcuSummonerInfo = await invokeLcu('get','/lol-summoner/v1/current-summoner')
  return  summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (summonerId:Number):Promise<lcuSummonerInfo> => {
  return await invokeLcu('get',`/lol-summoner/v1/summoners/${summonerId}`)
}

// 查询敌方召唤师ID和昵称
export const querySummonerIDInProgress= async () => {
  const currentId = await queryLoaclSummoner()
  const mactchSession = await invokeLcu('get','/lol-gameflow/v1/session')

  let friendInfoList = []

  if (mactchSession.gameData.teamOne.find((i:any) =>i.accountId === currentId )){
    var friendInfo = mactchSession.gameData.teamOne
  }else{
    var friendInfo = mactchSession.gameData.teamTwo
  }

  for (let i = 0; i < friendInfo.length; i++) {
    try {
      friendInfoList.push(friendInfo[i].accountId)
    } catch (e) {
      break
    }
  }
  return friendInfoList
}

// 查询不同排位模式的段位分数
const accordingToRankModeQueryRankPoint = async (mode:number,puuid:string) => {
  const matchType = mode === 420 ? 'RANKED_SOLO_5x5' : 'RANKED_FLEX_SR'
  const rankData = (await invokeLcu('get',`/lol-ranked/v1/ranked-stats/${puuid}`)).queueMap[matchType]
  const tier = englishToChinese(rankData.tier)
  const division = rankData.division === 'NA' ? '' : rankData.division
  const leaguePoints = rankData.leaguePoints
  return `${tier}${division}  ${leaguePoints}`
}

// 获取当前排位模式的段位分数
const queryRankPoint = async (puuid:string) => {
  const currentMatchMode = await queryCurrentGameMode()
  if (currentMatchMode !=420 && currentMatchMode!= 440){
    return null
  }
  const rankData =  await accordingToRankModeQueryRankPoint(currentMatchMode,puuid)
  // 查询单双排的分数
  return rankData
}

// 获取召唤师昵称和等级和头像
export const getSummonerNickName = async (enemyIdList?:any) => {
  console.log('[info] 获取召唤师昵称和等级和头像...')
  let allSummonerId
  if (enemyIdList !== undefined){
    allSummonerId = enemyIdList
  }else {
    // 查询对局中的所有召唤师的Id
    allSummonerId = await queryAllSummonerId()
  }
  if (allSummonerId == null){
    return null
  }
  let allSummonerNickName:any[] = []
  for (const summonerId of allSummonerId) {
    const summonerInfo = await querySummonerInfo(summonerId)
    const gameSocreInfo = await getGameScore(summonerId)
    const rankPoint = await queryRankPoint(summonerInfo.puuid)
    allSummonerNickName.push({
      summonerId:summonerId,
      name: summonerInfo.displayName,
      iconId:summonerInfo.profileIconId,
      // 通过召唤师ID查询最近5场排位进行分数分析 得出匹马信息
      score:gameSocreInfo['score'],
      horse:gameSocreInfo['horse'],
      kdaHistory:gameSocreInfo['kdaHistory'],
      simpleMatchHistory:gameSocreInfo.simpleMatchHistory,
      rankPoint:rankPoint === null ? `Lv: ${summonerInfo.summonerLevel}`:rankPoint
    })
  }
  return allSummonerNickName
}

// 查询敌方召唤师ID
export const queryEnemySummonerId= async () => {
  // todo test
  // const enemyId =[4000557119,4009650116,2935173990,2928803974,4004032333]
  // return enemyId
  const mactchSession =  await invokeLcu('get','/lol-gameflow/v1/session')
  const curSummoner = await queryLoaclSummoner()
  let enemyId = []
  if (mactchSession.gameData.teamOne.find((i:any) =>i.accountId === curSummoner )){
    var enemyInfo = mactchSession.gameData.teamTwo
  }else{
    var enemyInfo = mactchSession.gameData.teamOne
  }
  for (const enemy of enemyInfo) {
    enemyId.push(enemy.accountId)
  }
  return enemyId
}

//----- standing page functions
export const queryMatchSummonerInfo = async (summonerId:number) => {
  const matchList = (await invokeLcu('get',`/lol-match-history/v3/matchlist/account/${summonerId}`))['games']['games'].reverse()

  const matchInfoList = matchList.reduce((res:any,matchListElement:any) => {
    return res.concat({
      // 本局游戏ID
       gameId : matchListElement.gameId,
      // 召唤师选择的英雄
      // @ts-ignore
       champImgUrl : `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchListElement.participants[0].championId)].alias}.png`,
      // 是否取得胜利
       isWin : matchListElement.participants[0].stats.win == true ? '胜利' :'失败',
      // 召唤师技能1
       spell1Id : getspellImgUrl(matchListElement.participants[0].spell1Id),
      // 召唤师技能2
       spell2Id : getspellImgUrl(matchListElement.participants[0].spell2Id),
      // 物品
       item0 :  getItemImgUrl(matchListElement.participants[0].stats.item0),
       item1 :  getItemImgUrl(matchListElement.participants[0].stats.item1),
       item2 :  getItemImgUrl(matchListElement.participants[0].stats.item2),
       item3 :  getItemImgUrl(matchListElement.participants[0].stats.item3),
       item4 :  getItemImgUrl(matchListElement.participants[0].stats.item4),
       item5 :  getItemImgUrl(matchListElement.participants[0].stats.item5),
       item6 :  getItemImgUrl(matchListElement.participants[0].stats.item6),
      // 游戏模式
       queueId : queryGameType(matchListElement.queueId),
      // 召唤师位置
       lane : querySummonerPosition(matchListElement.participants[0].timeline.lane),
      // 击杀数目
       kills : matchListElement.participants[0].stats.kills,
      // 死亡数目
       deaths :matchListElement.participants[0].stats.deaths,
      // 助攻数目
       assists : matchListElement.participants[0].stats.assists,
      // 游戏时间
       matchTime : (matchListElement.gameCreationDate).split('T')[0]
    })
  },[])
  matchInfoList.push(await querySummonerSuperChampData(summonerId))
  console.log('[info] 查询战绩函数执行了...')
  return matchInfoList
}
// 获取召唤师英雄绝活数据
const querySummonerSuperChampData = async (summonerId:number) => {
  const summonerSuperChampData = (await invokeLcu('get',`/lol-collections/v1/inventories/${summonerId}/champion-mastery`)).slice(0,20)
  const superChampList = summonerSuperChampData.reduce((res:any,item:any) => {
    return res.concat({
      // @ts-ignore
      champImgUrl:`https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
      champLevel:item.championLevel,
      championPoints:item.championPoints,
    })
  },[])
  return superChampList
}

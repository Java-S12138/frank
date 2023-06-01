import {invokeLcu} from "./index";
import {lcuSummonerInfo, summonerInfo} from "./types/homeLcuTypes";
import {Game, LcuMatchList,MatchList} from "./types/queryMatchLcuTypes"
import {champDict} from "../resources/champList";
import {dealDivsion, englishToChinese, queryGameType} from "./utils"

// 查询本地召唤师Id
const queryCurrentSummonerId = async () => {
  const summonerInfo: lcuSummonerInfo = await invokeLcu('get', '/lol-summoner/v1/current-summoner')
  return summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (summonerId: number): Promise<summonerInfo> => {
  const summonerInfo: lcuSummonerInfo = await invokeLcu('get', `/lol-summoner/v1/summoners/${summonerId}`)
  const imgUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`
  return {
    name: summonerInfo.displayName,
    imgUrl,
    lv: summonerInfo.summonerLevel,
    xpSL: summonerInfo.xpSinceLastLevel,
    xpNL: summonerInfo.xpUntilNextLevel,
    puuid: summonerInfo.puuid,
    currentId: summonerInfo.summonerId
  }
}

// 获取召唤师英雄绝活数据
const querySummonerSuperChampData = async (summonerId: number) => {
  try {
    const isSubscribe =  localStorage.getItem('isSubscribe')
    const dataCount = isSubscribe === 't' ? 20 : 10
    const summonerSuperChampData: any = await invokeLcu('get', `/lol-collections/v1/inventories/${summonerId}/champion-mastery`)
    return  summonerSuperChampData.slice(0, dataCount).reduce((res: any, item: any) => {
      return res.concat({
        champImgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
        champLevel: item.championLevel,
        championPoints: item.championPoints
      })
    }, [])
  } catch (e) {
    return []
  }
}

// 查询召唤师排位分数
const queryCurrentRankPoint = async (puuid: string) => {
  const rankPoint = (await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`)).queues
  // 单双排位/ 灵活排位/ 云顶之亦
  let rankSolo = rankPoint.find((i: any) => i.queueType === "RANKED_SOLO_5x5")
  let rankSr = rankPoint.find((i: any) => i.queueType === "RANKED_FLEX_SR")
  let rankTft = rankPoint.find((i: any) => i.queueType === "RANKED_TFT")

  let RANKED_SOLO = rankSolo.tier === "" ? '未定级' : `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  let RANKED_FLEX_SR = rankSr.tier === "" ? '未定级' : `${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  let RANKED_TFT = rankTft.tier === "" ? '未定级' : `${englishToChinese(rankTft.tier)}${dealDivsion(rankTft.division)} ${rankTft.leaguePoints}`

  return [RANKED_SOLO, RANKED_FLEX_SR, RANKED_TFT]
}

export const returnSummonerData = async (summonerId?: number) => {
  if (summonerId === undefined) {
    const initQueryMatch = localStorage.getItem('initQueryMatch')
    if (initQueryMatch !== null){
      const jsonQueryMatch = JSON.parse(initQueryMatch)
      summonerId = jsonQueryMatch?.summonerId
      var assistGameId = jsonQueryMatch?.matchId
      localStorage.removeItem('initQueryMatch')
    }
  }

  if (summonerId === undefined) {
    summonerId = await queryCurrentSummonerId()
  }
  const summonerInfo: summonerInfo = await querySummonerInfo(summonerId)
  const [rankData,superChampList] = await Promise.all([
    queryCurrentRankPoint(summonerInfo.puuid),
    querySummonerSuperChampData(summonerId)
  ])
  return {summonerInfo, rankData, superChampList,assistGameId}
}

export const returnRankData = async (summonerId: number) => {
  const summonerInfo = await querySummonerInfo(summonerId)
  return await queryCurrentRankPoint(summonerInfo.puuid)
}

// matchDetailed Page ==================================================================== //

// 根据召唤师ID查询战绩
const queryMatchHistory = async (summonerId: string, begIndex: number, endIndex: number): Promise<LcuMatchList|null> => {
  const res = await invokeLcu(
    'get',
    `/lol-match-history/v1/products/lol/${summonerId}/matches`,
    [begIndex, endIndex])
  if (res?.success === false){
    return null
  }
  return res
}

// 获取简单的对局数据
const getSimpleMatch = (match: Game,gameModel:string):MatchList => {
  return {
    gameId: match.gameId,
    champImgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(match.participants[0].championId)].alias}.png`,
    champ: champDict[String(match.participants[0].championId)].title,
    // 是否取得胜利
    isWin: match.participants[0].stats.win === true ? true : false,
    // 击杀数目
    kills: match.participants[0].stats.kills,
    // 死亡数目
    deaths: match.participants[0].stats.deaths,
    // 助攻数目
    assists: match.participants[0].stats.assists,
    // 游戏时间
    matchTime: timestampToDate(match.gameCreation),
    // 游戏模式
    gameModel:gameModel
  }
}

// 处理战绩数据
export const dealMatchHistory = async (summonerId: string, begIndex: number, endIndex: number, mode: string|undefined):Promise<Array<MatchList> | null>  => {
  const matchList = await queryMatchHistory(summonerId, begIndex, endIndex)

  if (matchList === null) {return null}
  if (matchList?.games?.games?.length === 0 || matchList?.games?.games ===undefined ) {return null}

  const simpleMatchList = []
  const specialSimpleMatchList = []
  for (const matchListElement of isRevGames(matchList.games.games)) {
    // 游戏模式
    let gameModel = queryGameType(matchListElement.queueId)
    if (gameModel === mode) {
      specialSimpleMatchList.push(getSimpleMatch(matchListElement,gameModel))
    }else if (mode === undefined) {
      simpleMatchList.push(getSimpleMatch(matchListElement,gameModel))
    }
  }
  if (mode === undefined) {
    return simpleMatchList
  } else {
    return specialSimpleMatchList
  }
}

const timestampToDate = (timestamp: number) => {
  var date = new Date(timestamp)
  return (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate()
}

// 查看特定模式的战绩
export const querySpecialMatchHistory = async (summonerId: string, mode: string):Promise<Array<MatchList>> => {
  let specialDict: any = []
  for (let i = 0; i < 8; i++) {
    const matchHistory: any = await dealMatchHistory(summonerId, 20 * i, 20 * (i + 1), mode)
    if (matchHistory===null){
      return specialDict
    }
    specialDict = [...specialDict, ...matchHistory]
  }
  return specialDict
}

const isRevGames = (games:Game[]):Game[]  =>  {
  let len = games.length
  if ( len>8 ) {
    len = 8
    games =  games.slice(0,8)
  }

  if (games[0].gameCreation > games[len-1].gameCreation) {
    return games
  }
  return games.reverse()
}

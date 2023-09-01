import {invokeLcu} from "../lcu";
import {champDict} from "../resources/champList"
import {lcuSummonerInfo} from "../lcu/types/homeLcuTypes";
import {Hater, HaterItem,PCSelections,SumListDetail,SummonerInfoList} from "../interface/blacklistTypes";
import {dealDivsion, englishToChinese} from "../lcu/utils";

// 查询本地召唤师信息
const queryLoaclSummoner = async () => {
  const summonerInfo: lcuSummonerInfo = await invokeLcu('get', '/lol-summoner/v1/current-summoner')
  return summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (summonerId: number|string): Promise<lcuSummonerInfo> => {
  return await invokeLcu('get', `/lol-summoner/v1/summoners/${summonerId}`)
}
// 获取召唤师的英雄
const getSelectChamp = (playerChampionSelections: PCSelections[]) => {
  const champDict:any = {}
  for (const summonerSelect of playerChampionSelections) {
    champDict[summonerSelect.summonerInternalName] = summonerSelect.championId
  }
  return champDict
}

const getPosition = (selectedPosition: string) => {
  switch (selectedPosition) {
    case 'BOTTOM':
      return 4;
    case 'JUNGLE':
      return 2;
    case 'TOP':
      return 1;
    case 'MIDDLE':
      return 3;
    case 'UTILITY':
      return 5;
    case 'NONE':
      return 0;
  }
  return 0
}

const getDetailedInfo = (summonerInfo:any[],playerChampionSelections:any,gameType:number) => {
  const infoList:SumListDetail[] = []
  for (const infoElement of summonerInfo) {
      infoList.push({
        name: infoElement.summonerName as string,
        summonerId: infoElement.summonerId as number,
        selectChamp:  (gameType === 420 || gameType === 440) ?
          "https://game.gtimg.cn/images/lol/act/img/champion/" + champDict[`${playerChampionSelections[infoElement.summonerInternalName]}`].alias + ".png" :
          `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${infoElement.profileIconId}.png`,
        index: getPosition(infoElement.selectedPosition)
      })
  }
  infoList.sort((x: any, y: any) => {
    return x.index - y.index
  })
  return infoList
}

// 查询敌方召唤师ID和昵称
export const queryEnemySummonerIdAndSummonerName = async ():Promise<[SumListDetail[], SumListDetail[], number]> => {
  const currentId = await queryLoaclSummoner()
  const mactchSession = await invokeLcu('get','/lol-gameflow/v1/session')
  // const mactchSession = (await request({
  //   'url': 'https://cdn.syjun.vip/frank/session.json',
  //   method: 'GET',
  // })).data
  const gameType = mactchSession?.gameData?.queue?.id
  const playerChampionSelections = getSelectChamp(mactchSession.gameData.playerChampionSelections)

  if (mactchSession.gameData.teamOne.find((i: any) => i.summonerId === currentId)) {
    var [enemyInfo,friendInfo] = [mactchSession.gameData.teamTwo,mactchSession.gameData.teamOne]
  } else {
    var [friendInfo,enemyInfo] = [mactchSession.gameData.teamTwo,mactchSession.gameData.teamOne]
  }

  return [
    getDetailedInfo(friendInfo,playerChampionSelections,gameType),
    getDetailedInfo(enemyInfo,playerChampionSelections,gameType),
    mactchSession.gameData.gameId as number
  ]
}

// 获取选择英雄时的对局聊天组的ID
const getChatSelectChampId = async () => {
  try {
    const chatList = await invokeLcu('get', '/lol-chat/v1/conversations')
    const chatSelectGroup = chatList.find((i: any) => i.type == "championSelect")
    return chatSelectGroup.id
  } catch (e) {
    return null
  }
}
// 查询对局中的所有召唤师的Id
export const queryAllSummonerId = async () => {
  // todo 测试
  let summonerIdList:string[] = []
  const chatId = await getChatSelectChampId()
  if (chatId === null){return null}

  const summonersId = await invokeLcu('get',`/lol-chat/v1/conversations/${chatId}/messages`)
  for (const summonersIdElement of summonersId) {
    summonerIdList.push(summonersIdElement.fromSummonerId)
  }
  // 数组去重
  return [... new Set(summonerIdList)]
}

const querySummonerRank = async (puuid:string) => {
  const rankPoint = (await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`)).queues
  if (rankPoint ===undefined){
    return ['error','error']
  }
  const rankSolo = rankPoint.find((i: any) => i.queueType === "RANKED_SOLO_5x5")
  const rankSr = rankPoint.find((i: any) => i.queueType === "RANKED_FLEX_SR")
  const RANKED_SOLO = rankSolo.tier === "" ? '未定级' : `${englishToChinese(rankSolo.tier)}${dealDivsion(rankSolo.division)} ${rankSolo.leaguePoints}`
  const RANKED_FLEX_SR = rankSr.tier === "" ? '未定级' : `${englishToChinese(rankSr.tier)}${dealDivsion(rankSr.division)} ${rankSr.leaguePoints}`
  return [RANKED_SOLO, RANKED_FLEX_SR]
}

const querySuperChampList = async (summonerId: string) => {
  try {
    const summonerSuperChampData:any = await invokeLcu('get', `/lol-collections/v1/inventories/${summonerId}/champion-mastery`)
    return  summonerSuperChampData.slice(0, 6).reduce((res: any, item: any) => {
      return res.concat([
        `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`
      ])
    }, [])
  } catch (e) {
    return []
  }
}
// 获取我方召唤师ID和昵称
export const querySummonerIdAndSummonerName = async ():Promise<[]| SummonerInfoList[]> => {
  console.log('获取我方召唤师ID和昵称')
  const summonerInfoList:SummonerInfoList[] = []
  const allSummonerId = await queryAllSummonerId()
  if (allSummonerId === null) {
    return []
  }

  for (const summonerId of allSummonerId) {
    const currentSummonerInfo = await querySummonerInfo(summonerId)
    const [rankHandler,champImgs] = await Promise.all([
      querySummonerRank(currentSummonerInfo.puuid),
      querySuperChampList(summonerId)
    ])
    summonerInfoList.push({
      name: currentSummonerInfo.displayName,
      summonerId: `${summonerId}`,
      puuid:currentSummonerInfo.puuid,
      profileIconId:currentSummonerInfo.profileIconId,
      match:{
        rank: `${rankHandler[0]} • ${rankHandler[1]}`,
        champImgs:champImgs
      }
    })
  }
  return summonerInfoList
}

// 处理通过sumId查找到的Hater
export const handleHaterListBySumId = async (res: Hater[], localSumId: string) => {
  const blackList = []
  const existHater = []
  for (const haterItem of res) {
    const blacklistHater: HaterItem[] = haterItem.blacklist.length >=10 ? haterItem.blacklist.reverse().slice(0,10):haterItem.blacklist
    existHater.push(haterItem.sumId)
    for (const blacklistItem of blacklistHater) {
      // 显示本地召唤的数据
      if (localSumId === blacklistItem.playerSumId) {
        blackList.push({
          sumId: haterItem.sumId, nickName: haterItem.nickName, blacklist: blacklistItem
        })
        // 如果不是本地召唤师, 判断是否已经共享给了其他用户
      } else if (blacklistItem.isShow) {
        blackList.push({
          sumId: haterItem.sumId, nickName: haterItem.nickName, blacklist: blacklistItem
        })
      }
    }
  }
  return {blackList,existHater}
}

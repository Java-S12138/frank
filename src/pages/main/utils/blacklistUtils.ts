import {invokeLcu} from "../lcu";
import {champDict} from "../resources/champList"
import {lcuSummonerInfo} from "../lcu/types/homeLcuTypes";
import {Hater, HaterItem} from "../interface/blacklistTypes";
import {request} from "./request";

// 查询本地召唤师信息
const queryLoaclSummoner = async () => {
  const summonerInfo: lcuSummonerInfo = await invokeLcu('get', '/lol-summoner/v1/current-summoner')
  return summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (summonerId: Number): Promise<lcuSummonerInfo> => {
  return await invokeLcu('get', `/lol-summoner/v1/summoners/${summonerId}`)
}
// 获取召唤师的英雄
const getSelectChamp = (playerChampionSelections: any) => {
  let champDict = {}
  for (const summonerSelect of playerChampionSelections) {
    // @ts-ignore
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
}

// 查询敌方召唤师ID和昵称
export const queryEnemySummonerIdAndSummonerName = async () => {
  const currentId = await queryLoaclSummoner()
  // const mactchSession = await invokeLcu('get','/lol-gameflow/v1/session')

  const mactchSession = (await request({
    'url': 'https://cdn.syjun.vip/frank/session.json',
    method: 'GET',
  })).data

  let friendInfoList = []
  let enemyInfoList = []
  const playerChampionSelections = getSelectChamp(mactchSession.gameData.playerChampionSelections)

  if (mactchSession.gameData.teamOne.find((i: any) => i.accountId === currentId)) {
    var enemyInfo = mactchSession.gameData.teamTwo
    var friendInfo = mactchSession.gameData.teamOne
  } else {
    var enemyInfo = mactchSession.gameData.teamOne
    var friendInfo = mactchSession.gameData.teamTwo
  }

  for (let i = 0; i < friendInfo.length; i++) {
    try {
      friendInfoList.push({
        name: friendInfo[i].summonerName,
        summonerId: friendInfo[i].accountId,
        // @ts-ignore
        selectChamp: "https://game.gtimg.cn/images/lol/act/img/champion/" + champDict[`${playerChampionSelections[friendInfo[i].summonerInternalName]}`].alias + ".png",
        index: getPosition(friendInfo[i].selectedPosition)
      })
    } catch (e) {
      break
    }
  }
  for (let i = 0; i < enemyInfo.length; i++) {
    try {
      enemyInfoList.push({
        name: enemyInfo[i].summonerName,
        summonerId: enemyInfo[i].accountId,
        // @ts-ignore
        selectChamp: "https://game.gtimg.cn/images/lol/act/img/champion/" + champDict[`${playerChampionSelections[enemyInfo[i].summonerInternalName]}`].alias + ".png",
        index: getPosition(enemyInfo[i].selectedPosition)
      })
    } catch (e) {
      break
    }
  }

  friendInfoList.sort((x: any, y: any) => {
    return x.index - y.index
  })
  enemyInfoList.sort((x: any, y: any) => {
    return x.index - y.index
  })

  return [friendInfoList, enemyInfoList]
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
  // const summonerIdList = [2947489903,2943068890,2205753043394816,2937983583,2941902122]
  const summonerIdList = [2947489903, 2943068890, 2205753043394816, 2937983583, 4013465288]
  return summonerIdList
  // let summonerIdList = []
  // const chatId = await getChatSelectChampId()
  // if (chatId === null){return null}
  //
  // const summonersId = await invokeLcu('get',`/lol-chat/v1/conversations/${chatId}/messages`)
  //
  // for (const summonersIdElement of summonersId) {
  //   summonerIdList.push(summonersIdElement.fromSummonerId)
  // }
  // // 数组去重
  // summonerIdList = [... new Set(summonerIdList)]
  // return summonerIdList
}

// 获取我方召唤师ID和昵称
export const querySummonerIdAndSummonerName = async () => {
  console.log('获取我方召唤师ID和昵称')
  const summonerInfoList = []
  const allSummonerId = await queryAllSummonerId()
  if (allSummonerId === null) {
    return []
  }

  for (const allSummonerIdElement of <[]>allSummonerId) {
    const currentNickname = (await querySummonerInfo(allSummonerIdElement)).displayName
    summonerInfoList.push({name: currentNickname, summonerId: allSummonerIdElement})
  }
  return summonerInfoList
}

// 处理通过sumId查找到的Hater
export const handleHaterListBySumId = async (res: Hater[], localSumId: string) => {
  const blackList = []
  for (const haterItem of res) {
    const blacklistHater: HaterItem[] = haterItem.blacklist
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
  return blackList
}

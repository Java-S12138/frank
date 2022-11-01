import {createHttp1Request} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList"

// 查询本地召唤师信息
const queryLoaclSummoner = async (credentials) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/current-summoner`,
  }, credentials)).json()
  return  summonerInfo.summonerId
}
// 根据召唤师ID查询信息
const querySummonerInfo = async (credentials,summonerId) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/summoners/${summonerId}`,
  }, credentials)).json()
  return summonerInfo
}
// 获取召唤师的英雄
const getSelectChamp = (playerChampionSelections) => {
  let champDict = {}
  for (const summonerSelect of playerChampionSelections) {
    champDict[summonerSelect.summonerInternalName] = summonerSelect.championId
  }
  return champDict
}

const getPosition = (selectedPosition) => {
  switch (selectedPosition) {
    case 'BOTTOM': return 4;
    case 'JUNGLE': return 2;
    case 'TOP': return 1;
    case 'MIDDLE': return 3;
    case 'UTILITY': return 5;
    case 'NONE':return 0;
  }
}

// 查询敌方召唤师ID和昵称
export const queryEnemySummonerIdAndSummonerName= async (credentials) => {
  const currentId = await queryLoaclSummoner(credentials)
  const mactchSession = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/session`,
  },credentials)).json()

  // const mactchSession = (await request({
  //   'url': 'https://cdn.syjun.vip/frank/session.json',
  //   method: 'GET',
  // })).data

  let friendInfoList = []
  let enemyInfoList = []
  const playerChampionSelections = getSelectChamp(mactchSession.gameData.playerChampionSelections)

  if (mactchSession.gameData.teamOne.find((i) =>i.accountId === currentId )){
    var enemyInfo = mactchSession.gameData.teamTwo
    var friendInfo = mactchSession.gameData.teamOne
  }else{
    var enemyInfo = mactchSession.gameData.teamOne
    var friendInfo = mactchSession.gameData.teamTwo
  }

  for (let i = 0; i < friendInfo.length; i++) {
    try {
      friendInfoList.push({
        name: friendInfo[i].summonerName,
        summonerId: friendInfo[i].accountId,
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
        name:enemyInfo[i].summonerName,
        summonerId:enemyInfo[i].accountId,
        selectChamp:"https://game.gtimg.cn/images/lol/act/img/champion/"+champDict[`${playerChampionSelections[enemyInfo[i].summonerInternalName]}`].alias+".png",
        index:getPosition(enemyInfo[i].selectedPosition)
      })
    }catch (e) {
      break
    }
  }

  friendInfoList.sort((x,y) => { return x.index - y.index})
  enemyInfoList.sort((x,y) => { return x.index - y.index})

  return [friendInfoList,enemyInfoList]
}

// 获取选择英雄时的对局聊天组的ID
const getChatSelectChampId = async (credentials) => {
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
const queryAllSummonerId = async (credentials) => {
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
  // todo 测试
  // let summonerIdList = [2947489903,2943068890,2205753043394816,2937983583,2941902122]
  return summonerIdList
}

// 获取我方召唤师ID和昵称
export const querySummonerIdAndSummonerName = async (credentials) => {
  console.log('获取我方召唤师ID和昵称')
  const summonerInfoList = []
  const allSummonerId = await queryAllSummonerId(credentials)
  for (const allSummonerIdElement of allSummonerId) {
    const currentNickname = (await querySummonerInfo(credentials,allSummonerIdElement)).displayName
    summonerInfoList.push( {name:currentNickname,summonerId:allSummonerIdElement})
  }
  return summonerInfoList
}

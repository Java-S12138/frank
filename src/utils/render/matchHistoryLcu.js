// 查询本地召唤师信息
import {createHttp1Request} from "@/utils/league-connect";

const queryLoaclSummoner = async (credentials) => {
  const summonerInfo = (await createHttp1Request({
    method: "GET",
    url: `/lol-summoner/v1/current-summoner`,
  }, credentials)).json()
  return  summonerInfo.summonerId
}
// 查询敌方召唤师ID和昵称
export const querySummonerIDInProgress= async (credentials) => {
  const currentId = await queryLoaclSummoner(credentials)
  const mactchSession = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/session`,
  },credentials)).json()

  let friendInfoList = []

  if (mactchSession.gameData.teamOne.find((i) =>i.accountId === currentId )){
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

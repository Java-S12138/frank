import {createHttp1Request} from "league-connect";
import {appConfig} from "../main/config";
import {credentials} from "../types/lcu";

//选择或者禁用英雄共用函数
const champSelectPatchAction = async (credentials:credentials, actionID:string, champId:string, type:string) => {
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
export const autoPickChampion = async (credentials:credentials, actionID:string, type:string) => {
  const championPickId:string = appConfig.get('autoPickChampion.championId')
  // ReadyCheck GameStart InProgress
  return champSelectPatchAction(credentials, actionID, championPickId, type)
}
// 自动禁用英雄
export const autoBanChampion = async (credentials:credentials, actionID:string, type:string) => {
  const championBanId:string = appConfig.get('autoBanChampion.championId')
  // ReadyCheck
  return champSelectPatchAction(credentials, actionID, championBanId, type)
}
// 自动接受对局
export const autoAcceptGame = async (credentials:credentials) => {
  try {
    await createHttp1Request({
      method: "POST",
      url: '/lol-matchmaking/v1/ready-check/accept',
      body: null
    }, credentials)
  } catch (e) {
    console.log(e)
  }
}
// 获取选人会话
export const champSelectSession = async (credentials:credentials,idSetInterval:NodeJS.Timer) => {
  const res = await createHttp1Request({
    method: "GET",
    url: '/lol-champ-select/v1/session'
  }, credentials)

  if (res.json().httpStatus == 404) {
    console.log(404)
    return
  }
  let localPlayerCellId = res.json().localPlayerCellId
  let actions:any = res.json().actions
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
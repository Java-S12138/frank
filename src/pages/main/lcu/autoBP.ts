import {invokeLcu} from "./index";

//选择或者禁用英雄共用函数
const champSelectPatchAction = async (actionID:any, champId:any, type:string) => {
  const localBody = {
    "completed": true,
    "type": type,
    "championId": champId
  }
  try {
    invokeLcu('patch',`/lol-champ-select/v1/session/actions/${actionID}`,[localBody])
    return true
  } catch (e) {
    return false
  }
}

//自动秒选英雄
export const autoPickChampion = async (actionID:any, type:string) => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  const championPickId =config.autoPickChampion.championId
  return champSelectPatchAction(actionID, championPickId, type)
}
// 自动禁用英雄
export const autoBanChampion = async (actionID:any, type:string) => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  const championBanId =config.autoBanChampion.championId
  return champSelectPatchAction(actionID, championBanId, type)
}

// 获取选人会话
export const champSelectSession = async (idSetInterval:any) => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  try {
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    const localPlayerCellId = res.localPlayerCellId
    const actions = res.actions
    let userActionID
    for (let action of actions) {
      for (let actionElement of action) {
        if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
          userActionID = actionElement.id
          if (actionElement.type == 'pick' && !actionElement.completed && config.autoPickChampion.isAuto) {
            console.log('pick')
            autoPickChampion(userActionID, 'pick')
            clearInterval(idSetInterval)
            return true
          } else if (actionElement.type == 'ban' && !actionElement.completed && config.autoBanChampion.isAuto) {
            console.log('ban')
            autoBanChampion( userActionID, 'ban')
            return true
          } else {
            return
          }
        }
      }
    }
  }catch (e:any){
    return false
  }
}

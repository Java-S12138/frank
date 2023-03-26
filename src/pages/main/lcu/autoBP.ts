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

// 获取选人会话
export const champSelectSession = async (idSetInterval:number,config:any) => {
  try {
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    const localPlayerCellId = res?.localPlayerCellId
    const actions = res?.actions
    if (actions === undefined){
      clearInterval(idSetInterval)
    }

    for (let action of actions) {
      for (let actionElement of action) {
        if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
          if (actionElement.type === 'pick' && config.autoPickChampion.isAuto) {
            champSelectPatchAction(actionElement.id,config.autoPickChampion.championId,'pick')
          } else if (actionElement.type === 'ban'&& config.autoBanChampion.isAuto) {
            champSelectPatchAction(actionElement.id,config.autoBanChampion.championId,'ban')
          }
        }
        if (actionElement.actorCellId == localPlayerCellId && !actionElement.isInProgress){
          if (actionElement.type === 'pick' && actionElement.completed){
            clearInterval(idSetInterval)
          }
        }
      }
    }
  }catch (e:any){
    clearInterval(idSetInterval)
  }
}

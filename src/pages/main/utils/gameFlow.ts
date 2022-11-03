import {champSelectSession} from "../lcu/autoBP";
import {invokeLcu} from "../lcu";

export class GameFlow{

  public config = JSON.parse(String(localStorage.getItem('config')))

  // 显示或者隐藏助手窗口
  public showOrHideAssist = async (isShow:boolean,message:string) => {
    const assistWin = await cube.windows.getWindowByName('assist')
    if (isShow){cube.windows.show(assistWin.id)} else {cube.windows.hide(assistWin.id)}
    cube.windows.message.send(assistWin.id, message, '')
  }
  // 选择英雄结束后查询敌方召唤师信息
  public queryEnemyInfo = async () => {
    this.showOrHideAssist(false,'query-enemy-summoner')
    let matchHistoryWin
    try {
      matchHistoryWin = await cube.windows.getWindowByName('matchHistory')
    } catch (e: any) {
      matchHistoryWin = await cube.windows.obtainDeclaredWindow('matchHistory')
    }
    cube.windows.message.send(matchHistoryWin.id, 'query-enemy-summoner', '')
  }
  // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
  public isShowBlack = async () => {
    if (this.config.isSwitchBlacklist) {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'show-other-summoner', '')
    }
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    if (this.config.autoPickChampion.isAuto || this.config.autoBanChampion.isAuto){
      const idSetInterval = setInterval(async () =>  {
        champSelectSession(idSetInterval)
      },1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
    const isAutoAccept = this.config.autoAccept
    if (isAutoAccept<50){return}
    const setTime = (isAutoAccept-50)*200
    setTimeout( async ()=>{
      invokeLcu('post','/lol-matchmaking/v1/ready-check/accept')
    },setTime)
  }
}

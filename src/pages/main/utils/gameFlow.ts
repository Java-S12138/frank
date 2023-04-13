import {champSelectSession} from "../lcu/autoBP";
import {invokeLcu} from "../lcu";
import WindowInfo = cube.windows.WindowInfo;

export class GameFlow {
  public assistWin:WindowInfo|null = null
  public recentMatchWin:WindowInfo|null = null
  public isTFT:boolean = false

  // 显示或者隐藏助手窗口
  public showOrHideAssist = async (isShow: boolean, message: string,content:any) => {
    if (this.assistWin === null){
      this.assistWin = await cube.windows.getWindowByName('assist')
    }
    if (content === null){
      if (isShow) {
        cube.windows.show(this.assistWin.id)
      } else {
        cube.windows.hide(this.assistWin.id)
      }
      cube.windows.message.send(this.assistWin.id, message, '')
    }else {
      cube.windows.message.send(this.assistWin.id, message, content)
    }

  }
  // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
  public isShowBlack = async () => {
    const config = JSON.parse(<string>(localStorage.getItem('config')))
    if (config.isSwitchBlacklist && !this.isTFT) {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'show-other-summoner', '')
    }else {
      this.isTFT = false

    }
  }

  // 关闭某个窗口
  private coloseWin = (winName:string) => {
    cube.windows.getWindowByName(winName, false).then((v) => {
      cube.windows.close(v.id)
    }).catch(() => {})
  }

  // 选择英雄阶段结束后执行的操作
  public initGameInWindow = async () => {
    //游戏启动关闭桌面战绩历史窗口，打开游戏内战绩历史窗口
    cube.games.on('launched', () => {
      //游戏启动关闭桌面窗口和战绩历史窗口，打开游戏内窗口
      this.coloseWin('main')
      this.coloseWin('matchHistory')
      invokeLcu('get','/lol-lobby/v1/parties/gamemode').then((res:any) => {
        const queueId = res?.queueId
        const config = JSON.parse(<string>(localStorage.getItem('config')))
        const isGameInWindow = config.isGameInWindow

        // 当前模式不是云顶之亦才打开战绩历史窗口
        if (queueId !== 1090 && queueId !== 1100 && queueId !== 1160 && queueId !== 1130 && queueId !== 1170){
          cube.windows.obtainDeclaredWindow('recentMatch', {gamein: true,show_center:true}).then((v) => {
            this.recentMatchWin = v
            if (!isGameInWindow ){
              cube.windows.hide(<number>this.recentMatchWin?.id).then(() => {
                (<WindowInfo>this.recentMatchWin).show=false
              })
            }
          })
        }else {
          this.isTFT = true
        }
      })
    })

    //游戏结束创建桌面窗口
    cube.games.on('stopped', () => {
      cube.windows.obtainDeclaredWindow('main', { gamein: false,show:false})
      this.recentMatchWin = null
    })

    // 游戏内监听按键, 显示或隐藏游戏内窗口
    cube.settings.hotkeys.game.on('pressed',async (hotKeyName:string) => {
      if (hotKeyName==='show_matchHistory') {
        if (<boolean>this.recentMatchWin?.show){
          cube.windows.hide(<number>this.recentMatchWin?.id).then(() => {
            (<WindowInfo>this.recentMatchWin).show=false
          })
        }else {
          cube.windows.show(<number>this.recentMatchWin?.id).then(() => {
            (<WindowInfo>this.recentMatchWin).show=true
          })
        }
      }
    })

    // 检测到进入英雄联盟大厅后, 获取首页数据
    const closeOn =  cube.games.launchers.on('launched', () => {
      closeOn()
      setTimeout(() => {
        cube.windows.getWindowByName('main').then((win) => {
          cube.windows.message.send(win.id,'initHome','')
        })
      },3000)
    })
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    const config = JSON.parse(<string>(localStorage.getItem('config')))
    if (config.autoPickChampion.isAuto || config.autoBanChampion.isAuto) {
      const idSetInterval = setInterval(async () => {
        champSelectSession(idSetInterval,config)
      }, 1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
    if (localStorage.getItem('isSubscribe') === 'f'){
      return
    }
    const isAutoAccept = (JSON.parse(<string>(localStorage.getItem('config')))).autoAccept
    if (isAutoAccept < 50) {
      return
    }
    if (isAutoAccept === 50){
      invokeLcu('post', '/lol-matchmaking/v1/ready-check/accept')
      return
    }
    const setTime = (isAutoAccept - 50) * 200
    setTimeout(async () => {
      invokeLcu('get','/lol-matchmaking/v1/ready-check').then((res) => {
        if (res?.playerResponse !=='Declined'){
          invokeLcu('post', '/lol-matchmaking/v1/ready-check/accept')
        }
        return
      })
    }, setTime)
  }
}

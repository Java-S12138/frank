import {champSelectSession} from "../lcu/autoBP";
import WindowInfo = cube.windows.WindowInfo;
import {invokeLcu} from "../lcu";
import {ConfigSettingTypes} from "@/background/utils/backgroundTypes";

export class GameFlow {
  public mainWin: WindowInfo | null = null
  public recentMatchWin: WindowInfo | null = null
  public mapId = -1

  // 给主窗口发生信息
  public sendMesToMain = async (messageId: string, content = '') => {
    this.mainWin = this.mainWin || await cube.windows.getWindowByName('main')
    cube.windows.message.send(this.mainWin.id, messageId, content)
  }
  // 显示或者隐藏主窗口
  public showHideMainWin = async (isShow: boolean, messageId: string) => {
    this.mainWin = this.mainWin || await cube.windows.getWindowByName('main')
    isShow ? cube.windows.show(this.mainWin.id) : cube.windows.hide(this.mainWin.id)
    this.sendMesToMain(messageId)
  }
  // 关闭某个窗口
  public coloseWin = (winName: string) => {
    cube.windows.getWindowByName(winName, false).then((v) => {
      cube.windows.close(v.id)
    }).catch(() => {
    })
  }
  // 发送给主窗口游戏启动事件
  public sendStartEvent = async () => {
    this.mainWin = this.mainWin || await cube.windows.getWindowByName('main')
    cube.windows.message.send(this.mainWin.id, 'initHome', '')
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    const config: ConfigSettingTypes = JSON.parse(<string>(localStorage.getItem('configSetting')))
    if (config.autoPickChampion.isAuto || config.autoBanChampion.isAuto) {
      const idSetInterval = setInterval(async () => {
        champSelectSession(idSetInterval, config)
      }, 1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
    // todo
    /*if (localStorage.getItem('isSubscribe') === 'f') {
      return
    }*/
    const isAutoAccept = (JSON.parse(<string>(localStorage.getItem('configSetting')))).autoAccept
    if (isAutoAccept < 50) {
      return
    }
    if (isAutoAccept === 50) {
      invokeLcu('post', '/lol-matchmaking/v1/ready-check/accept')
      return
    }
    const setTime = (isAutoAccept - 50) * 200
    setTimeout(async () => {
      invokeLcu('get', '/lol-matchmaking/v1/ready-check').then((res) => {
        if (res?.playerResponse !== 'Declined') {
          invokeLcu('post', '/lol-matchmaking/v1/ready-check/accept')
        }
        return
      })
    }, setTime)
  }
  // 选择英雄阶段结束后执行的操作
  public initGameInWindow = async () => {
    //游戏启动关闭桌面战绩历史窗口，打开游戏内战绩历史窗口
    cube.games.on('launched', () => {
      this.coloseWin('matchAnalysis');this.coloseWin('queryMatch')

      if (this.mapId === 12 || this.mapId === 11) {
        const configSetting = JSON.parse(<string>(localStorage.getItem('configSetting')))
        if (configSetting.isGameInWindow){
          cube.windows.obtainDeclaredWindow('recentMatch',
            {gamein: true, show_center: true}).then((winInfo) => {
            this.recentMatchWin = winInfo
          })
        }
      }
    })
    this.onListenKeyboards()
  }
  // 游戏内监听按键, 显示或隐藏游戏内窗口
  public onListenKeyboards = () => {
    cube.settings.hotkeys.game.on('pressed', async (hotKeyName: string) => {
      if (![11, 12].includes(this.mapId)) {
        return
      }
      if (hotKeyName === 'show_recentMatch') {
        if (this.recentMatchWin === null){
          this.recentMatchWin =await cube.windows.obtainDeclaredWindow('recentMatch', {gamein: true, show_center: true})
          return
        }

        const windowId = <number>this.recentMatchWin.id
        const isWindowShown = <boolean>this.recentMatchWin.show

        if (isWindowShown) {
          await cube.windows.hide(windowId)
            .then(value => (this.recentMatchWin as WindowInfo).show = false)
        } else {
          await cube.windows.show(windowId)
            .then(value => (this.recentMatchWin as WindowInfo).show = true)
        }
      }
    })
  }
  // 写入游戏信息
  public writeGameInfo =  async () => {
    const res: any = await invokeLcu('get', '/lol-gameflow/v1/session')
    // 获取对局ID和地图ID
    if (res?.gameData !== undefined) {
      this.mapId = res.gameData.queue.mapId
      localStorage.setItem('gameInfo',
        String(JSON.stringify({
          queueId: res.gameData.queue.id,
          mapId: res.gameData.queue.mapId})
        )
      )
    }
  }
}

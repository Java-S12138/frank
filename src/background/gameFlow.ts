import {window} from "@tauri-apps/api";
import {emitTo} from "@tauri-apps/api/event";
import { ConfigSettingTypes} from "./types";
import {champSelectSession} from "@/lcu/autoBP.ts";
import {invokeLcu} from "@/lcu";
import {RecentMatchWindow} from "@/background/utils/creatWindow.ts";
import {invoke} from "@tauri-apps/api/core";
import {SessionTypes} from "@/recentMatch/utils/queryTypes";

export class GameFlow {
  public mapId = 11

  // 给主窗口发生信息
  public sendMesToMain = (messageId: string, content: any = '') => {
    window.Window.getByLabel('mainWindow').then((win) => {
      if (win !== null) {
        emitTo('mainWindow', 'clientStatus', {messageId: messageId, content: content})
      }
    })
  }
  // 显示或者隐藏主窗口
  public showHideMainWin =  (isShow: boolean, messageId: string) => {
    window.Window.getByLabel('mainWindow').then(async (win) => {
      if (win === null) {
        return
      }
      isShow ? await win.show() : await win.hide()
      emitTo('mainWindow','clientStatus', {messageId: messageId, content: ''})
    })
  }
  // 关闭某个窗口
  public closeWin = (winName: string) => {
    window.Window.getByLabel(winName).then(async (win) => {
      await win?.close()
    })
  }
  // 发送给主窗口游戏启动事件
  public sendStartEvent = async () => {
    window.Window.getByLabel('mainWindow').then((win) => {
      if (win !== null) {
        emitTo('mainWindow', 'initHome')
      }
    })
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    const config: ConfigSettingTypes = JSON.parse(<string>(localStorage.getItem('configSetting')))
    if (config.autoPickChampion.isAuto || config.autoBanChampion.isAuto) {
      const idSetInterval = setInterval(async () => {
        // @ts-ignore
        await champSelectSession(idSetInterval, config)
      }, 1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
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
      invokeLcu('get', '/lol-matchmaking/v1/ready-check').then((res: any) => {
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
    this.closeWin('matchAnalysisWindow');this.closeWin('queryMatchWindow');this.closeWin('recentMatchWindow')

    let count = 0
    const unListenGameStart =  setInterval(() => {
      invoke<boolean>("is_game_start").then((value) => {
        count++
        if (count > 10) {
          clearInterval(unListenGameStart)
        }
        if (value) {
          clearInterval(unListenGameStart)
          if (this.mapId === 12 || this.mapId === 11) {
            const configSetting = JSON.parse(<string>(localStorage.getItem('configSetting')))
            if (configSetting.isGameInWindow) {
              new RecentMatchWindow()
            }
          }
        }
      })
    },2000)
  }
  // 写入游戏信息
  public writeGameInfo = async () => {
    const res = await invokeLcu<SessionTypes>('get', '/lol-gameflow/v1/session')
    if (res===null) return;
    // 获取对局ID和地图ID
    if (res.gameData !== undefined) {
      this.mapId = res.gameData.queue.mapId
      localStorage.setItem('gameInfo',
        String(JSON.stringify({
            queueId: res.gameData.queue.id,
            mapId: res.gameData.queue.mapId
          })
        )
      )
    }
  }
}

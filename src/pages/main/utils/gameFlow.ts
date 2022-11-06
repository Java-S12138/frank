import {champSelectSession} from "../lcu/autoBP";
import {invokeLcu} from "../lcu";

export class GameFlow {
  // 显示或者隐藏助手窗口
  public showOrHideAssist = async (isShow: boolean, message: string) => {
    const assistWin = await cube.windows.getWindowByName('assist')
    if (isShow) {
      cube.windows.show(assistWin.id)
    } else {
      cube.windows.hide(assistWin.id)
    }
    cube.windows.message.send(assistWin.id, message, '')
  }
  // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
  public isShowBlack = async () => {
    const config = JSON.parse(String(localStorage.getItem('config')))
    if (config.isSwitchBlacklist) {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'show-other-summoner', '')
    }
    // 游戏结束后, 关闭游戏内的窗口
    cube.windows.getWindowByName('matchHistory', true).then((v) => {
      cube.windows.close(v.id)
    }).catch(() => {
    })
  }
  // 选择英雄阶段结束后执行的操作
  public initGameInWindow = () => {
  //游戏启动关闭桌面战绩历史窗口，打开游戏内战绩历史窗口
    cube.games.on('launched', () => {
      //游戏启动关闭桌面窗口，打开游戏内窗口
      cube.windows.getWindowByName('main', false).then((v) => {
        cube.windows.close(v.id);
      });
      cube.windows.getWindowByName('matchHistory', false).then((v) => {
        cube.windows.close(v.id)
      }).catch(() => {})
      cube.windows.obtainDeclaredWindow('matchHistory', { gamein: true,show:false}).then((v) => {
        cube.windows.hide(v.id).then(() => {
          setTimeout(() => {
            if (!JSON.parse(String(localStorage.getItem('config'))).isGameInWindow){
              return
            }else {
              cube.windows.show(v.id)
            }
          },3000)
        })
      })
    })
    cube.games.on('stopped', () => {
      //游戏结束创建桌面窗口
      cube.windows.obtainDeclaredWindow('main', { gamein: false,show:false})
    });

    cube.settings.hotkeys.game.on('pressed',async (hotKeyName:string) => {
      if (hotKeyName==='show_matchHistory') {
        const matchWin = await cube.windows.getWindowByName('matchHistory',true)
        if (matchWin.show){
          cube.windows.hide(matchWin.id)
        }else {
          cube.windows.show(matchWin.id)
        }
      }
    })
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    const config = JSON.parse(String(localStorage.getItem('config')))
    if (config.autoPickChampion.isAuto || config.autoBanChampion.isAuto) {
      const idSetInterval = setInterval(async () => {
        champSelectSession(idSetInterval)
      }, 1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
    const config = JSON.parse(String(localStorage.getItem('config')))
    const isAutoAccept = config.autoAccept
    if (isAutoAccept < 50) {
      return
    }
    const setTime = (isAutoAccept - 50) * 200
    setTimeout(async () => {
      invokeLcu('post', '/lol-matchmaking/v1/ready-check/accept')
    }, setTime)
  }
}

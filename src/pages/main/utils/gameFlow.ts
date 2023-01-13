import {champSelectSession} from "../lcu/autoBP";
import {invokeLcu} from "../lcu";
import WindowInfo = cube.windows.WindowInfo;

export class GameFlow {

  public jungleWin:WindowInfo|null = null
  public recentMatchWin:WindowInfo|null = null
  public isJungleSuccess = false

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
    const config = JSON.parse(<string>(localStorage.getItem('config')))
    if (config.isSwitchBlacklist) {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'show-other-summoner', '')
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
    const currentScreen = (await cube.utils.getPrimaryDisplay()).size
  //游戏启动关闭桌面战绩历史窗口，打开游戏内战绩历史窗口
    cube.games.on('launched', () => {
      //游戏启动关闭桌面窗口和战绩历史窗口，打开游戏内窗口
      this.coloseWin('main')
      this.coloseWin('matchHistory')

      invokeLcu('get','/lol-lobby/v1/parties/gamemode').then((res:any) => {
        const queueId = res?.queueId
        const config = JSON.parse(<string>(localStorage.getItem('config')))
        const isJungleTime = config.isJungleTime
        const isGameInWindow = config.isGameInWindow
        // 当前模式是召唤师峡谷之类的模式才打开野怪计时窗口
        if ((queueId === 430 ||queueId === 420 ||queueId === 440||queueId === 840||queueId === 830||queueId === 850)&&isJungleTime){
        // if (true){
          cube.windows.obtainDeclaredWindow('jungleTime',
            {gamein: true,x:currentScreen.width-220,y:currentScreen.height-350}).then((v) => {
            cube.windows.hide(v.id)
            this.jungleWin = v
          })
        }
        // 当前模式不是云顶之亦才打开战绩历史窗口
        if (queueId !== 1090 || queueId !== 1100 || queueId !== 1160 || queueId !== 1130 || queueId !== 1170){
          cube.windows.obtainDeclaredWindow('recentMatch', {gamein: true,show_center:true}).then((v) => {
            this.recentMatchWin = v
            if (!isGameInWindow){
              cube.windows.hide(<number>this.recentMatchWin?.id).then(() => {
                (<WindowInfo>this.recentMatchWin).show=false
              })
            }
          })
        }
      })
    })
    // 接收战绩历史窗口发送过来的消息,表示查询已经完成
    cube.windows.message.on('received',(id:string) => {
      if (id === 'jungle_success'){
        this.isJungleSuccess = true
      }
     })

    //游戏结束创建桌面窗口
    cube.games.on('stopped', () => {
      cube.windows.obtainDeclaredWindow('main', { gamein: false,show:false})
      this.jungleWin = null
      this.recentMatchWin = null
      this.isJungleSuccess = false
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
    // 游戏内监听按键, 显示或隐藏野怪计时窗口
    if (JSON.parse(<string>(localStorage.getItem('config'))).isJungleTime){
      cube.settings.hotkeys.game.on('hold',(name, state) => {
        if (name ==='show_jungleTime' && this.isJungleSuccess ){
          if (state==="down"){
            cube.windows.show(<number>this.jungleWin?.id)
          }else {
            cube.windows.hide(<number>this.jungleWin?.id)
          }
        }
      })
    }

    // 检测到进入英雄联盟大厅后, 获取首页数据
    if (JSON.parse(<string>(localStorage.getItem('config'))).isAutoLaunchGame){
      cube.games.launchers.on('launched', () => {
        cube.windows.getWindowByName('main').then((win) => {
          cube.windows.message.send(win.id,'initHome','')
        })
      })
    }
  }
  // 自动(禁用)选择英雄
  public autoPickBanChamp = () => {
    const config = JSON.parse(<string>(localStorage.getItem('config')))
    if (config.autoPickChampion.isAuto || config.autoBanChampion.isAuto) {
      const idSetInterval = setInterval(async () => {
        champSelectSession(idSetInterval)
      }, 1000)
    }
  }
  // 自动接收对局
  public autoAcceptGame = async () => {
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

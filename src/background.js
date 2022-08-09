import {app, BrowserWindow, ipcMain, Notification} from 'electron'
import {
  autoAcceptGame,
  champSelectSession,
  listenChampSelect,
} from './utils/main/lcu'
import {createWebSocketConnection} from './utils/league-connect'
import {appConfig, userAgentList} from './utils/main/config'
import {getAuthFromCmd, startClientExe} from './utils/main/clientStart'
import {returnRankData} from "@/utils/render/renderLcu";
import {
  createAssistWindow,
  createMainWindow,
  listenIpc,
  makeTray,
  createMatchHistoryWindow,
  createQueryMatchWindow
} from "../frankElectron";
const Store = require("electron-store");Store.initRenderer()
const path = require('path')

const iconPath = path.join(
  process.env.npm_lifecycle_event === "electron:serve" ? `${__dirname}/../resources` : `${__dirname}/../resources`,
  'app-icon.png',
)
const userHeader =userAgentList[Math.floor((Math.random()*userAgentList.length))]

let credentials;let mainWindow;let assistWindow;let matchHistoryWindow;

// -----------------------------main---------------------------- //
app.whenReady().then(async () => {
  mainWindow = await createMainWindow(userHeader)
  assistWindow = await createAssistWindow(userHeader)
  makeTray(iconPath,mainWindow,assistWindow)
  await startClient()
  listenIpc(mainWindow,assistWindow)
  mathcHistoryIpc()
  queryMatchIpc()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow()
    }
  })
})
// QueryMatch
// MatchHistory
// Assist
// Frank
const closeWin = (window) => {
  for (const currentWindow of BrowserWindow.getAllWindows()) {
    if (currentWindow.title === window){
      currentWindow.close()
    }
  }
}

const runLcu = async () => {
  const ws = await createWebSocketConnection(credentials)
  const isAutoAccept = appConfig.get('autoAccept')
  let idSetInterval

  const homeData = await returnRankData(credentials)
  mainWindow.webContents.send('init-home',homeData)
  mainWindow.webContents.send('client-connect-success')
  assistWindow.webContents.send('client-connect-success')

  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data) => {
    console.log(data)
    if (data ==='ChampSelect'){
      // 显示助手窗口
      assistWindow.show()
      assistWindow.setSkipTaskbar(true)
      // 获取其它召唤师信息
      assistWindow.webContents.send('query-other-summoner')
      // 秒选&秒禁英雄
      if (appConfig.get('autoPickChampion.isAuto') || appConfig.get('autoBanChampion.isAuto')){
        console.log('秒选&秒禁英雄')
        idSetInterval = setInterval(async () =>  {
          champSelectSession(credentials,idSetInterval)
        },1000)
      }

      // 监听英雄的选择
      listenChampSelect(ws,assistWindow,credentials)

    }else if (data ==='GameStart') {
      // 选择英雄结束后,发送消息给渲染进程, 让渲染进程获取到敌方召唤师信息
      if ( matchHistoryWindow != null) {
        if (!matchHistoryWindow.isDestroyed()) {
          matchHistoryWindow.webContents.send('query-enemy-summoner')
        }
      }

      assistWindow.hide()
      assistWindow.webContents.send('query-enemy-summoner')
      clearInterval(idSetInterval)
      ws.unsubscribe('/lol-champ-select/v1/session')
    }else if(data ==='PreEndOfGame'){ // PreEndOfGame
      if (appConfig.get('isSwitchBlacklist')){assistWindow.show()}
      assistWindow.webContents.send('show-other-summoner')
      closeWin('MatchHistory')
    } else if (data === 'Lobby' || data === 'None') {
        //选英雄途中退出游戏 关闭符文助手工具
        assistWindow && assistWindow.hide()
    }
    // 自动接受对局
    if (data =='ReadyCheck' && isAutoAccept>=50){
      autoAcceptGame(credentials)
    }
  })
}

const startClient = async () => {
  const clientExe = appConfig.get('gameDirectory')

  if ( clientExe === ''){
    new Notification({
      title:"请在设置中获取LOL启动文件",
      body:"启动文件路径例如: C:\\LOL\\英雄联盟\\TCLS\\Client.exe",
      icon:iconPath,
    }).show()
    credentials = await getAuthFromCmd()
    appConfig.set('credentials',credentials)
    return
  }

  getAuthFromCmd().then(async (res) => {
    if (res.port === ''){
      // 启动英雄联盟客户端
      mainWindow.webContents.send('client-starting')
      startClientExe(clientExe)
      // 二十秒后执行下列函数
      setTimeout(()  => {
        // 每一秒查看英雄联盟客户端是否登录成功
        // 登录成功后获取相应的数据 结束时间间隔函数
        let idSetInterval =  setInterval(() => {
          getAuthFromCmd().then(async (res) => {
            if (res.port != ''){
              clearInterval(idSetInterval)
              credentials = res
              appConfig.set('credentials',credentials)
              setTimeout(() => {
                runLcu()
              },6666)
            }
          })
        },1000)
      },20000)
    }else {
      credentials = res
      appConfig.set('credentials',res)
      runLcu()
    }
  })
}

const mathcHistoryIpc = async () => {
  // 展示战力分析窗口
  ipcMain.on('showCharts',async () => {
    matchHistoryWindow = await createMatchHistoryWindow(userHeader)
    // if (clientStatus === '"Matchmaking"' || clientStatus === '"GameStart"' || clientStatus==='"InProgress"'){
    //   matchHistoryWindow.webContents.send('query-enemy-summoner')
    // }
  })
// 移动游戏历史窗口
  ipcMain.on('move-match-history-window', (event, pos) => {
    matchHistoryWindow.setBounds({ x: pos.x, y: pos.y, width: 1024, height: 576 })
  })
// 最小化游戏历史窗口
  ipcMain.on('match-history-window-min', () => {
    matchHistoryWindow.minimize()
  })
// 关闭游戏历史窗口
  ipcMain.on('close-match-history-window', () => {
    closeWin('MatchHistory')
  })
}

const queryMatchIpc = async () => {
  let queryMatchWindow
  // 展示查询战绩窗口
  ipcMain.on('show-query-match',async () => {
    queryMatchWindow = await createQueryMatchWindow(userHeader)
    for (const argument of BrowserWindow.getAllWindows()) {
      console.log(argument.title)
    }
    mainWindow.hide()

  })
// 移动游戏历史窗口
  ipcMain.on('move-query-match-window', (event, pos) => {
    queryMatchWindow.setBounds({ x: pos.x, y: pos.y, width: 1024, height: 650 })
  })
// 最小化游戏历史窗口
  ipcMain.on('query-match-min', () => {
    queryMatchWindow.minimi1ze()
  })
// 关闭游戏历史窗口
  ipcMain.on('query-match-close', () => {
    closeWin('QueryMatch')
  })
}

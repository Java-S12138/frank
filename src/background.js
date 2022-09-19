import {app, BrowserWindow, Notification} from 'electron'
import {
  autoAcceptGame,
  champSelectSession,
  listenChampSelect,
} from './utils/main/lcu'
import {createWebSocketConnection} from './utils/league-connect'
import {appConfig, userAgentList} from './utils/main/config'
import {deleteWegame, getAuthFromCmd, startClientExe} from './utils/main/clientStart'
import {returnRankData} from "@/utils/render/renderLcu";
import {
  createAssistWindow,
  createMainWindow,
  listenIpc,
  makeTray,
  matchHistoryIpc,
  queryMatchIpc,
  creatMatchAfterStartGame
} from "../frankElectron";

const Store = require("electron-store");Store.initRenderer()
const path = require('path')

const iconPath = path.join(
  process.env.npm_lifecycle_event === "electron:serve" ? `${__dirname}/../resources` : `${__dirname}/../resources`,
  'app-icon.png',
)
const userHeader =userAgentList[Math.floor((Math.random()*userAgentList.length))]
let credentials;let mainWindow;let assistWindow

// -----------------------------main---------------------------- //

const init = async () => {
  mainWindow = await createMainWindow(userHeader) // 渲染主窗口
  assistWindow = await createAssistWindow(userHeader) // 渲染助手窗口
  makeTray(iconPath,mainWindow,assistWindow) //  渲染系统托盘
  await startClient() // 启动英雄联盟客户端
  listenIpc(mainWindow,assistWindow) // 监听主窗口和助手窗口的事件
  queryMatchIpc(mainWindow,userHeader) // 战绩查询窗口
  matchHistoryIpc(userHeader)  // 战绩历史窗口

}

app.whenReady().then(async () => {
  await init()
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow()
    }
  })
})

const runLcu = async () => {
  deleteWegame(appConfig.get('isAutoDeleteWGProcess'))

  const ws = await createWebSocketConnection(credentials)
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
      queryEnemyInfo()
      assistWindow.hide()
      assistWindow.webContents.send('query-enemy-summoner')
      clearInterval(idSetInterval)
      ws.unsubscribe('/lol-champ-select/v1/session')
    }else if (data==='InProgress'){
      await creatMatchAfterStartGame(userHeader) // 游戏对局开始后, 打开查询历史战绩窗口
    }else if(data ==='PreEndOfGame'){ // PreEndOfGame
      if (appConfig.get('isSwitchBlacklist')){assistWindow.show()}
      assistWindow.webContents.send('show-other-summoner')
      closeWin('MatchHistory')
    }
    // 自动接受对局
    if (data =='ReadyCheck'){
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

const closeWin = (window) => {
  for (const currentWindow of BrowserWindow.getAllWindows()) {
    if (currentWindow.title === window){
      currentWindow.close()
    }
  }
}
const queryEnemyInfo  = () => {
  for (const currentWindow of BrowserWindow.getAllWindows()) {
    if (currentWindow.title === 'MatchHistory'){
      currentWindow.webContents.send('query-enemy-summoner')
    }
  }
}

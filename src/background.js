import {app, BrowserWindow, ipcMain,screen,
  Tray, nativeImage, Menu,Notification} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {
  autoAcceptGame,
  champSelectSession,
  listenChampSelect,
  applyRunePage,
  setAutoRuneFromChamp,
} from './utils/main/lcu'
import {createWebSocketConnection} from './utils/league-connect'
import {appConfig,userAgentList} from './utils/main/config'
import {getAuthFromCmd, startClientExe} from './utils/main/clientStart'
import {returnRankData} from "@/utils/render/renderLcu";

const Store = require("electron-store")
Store.initRenderer()
const path = require('path')
const iconPath = path.join(
  process.env.npm_lifecycle_event === "electron:serve" ? `${__dirname}/../resources` : `${__dirname}/../resources`,
  'app-icon.png',
)
const userHeader =userAgentList[Math.floor((Math.random()*userAgentList.length))]

let mainWindow
let assistWindow
let credentials
let clientStatus



const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: 'Frank',
    center: true,
    show: false,
    frame: false,
    resizable: false,
    width: 400,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // devTools:false
    }
  })
  win.on('ready-to-show', () => {
    win.show()
    listenIpc()

  });
  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await win.loadURL('http://localhost:8080', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html', {userAgent: userHeader})
  }
  return win
}

const createAssistWindow = async () => {
  const currentScreen = screen.getAllDisplays()[0]['size']
  const assistWin = new BrowserWindow({
    title: 'Frank',
    show: false,
    frame: false,
    resizable: false,
    width: 320,
    height: 720,
    x:currentScreen.width -320,
    y:(currentScreen.height -770)/2,
    center: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // devTools:false
    }
  })
  assistWin.on('ready-to-show', () => {

  });
  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await assistWin.loadURL('http://localhost:8080/#/assist', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await assistWin.loadURL('app://./index.html/#/assist', {userAgent: userHeader})
  }
  return assistWin
}

app.whenReady().then(async () => {
  mainWindow = await createMainWindow()
  assistWindow = await createAssistWindow()
  makeTray()
  startClient()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function listenIpc() {
  // 展示战力分析窗口
  ipcMain.on('showCharts', async (event) => {
    if ( clientStatus == 'ChampSelect' ){
      event.reply('error-unchat','chat')

      if (process.env.npm_lifecycle_event === "electron:serve") {
        mainWindow.loadURL('http://localhost:8080/#/matchHistory')
      } else {
        mainWindow.loadURL('app://./index.html/#/matchHistory')
      }

      mainWindow.setContentSize(1024,576)
      let interval = setInterval(() => {
        if (!mainWindow.webContents.isLoading()){
          mainWindow.center()
          mainWindow.show()
          clearInterval(interval)
        }
      },800)
    }else {
      event.reply('error-unchat','unchat')
    }
  })

  // 返回主窗口
  ipcMain.on('to-mainWindow',() => {
    mainWindow.setContentSize(400,650)
    mainWindow.center()
    mainWindow.webContents.goBack()
  })
  // 移动窗口  主窗口
  ipcMain.on('move-main', (event, pos) => {
    if (pos.isWindow=='home'){
      mainWindow.setBounds({ x: pos.x, y: pos.y, width: 400, height: 650 })
    }else {
      mainWindow.setBounds({ x: pos.x, y: pos.y, width: 1024, height: 576 })
    }
  })
  // 移动助手窗口
  ipcMain.on('move-assistWindow', (event, pos) => {
    assistWindow.setBounds({ x: pos.x, y: pos.y, width: 320, height: 720 })
  })
  // 最小化窗口(最小到托盘)
  ipcMain.on('mainwin-minimize', () => {
    mainWindow.hide()
  })
  // 最小化窗口
  ipcMain.on('mainwin-min', () => {
    mainWindow.minimize()
  })
  // 关闭窗口
  ipcMain.on('mainwin-close', () => {
    appConfig.set('credentials.port','')
    app.quit()
  })

  // 显示助手窗口
  ipcMain.on('show-assistWindow',async (event,champId) => {
    if (appConfig.has(`autoRune.${champId}` )){
      applyRunePage(credentials,appConfig.get(`autoRune.${champId}`))
    }
  })
  // 应用符文页
  ipcMain.on('apply-rune-page',async (event,ans) => {
    applyRunePage(credentials,ans)
  })
  // 设置自动符文
  ipcMain.on('set-auto-rune', async (event,champId) => {
    setAutoRuneFromChamp(credentials,champId)
  })
}

function makeTray() {
  const icon = nativeImage.createFromPath(iconPath).resize({width: 24, height: 24})
  const tray = new Tray(icon)

  tray.setToolTip('Frank')
  tray.on(`click`, () => {
    showMainWindow()
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `显示主页`,
      click() {
        showMainWindow()
      },
    },
    {
      label: `显示助手`,
      click() {
        showAssistWindow()
      },
    },
    {
      label: `退出软件`,
      click() {
        appConfig.set('credentials.port','')
        app.quit()
      },
    },

  ]);
  tray.setContextMenu(contextMenu)
}

function showMainWindow() {
  if (!mainWindow) {
    return;
  }

  const visible = mainWindow.isVisible()
  if (!visible) {
    mainWindow.show()
    mainWindow.setSkipTaskbar(false)
  } else {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
  }
}

function showAssistWindow() {
  if (!assistWindow) {
    return;
  }

  const visible = assistWindow.isVisible()
  if (!visible) {
    assistWindow.show()
    assistWindow.setSkipTaskbar(true)
  } else {
    assistWindow.hide()
    assistWindow.setSkipTaskbar(true)
  }
}

const runLcu = async () => {
  const ws = await createWebSocketConnection(credentials)
  let idSetInterval

  const homeData = await returnRankData(credentials)
  mainWindow.webContents.send('init-home',homeData)
  mainWindow.webContents.send('client-connect-success')

  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data) => {
    clientStatus = data
    console.log(data)
    if (data =='ChampSelect'){
      // 显示助手窗口
      assistWindow.show()
      assistWindow.setSkipTaskbar(true)
      // 秒选&秒禁英雄
      idSetInterval = setInterval(async function () {
        champSelectSession(credentials)
      },1000)
      // 监听英雄的选择
      listenChampSelect(ws,assistWindow,credentials)
      // 显示战力窗口

    }else if (data =='None' ||data =='GameStart' ||data =='Matchmaking') {
      backHome()
      assistWindow.hide()
      clearInterval(idSetInterval)
      ws.unsubscribe('/lol-champ-select/v1/session')
      assistWindow.webContents.send('refresh-assisit-window')
    }
    if (data =='ReadyCheck' && appConfig.get('autoAccept')>=50){
      autoAcceptGame(credentials)
    }
  })
}

const startClient = async () => {
  if ( appConfig.get('gameDirectory') == ''){
    new Notification({
      title:"请在设置中获取LOL启动文件",
      body:"启动文件路径例如: C:\\LOL\\英雄联盟\\TCLS\\Client.exe",
      icon:iconPath,
    }).show()
    credentials = await getAuthFromCmd()
    appConfig.set('credentials',credentials)
    return
  }

  const clientExe = appConfig.get('gameDirectory')
  if (clientExe.indexOf('LeagueClient')!=-1){
    new Notification({
      title:"请在设置中, 恢复默认设置",
      body:" 重新获取LOL启动文件, 启动文件路径例如: C:\\LOL\\英雄联盟\\TCLS\\Client.exe",
      icon:iconPath,
    }).show()
  }
  getAuthFromCmd().then(async (res) => {
    if (res.port == ''){
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
              },3000)
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

// 返回主页
const backHome = () => {
  mainWindow.setContentSize(400,650)
  mainWindow.center()
  mainWindow.webContents.goBack()
  if (mainWindow.webContents.canGoBack()){
    mainWindow.webContents.goBack()
  }
  mainWindow.hide()
}

import {BrowserWindow, ipcMain} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

export const createMatchHistoryWindow = async (userHeader) => {
  const matchHistoryWindow = new BrowserWindow({
    title: 'FrankMatchHistory',
    show: false,
    frame: false,
    resizable: false,
    width: 1024,
    height: 576,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // devTools:false
    }
  })
  matchHistoryWindow.on('ready-to-show', () => {
    matchHistoryWindow.show()
  })

  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await matchHistoryWindow.loadURL('http://localhost:8080/#/matchHistory', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await matchHistoryWindow.loadURL('app://./index.html/#/matchHistory', {userAgent: userHeader})
  }
  return matchHistoryWindow
}

export const matchHistoryIpc = (userHeader) => {
  // 展示战力分析窗口
  ipcMain.on('showCharts',async (event,clientStatus) => {
    const matchHistoryWindow = await createMatchHistoryWindow(userHeader)
    if (clientStatus==='"InProgress"'){
      matchHistoryWindow.webContents.send('query-enemy-summoner')
    }
  })
// 移动游戏历史窗口
  ipcMain.on('move-match-history-window', (event, pos) => {
    for (const currentWindow of BrowserWindow.getAllWindows()) {
      if (currentWindow.title === 'MatchHistory'){
        currentWindow.setBounds({ x: pos.x, y: pos.y, width: 1024, height: 576 })
      }
    }
  })
// 最小化游戏历史窗口
  ipcMain.on('match-history-window-min', () => {
    for (const currentWindow of BrowserWindow.getAllWindows()) {
      if (currentWindow.title === 'MatchHistory'){
        currentWindow.minimize()
      }
    }
  })
// 关闭游戏历史窗口
  ipcMain.on('close-match-history-window', () => {
    for (const currentWindow of BrowserWindow.getAllWindows()) {
      if (currentWindow.title === 'MatchHistory'){
        currentWindow.close()
      }
    }
  })
}

export const creatMatchAfterStartGame = async (userHeader) => {
  for (const currentWindow of BrowserWindow.getAllWindows()) {
    if (currentWindow.title === 'MatchHistory'){
     return
    }
  }
  const matchWin = await createMatchHistoryWindow(userHeader)
  matchWin.webContents.send('query-enemy-summoner')
}

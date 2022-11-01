import {BrowserWindow, ipcMain} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

const createQueryMatchWindow = async (userHeader) => {
  const queryMatchWindow = new BrowserWindow({
    title: 'FrankQueryMatch',
    show: false,
    frame: false,
    resizable: false,
    width: 1166,
    height: 650,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    }
  })
  queryMatchWindow.on('ready-to-show', () => {
    queryMatchWindow.show()
  })

  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await queryMatchWindow.loadURL('http://localhost:8080/#/queryMatch', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await queryMatchWindow.loadURL('app://./index.html/#/queryMatch', {userAgent: userHeader})
  }
  return queryMatchWindow
}

export const queryMatchIpc = async (mainWindow,userHeader) => {
  let queryMatchWindow
  // 展示查询战绩窗口
  ipcMain.on('show-query-match',async () => {
    mainWindow.hide()
    queryMatchWindow = await createQueryMatchWindow(userHeader)
  })
// 移动游戏历史窗口
  ipcMain.on('move-query-match-window', (event, pos) => {
    queryMatchWindow.setBounds({ x: pos.x, y: pos.y, width: 1166, height: 650 })
  })
// 最小化游戏历史窗口
  ipcMain.on('query-match-min', () => {
    queryMatchWindow.minimize()
  })
// 关闭游戏历史窗口
  ipcMain.on('query-match-close', () => {
    closeWin(false)
  })
// 关闭查询游戏窗口, 回到主页
  ipcMain.on('query-match-back-home',() => {
    closeWin(true)
  })
}

const closeWin = (showMain) => {
  let queryMatchWin
  let mainWin
  for (const currentWindow of BrowserWindow.getAllWindows()) {
    if (currentWindow.title === 'QueryMatch'){
     queryMatchWin = currentWindow
    }else if (currentWindow.title === 'Frank'){
      mainWin = currentWindow
    }
  }
  if (showMain){
    mainWin.show()
    queryMatchWin.hide()
    queryMatchWin.close()
  }else {
    queryMatchWin.close()
  }
}

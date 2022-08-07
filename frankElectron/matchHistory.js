import {BrowserWindow} from "electron";
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

import {BrowserWindow} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
import {userAgentList} from "@/utils/main/config";



export const createMainWindow = async (userHeader) => {
  const win = new BrowserWindow({
    title: 'FrankHome',
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
  })
  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await win.loadURL('http://localhost:8080', {userAgent: userHeader})
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html', {userAgent: userHeader})
  }
  return win
}



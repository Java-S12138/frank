import {BrowserWindow, screen} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
import {appConfig} from "@/utils/main/config";


export const createAssistWindow = async (userHeader) => {
  const currentScreen = screen.getPrimaryDisplay()['size']
  const assistWindowPosition = appConfig.get('assistWindowPosition')
  if (assistWindowPosition.x ===0 && assistWindowPosition.y ===0){
    assistWindowPosition.x = currentScreen.width -320
    assistWindowPosition.y = (currentScreen.height -770)/2
    appConfig.set('assistWindowPosition',{x:currentScreen.width -320,y:(currentScreen.height -770)/2})
  }
  const assistWin = new BrowserWindow({
    title: 'FrankAssist',
    show: false,
    frame: false,
    resizable: false,
    width: 320,
    height: 720,
    x:assistWindowPosition.x,
    y:assistWindowPosition.y,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // devTools:false
    }
  })

  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await assistWin.loadURL('http://localhost:8080/#/assist', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await assistWin.loadURL('app://./index.html/#/assist', {userAgent: userHeader})
  }
  return assistWin
}

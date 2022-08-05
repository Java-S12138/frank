import {BrowserWindow} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

export const createQueryMatchWindow = async (userHeader) => {
  const queryMatchWindow = new BrowserWindow({
    title: 'Frank',
    show: false,
    frame: false,
    resizable: true,
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

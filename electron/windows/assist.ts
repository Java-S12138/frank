import {app, BrowserWindow, ipcMain, screen} from 'electron'
import path from 'path'


const winConfig = {
  title: 'Frank',
  show: true,
  frame: false,
  resizable: false,
  width: 320,
  height: 720,
  x:0,
  y:0,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    webSecurity: false,
    preload: path.join(__dirname, '../preload/index.js'),
    // devTools:false
  }
}

export class AssistWindow {
  public win:BrowserWindow

  constructor(currentScreen:Electron.Size) {
    winConfig.x = currentScreen.width -320
    winConfig.y = (currentScreen.height -770)/2
    this.win = new BrowserWindow(winConfig)
    this.inin()
  }

  inin(){
    if (app.isPackaged) {
      this.win.loadFile(path.join(__dirname, '../../index.html/#/assist'))
    } else {
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/assist`
      this.win.loadURL(url)
    }
    this.listenIpc()
  }

  listenIpc(){
    ipcMain.on('move-assistWindow', (event, pos) => {
      this.win.setBounds({ x: pos.x, y: pos.y, width: 320, height: 720 })
    })
    // todo
    // 显示助手窗口
    // ipcMain.on('show-assistWindow',async (event,champId) => {
    //   if (appConfig.has(`autoRune.${champId}` )){
    //     applyRunePage(credentials,appConfig.get(`autoRune.${champId}`))
    //   }
    // })
    // 应用符文页
    // ipcMain.on('apply-rune-page',async (event,ans) => {
    //   applyRunePage(credentials,ans)
    // })
    // // 设置自动符文
    // ipcMain.on('set-auto-rune', async (event,champId) => {
    //   setAutoRuneFromChamp(credentials,champId)
    // })
  }

  showWindow(){
    if (!this.win) {
      return
    }

    const visible = this.win.isVisible()
    if (!visible) {
      this.win.show()
      this.win.setSkipTaskbar(true)
    } else {
      this.win.hide()
      this.win.setSkipTaskbar(true)
    }
  }
}
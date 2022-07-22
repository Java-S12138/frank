import {app, BrowserWindow, ipcMain} from 'electron'
import {appConfig} from "../../utils/main/config";
import path from 'path'

const winConfig = {
  title: 'Frank',
  center: true,
  show: false,
  frame: false,
  resizable: true,
  width: 400,
  height: 650,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    webSecurity: false,
    preload: path.join(__dirname, '../preload/index.js'),
    // devTools:false
  }
}

export class MainWindow {
  public win:BrowserWindow

  constructor() {
    this.win = new BrowserWindow(winConfig)
    this.init()
  }

  init() {
    this.win.on('ready-to-show', () => {
      // this.win.show()
      this.listenIpc()
    })
    if (app.isPackaged) {
      this.win.loadFile(path.join(__dirname, '../../index.html'))
    } else {
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
      this.win.loadURL(url)
    }
  }

  listenIpc() {
    // 最小化窗口(最小到托盘)
    ipcMain.on('mainwin-minimize', () => {
      this.win.hide()
    })
    // 最小化窗口
    ipcMain.on('mainwin-min', () => {
      this.win.minimize()
    })
    // 关闭窗口
    ipcMain.on('mainwin-close', () => {
      appConfig.set('credentials.port',0)
      app.quit()
    })
    // 移动窗口  主窗口
    ipcMain.on('move-main', (event, pos) => {
      if (pos.isWindow=='home'){
        this.win.setBounds({ x: pos.x, y: pos.y, width: 400, height: 650 })
      }else {
        this.win.setBounds({ x: pos.x, y: pos.y, width: 1024, height: 576 })
      }
    })
  }

  showWindow() {
    if (!this.win) {
      return
    }
    const visible = this.win.isVisible()
    if (!visible) {
      this.win.show()
      this.win.setSkipTaskbar(false)
    } else {
      this.win.hide()
      this.win.setSkipTaskbar(true)
    }
  }
}

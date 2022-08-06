import {app, ipcMain} from "electron";
import {appConfig} from "@/utils/main/config";


export const listenIpc = (mainWindow,assistWindow) => {
  // 移动窗口  主窗口
  ipcMain.on('move-main', (event, pos) => {
    mainWindow.setBounds({ x: pos.x, y: pos.y, width: 400, height: 650 })
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
    const assistWindowBounds = assistWindow.getBounds()
    appConfig.set('assistWindowPosition',{x:assistWindowBounds.x,y:assistWindowBounds.y})
    appConfig.set('credentials.port','')
    app.quit()
  })
  // 移动助手窗口
  ipcMain.on('move-assistWindow', (event, pos) => {
    assistWindow.setBounds({ x: pos.x, y: pos.y, width: 320, height: 720 })
  })
  // 刷新助手页面
  ipcMain.on('setting-page-refresh-assist',() => {
    assistWindow.webContents.send('client-connect-success')
  })
}

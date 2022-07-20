export interface mainWindowInterface {
  win:Electron.BrowserWindow
  init:() => void
  listenIpc:() => void
  showWindow:() => void
}
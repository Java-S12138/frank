import {MainWindow} from '../windows/home';
import {AssistWindow} from "../windows/assist";
import {RunLcu} from "../../utils/lcu/runLcu"
import {app, BrowserWindow, Menu, nativeImage, screen, Tray} from 'electron';
import Store from 'electron-store';
import {appConfig} from "../../utils/main/config";
import {createWebSocketConnection} from "league-connect"
import {credentials} from "../../utils/types/lcu";
import {champSelectSession} from "../../utils/lcu/pickBanLcu";

Store.initRenderer()
const iconPath = process.env.npm_lifecycle_event === 'dev' ? `${__dirname}../../../../resources/app-icon.png` : `${__dirname}../../../../../resources/app-icon.png`

let mainWindow:MainWindow
let assistWindow:AssistWindow
let runLcu:RunLcu
// const credentials:credentials = appConfig.get('credentials')


app.whenReady().then(() => {
  const currentScreen:Electron.Size = screen.getPrimaryDisplay()['size']
  // mainWindow = new MainWindow()
  // assistWindow = new AssistWindow(currentScreen)
  // runLcu = new RunLcu(mainWindow.win,assistWindow.win,credentials)
  // makeTray()
  runLcuTest()


  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) new MainWindow();
  // })
})


const runLcuTest = async () => {
  const credentials:any = appConfig.get('credentials')
  // const credentials:any = await authenticate()
  console.log(credentials)

  const ws = await createWebSocketConnection(credentials)
  console.log(ws)
  let idSetInterval:NodeJS.Timer

  // ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data:any) => {
  //   console.log(data)
  //   if (data =='ChampSelect'){
  //     // 显示助手窗口
  //     assistWindow.win.show()
  //     assistWindow.win.setSkipTaskbar(true)
  //     // 秒选&秒禁英雄
  //     idSetInterval = setInterval(async () =>  {
  //       champSelectSession(credentials,idSetInterval)
  //     },1000)
  //     // 监听英雄的选择
  //   }
  // })
}
// 生成系统托盘
const makeTray = () => {
  const icon = nativeImage.createFromPath(iconPath).resize({width: 24, height: 24})
  const tray = new Tray(icon)
  tray.setToolTip('Frank')
  tray.on(`click`, () => {
    mainWindow.showWindow()
  })
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `显示主页`,
      click() {
        mainWindow.showWindow()
      },
    },
    {
      label: `退出软件`,
      click() {
        appConfig.set('credentials.port',0)
        app.quit()
      },
    },

  ]);
  tray.setContextMenu(contextMenu)
}
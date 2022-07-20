import {MainWindow} from '../windows/home';
import {mainWindowInterface} from "../types/electronInterface";
import {app, BrowserWindow, Menu, nativeImage, Tray} from 'electron';
import Store from 'electron-store';Store.initRenderer()
import {appConfig} from "../../utils/main/config";

const iconPath = process.env.npm_lifecycle_event === 'dev' ? `${__dirname}../../../../resources/app-icon.png` : `${__dirname}../../../../../resources/app-icon.png`

let mainWindow:mainWindowInterface


app.whenReady().then(() => {
  mainWindow = new MainWindow()
  makeTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) new MainWindow();
  })
})

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
        appConfig.set('credentials.port','')
        app.quit()
      },
    },

  ]);
  tray.setContextMenu(contextMenu)
}
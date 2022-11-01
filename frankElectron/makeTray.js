import {app, Menu, nativeImage, Tray} from "electron";
import {appConfig} from "@/utils/main/config";

export const makeTray = (iconPath,mainWindow,assistWindow) => {
  const icon = nativeImage.createFromPath(iconPath).resize({width: 24, height: 24})
  const tray = new Tray(icon)

  tray.setToolTip('Frank')
  tray.on(`click`, () => {
    showWindow(mainWindow)
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `显示主页`,
      click() {
        showWindow(mainWindow)
      },
    },
    {
      label: `显示助手`,
      click() {
        showWindow(assistWindow)
        if (assistWindow.isVisible()){
          assistWindow.setSkipTaskbar(true)
        }
      },
    },
    {
      label: `退出软件`,
      click() {
        const assistWindowBounds = assistWindow.getBounds()
        appConfig.set('assistWindowPosition',{x:assistWindowBounds.x,y:assistWindowBounds.y})
        appConfig.set('credentials.port','')
        app.quit()
      },
    },
  ]);
  tray.setContextMenu(contextMenu)
}

const showWindow = (Window) => {
  if (!Window) {
    return
  }

  const visible = Window.isVisible()
  if (!visible) {
    Window.show()
    Window.setSkipTaskbar(false)
  } else {
    Window.hide()
    Window.setSkipTaskbar(true)
  }
}

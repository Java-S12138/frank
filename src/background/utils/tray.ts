import {TrayIcon} from '@tauri-apps/api/tray';
import {defaultWindowIcon} from '@tauri-apps/api/app';
import {Menu} from '@tauri-apps/api/menu';
import {exit} from "@tauri-apps/plugin-process";
import {window} from "@tauri-apps/api";
import {QueryMatchWindow, RecentMatchWindow} from "./creatWindow.ts";

const menu = await Menu.new({
  items: [
    {
      id: 'showMain',
      text: '显示助手',
      action: () => {
        window.Window.getByLabel('mainWindow').then(async (win) => {
          if (win === null) {
            return
          }
          if (await win.isVisible()) {
            win.hide();
          } else {
            win.show();
          }
        })
      },
    },
    {
      id: 'matchDetail',
      text: '对局详情',
      action: () => {
        window.Window.getByLabel('recentMatchWindow').then(async (win) => {
          if (win === null) {
            new RecentMatchWindow();
          }else{
            if (await win.isVisible()) {
              win.hide();
            }else {
              win.show();
            }
          }
        })
      },
    },
    {
      id: 'queryMatch',
      text: '我的战绩',
      action: () => {
        window.Window.getByLabel('queryMatchWindow').then((win) => {
          if (win === null) {
            new QueryMatchWindow()
          }
        })
      },
    },
    {
      id: 'quit',
      text: '退出软件',
      action: () => {
        exit(1);
      },
    },
    {
      id: 'author',
      text: '@Java_S',
    },
  ],
});

const options = {
  icon: await defaultWindowIcon(),
  menu,
  menuOnLeftClick: true,
};

// @ts-ignore
const tray = await TrayIcon.new(options);

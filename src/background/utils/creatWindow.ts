import {WebviewWindow} from "@tauri-apps/api/webviewWindow";
import {PhysicalPosition} from "@tauri-apps/api/dpi";

export class MainWindow {
  constructor() {
    const webview = new WebviewWindow('mainWindow', {
      title: 'Frank',
      url: 'src/main/index.html',
      width: 306,
      height: 683,
      visible: false,
      resizable: false,
      decorations: false,
      center: true,
      transparent: true
    })
    webview.once('tauri://created', async function () {
      const curPos = localStorage.getItem('position')
      if (curPos !== null) {
        const parts = curPos.split('+')
        await webview.setPosition(new PhysicalPosition(Number(parts[0]), Number(parts[1])))
      }
      webview.show()
    })
  }
}

export class QueryMatchWindow {
  constructor() {
    const webview = new WebviewWindow('queryMatchWindow', {
      title: '我的战绩',
      url: 'src/queryMatch/index.html',
      width: 1160,
      height: 631,
      resizable: false,
      decorations: false,
      center: true,
      visible: false,
      transparent: true
    })
    webview.once('tauri://created', async function () {
      webview.show()
    })
  }
}

export class MatchAnalysisWindow {
  constructor() {
    const webview = new WebviewWindow('matchAnalysisWindow', {
      title: '战绩分析',
      url: 'src/matchAnalysis/index.html',
      width: 1010,
      height: 539,
      resizable: false,
      decorations: false,
      center: true,
      visible: false,
      transparent: true
    })
    webview.once('tauri://created', async function () {
      webview.show()
    })
  }
}

export class RecentMatchWindow {

  constructor() {
    const webview = new WebviewWindow('recentMatchWindow', {
      title: '对局详情',
      url: 'src/recentMatch/index.html',
      width: 1240,
      height: 525,
      resizable: false,
      decorations: false,
      center: true,
      visible: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      transparent: true
    })
    webview.once('tauri://created', async function () {
      webview.show()

    })
  }
}
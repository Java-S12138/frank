import {WebviewWindow} from "@tauri-apps/api/webviewWindow";

export class MainWindow {
  constructor() {
    const webview = new WebviewWindow('mainWindow', {
      title: 'Frank',
      url: 'src/main/index.html',
      width: 320,
      height: 720,
      visible: false,
      resizable: false,
      decorations: false,
      center: true,
      transparent: true
    })
    webview.once('tauri://created', async function () {
      webview.show()
    })
  }
}

export class QueryMatchWindow {
  constructor() {
    const webview = new WebviewWindow('queryMatchWindow', {
      title: '我的战绩',
      url: 'src/queryMatch/index.html',
      width: 1174,
      height: 668,
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
      width: 1024,
      height: 576,
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
      width: 1254,
      height: 562,
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

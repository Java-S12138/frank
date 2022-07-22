import {returnRankData} from "./homeLcu";
import {credentials} from "../types/lcu";
import {createWebSocketConnection} from "league-connect"
import {champSelectSession} from './pickBanLcu'

export class RunLcu {
  public mainWindow
  public assistWindow
  public credentials

  constructor(mainWindow: Electron.BrowserWindow,
              assisWindow: Electron.BrowserWindow,
              credentials:credentials) {
    this.mainWindow = mainWindow
    this.assistWindow = assisWindow
    this.credentials = credentials
    this.init()
  }

  async init(){
    // const homeData = await returnRankData(this.credentials)
    // this.mainWindow.webContents.send('init-home',homeData)
    // this.mainWindow.webContents.send('client-connect-success')
    this.listenClientStatus()
  }

  async listenClientStatus(){
    console.log(123)
    // @ts-ignore
    const ws = await createWebSocketConnection(this.credentials)
    ws.subscribe('/lol-gameflow/v1/gameflow-phase',async (clientStatus:any) => {
      console.log(clientStatus)
      if (clientStatus === 'ChampSelect'){
        this.clientIsChampSelect()
      }

    })
  }

  clientIsChampSelect():void{
    // 显示助手窗口
    this.assistWindow.show()
    this.assistWindow.setSkipTaskbar(true)
    // 秒选&秒禁英雄
    const idSetInterval = setInterval(async () =>  {
      champSelectSession(this.credentials,idSetInterval)
    },1000)
  }

}
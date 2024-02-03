import './utils/subscribe.ts'
import './utils/config'
import './utils/tray'
import {GameFlow} from "./gameFlow";
import {GameInfo, sumInfoTypes} from "@/background/utils/backgroundTypes";

// cube.windows.openDevTools(cube.windows.current.id())

// 启动主窗口
cube.extensions.on('launch-triggered', (s) => {
    cube.windows.obtainDeclaredWindow('main')
})

let isStart: boolean | null = true
// 检测是否存在LOL
cube.games.launchers.getRunningLaunchers().then((value) => {
  const isLoL = value.find(((i: any) => i.classId === 10902))
  if (isLoL !== undefined) {
    isStart = null
    cube.games.launchers.events.getInfo(isLoL.classId).then((info:GameInfo) => {
      if (info.summoner_info === undefined){
        return
      }
      // 设置召唤师信息
      const sumInfo:sumInfoTypes = {
        name:info.summoner_info.display_name,
        summonerId:info.summoner_info.summoner_id,
        platformId:info.summoner_info.platform_id
      }
      localStorage.setItem('sumInfo',JSON.stringify(sumInfo))
    })
  }
})


let isCSSestion = true
const gameFlow = new GameFlow()
gameFlow.initGameInWindow()

cube.games.launchers.events.on('update-info', async (classId, info) => {
  if (info.category === 'game_flow') {
    console.log(info.value)
    switch (info.value) {
      case 'ChampSelect':
        if (isStart) {
          isStart = null
        }
        gameFlow.sendMesToMain('ChampSelect')
        gameFlow.autoPickBanChamp()
        return
      case 'GameStart':
        gameFlow.showHideMainWin(false, 'GameStart')
        return
      case 'EndOfGame':
        // gameFlow.isShowBlack()
        gameFlow.showHideMainWin(true, 'EndOfGame')
        return
      case 'ReadyCheck':
        gameFlow.autoAcceptGame()
        return
      case 'Lobby':
        return gameFlow.sendMesToMain('Lobby', '')
      case 'None':
        if (isStart) {
          gameFlow.sendStartEvent()
          isStart = null
        } else {
          gameFlow.sendMesToMain('None', '')
        }
        return
    }
/*  Matchmaking
    ReadyCheck
    ChampSelect
    GameStart
    InProgress
    WaitingForStats
    PreEndOfGame
    EndOfGame
    Lobby*/
  }

  if (info.category === 'json_api_event' && info.key === 'raw_data') {
    const obj: { data: any; eventType: string; uri: string } = JSON.parse(info.value)
    switch (obj.uri) {
      case '/lol-champ-select/v1/current-champion':
        gameFlow.sendMesToMain('Champion', obj.data)
        return
      case '/lol-champ-select/v1/session':
        if (isCSSestion && obj.data.actions.length !== 0) {
          isCSSestion = false
          gameFlow.sendMesToMain('CSSession', obj.data)
        } else if (obj.data.actions.length === 0) {
          isCSSestion = true
        }
        return
    }
  }
})


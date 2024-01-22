import './utils/subscribe.ts'
import './utils/config'
import './utils/tray'
import {GameFlow} from "./gameFlow";

// cube.windows.openDevTools(cube.windows.current.id())

cube.extensions.on('launch-triggered', (s) => {
  if (!s.gamein){
    cube.windows.obtainDeclaredWindow('main')
  }
})

let isCSSestion = true
const gameFlow = new GameFlow()
// gameFlow.initGameInWindow()

cube.games.launchers.events.on('update-info', async (classId, info) => {

  if (info.category === 'game_flow') {
    switch (info.value) {
      case 'ChampSelect':
        gameFlow.sendMesToMain('ChampSelect', '')
        gameFlow.autoPickBanChamp()
        return
      case 'GameStart':
        // gameFlow.showOrHideAssist(false, 'GameStart', null)
        return
      case 'PreEndOfGame':
        // gameFlow.isShowBlack()
        return
      case 'ReadyCheck':
        gameFlow.autoAcceptGame()
        return
      case 'None':
        gameFlow.sendMesToMain('None', '')
        return
    }
  }

  if (info.category === 'json_api_event' && info.key === 'raw_data') {
    const obj: { data: any; eventType: string; uri: string } = JSON.parse(info.value)
    switch (obj.uri) {
      case '/lol-champ-select/v1/current-champion':
        gameFlow.sendMesToMain('Champion',obj.data)
        return
      case '/lol-champ-select/v1/session':
        if (isCSSestion && obj.data.actions.length !== 0){
          isCSSestion = false
          gameFlow.sendMesToMain('CSSession',obj.data)
        }
        else if (obj.data.actions.length === 0) {
          isCSSestion = true
        }
        return
    }
  }
})


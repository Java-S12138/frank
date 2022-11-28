import '../main/utils/config'
import '../main/utils/tray.ts'
import { GameFlow } from '../main/utils/gameFlow'

cube.extensions.on('launch-triggered', async (s) => {
  if (!s.gamein){
    const currentScreen = (await cube.utils.getPrimaryDisplay()).size
    cube.windows.obtainDeclaredWindow('main')
    cube.windows.obtainDeclaredWindow('assist',{x:currentScreen.width -320,y:(currentScreen.height -770)/2})
  }
})

const gameFlow = new GameFlow()
gameFlow.initGameInWindow()

cube.games.launchers.events.on('update-info', async (classId, info) => {
  if (info.category === 'game_flow') {
    if (info.value === 'ChampSelect') {
      // 显示助手窗口
      gameFlow.showOrHideAssist(true, 'query-other-summoner')
      gameFlow.autoPickBanChamp()
    } else if (info.value === 'GameStart') {
      // 选择英雄结束后,发送消息给渲染进程, 让渲染进程获取到敌方召唤师信息
      gameFlow.showOrHideAssist(false,'query-enemy-summoner')
    } else if (info.value === 'PreEndOfGame') {
      // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
      gameFlow.isShowBlack()
    } else if (info.value === 'ReadyCheck') {
      // 自动接收对局
      gameFlow.autoAcceptGame()
    }
  }
  if (info.category === 'json_api_event' && info.key === 'raw_data') {
    const obj: { data: any; eventType: string; uri: string } = JSON.parse(
      info.value
    )
    if (obj.uri === '/lol-champ-select/v1/current-champion') {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.message.send(assistWin.id, 'champion', info)
    }
  }
})

let update = false
cube.extensions.on('updated', () => {
  update = true
  cube.games.launchers.getRunningLaunchers().then(async (v) => {
    const lol = v.find((t) => t.classId == 10902)
    if (lol == undefined) {
      cube.extensions.relaunch()
    } else {
      const info = await cube.games.launchers.events.getInfo(10902)
      if (info.game_flow && info.game_flow.phase == 'None') {
        cube.extensions.relaunch()
      }
    }
  })
})
cube.games.on('stopped', (classId) => {
  if (classId === 5426 && update) {
    cube.extensions.relaunch()
  }
})
cube.games.launchers.on('stopped', (classId) => {
  if (classId === 10902 && update) {
    cube.extensions.relaunch()
  }
})


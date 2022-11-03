import "../main/utils/tray.ts"
import {GameFlow} from "../main/utils/gameFlow";

cube.extensions.on('launch-triggered', (s) => {
  cube.windows.obtainDeclaredWindow('main')
  cube.windows.obtainDeclaredWindow('assist')
})

const gameFlow = new GameFlow()

cube.games.launchers.events.on('update-info', async (classId, info) => {
  if (info.category === 'game_flow') {
    if (info.value === 'ChampSelect') {
      // 显示助手窗口
      gameFlow.showOrHideAssist(true,'query-other-summoner')
      gameFlow.autoPickBanChamp()
    } else if (info.value === 'GameStart') {
      // 选择英雄结束后,发送消息给渲染进程, 让渲染进程获取到敌方召唤师信息
      gameFlow.queryEnemyInfo()
    } else if (info.value === 'PreEndOfGame') {
      // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
      gameFlow.isShowBlack()
    } else if (info.value === 'ReadyCheck') {
      // 自动结束对局
      gameFlow.autoAcceptGame()
    }
  }
  if (info.category === 'json_api_event' && info.key === 'raw_data') {
    const obj: { data: any, eventType: string, uri: string } = JSON.parse(
      info.value
    )
    if (obj.uri === '/lol-champ-select/v1/current-champion') {
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.message.send(assistWin.id, 'champion', info)
    }
  }
})

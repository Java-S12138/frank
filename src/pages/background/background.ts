import "../main/utils/tray.ts"
import {autoAcceptGame} from "../main/lcu/runeLcu"

cube.extensions.on('launch-triggered', (s) => {
  cube.windows.obtainDeclaredWindow('main')
  cube.windows.obtainDeclaredWindow('assist')
})


cube.games.launchers.events.on('update-info', async (classId, info) => {
  if (info.category === 'game_flow') {
    if (info.value === 'ChampSelect') {
      // 获取其它召唤师信息
      const assistWin = await cube.windows.getWindowByName('assist')
      // 显示助手窗口
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'query-other-summoner','')
    }else if (info.value  ==='GameStart'){
      // 选择英雄结束后,发送消息给渲染进程, 让渲染进程获取到敌方召唤师信息
      const assistWin = await cube.windows.getWindowByName('assist')
      const matchHistoryWin = await  cube.windows.getWindowByName('matchHistory')
      cube.windows.hide(assistWin.id)
      cube.windows.message.send(assistWin.id, 'query-enemy-summoner','')
      cube.windows.message.send(matchHistoryWin.id, 'query-enemy-summoner','')
    }else if (info.value ==='PreEndOfGame'){
      // 游戏结束后,弹出拉黑召唤师的抽屉
      const assistWin = await cube.windows.getWindowByName('assist')
      cube.windows.show(assistWin.id)
      cube.windows.message.send(assistWin.id, 'show-other-summoner','')
    }else if (info.value==='ReadyCheck'){
      autoAcceptGame()
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
});


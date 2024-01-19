// import '../main/utils/subscribe.ts'
import './utils/config'
import './utils/tray'
import {GameFlow} from "./gameFlow";

cube.extensions.on('launch-triggered', (s) => {
  if (!s.gamein){
    cube.windows.obtainDeclaredWindow('main')
  }
})

const gameFlow = new GameFlow()
// gameFlow.initGameInWindow()

cube.games.launchers.events.on('update-info', async (classId, info) => {
  if (info.category === 'game_flow') {
    if (info.value === 'ChampSelect') {
      // 发送信息给主窗口
      gameFlow.sendMesToMain('ChampSelect','')
      // gameFlow.autoPickBanChamp()
    } else if (info.value === 'GameStart') {
      // 选择英雄结束后,发送消息给渲染进程, 让渲染进程获取到敌方召唤师信息
      // gameFlow.showOrHideAssist(false,'GameStart',null)
    } else if (info.value === 'PreEndOfGame') {
      // 游戏结束后,根据用户设置判断是否弹出拉黑召唤师的抽屉
      // gameFlow.isShowBlack()
    } else if (info.value === 'ReadyCheck') {
      // 自动接收对局
      // gameFlow.autoAcceptGame()
    }else if (info.value==='None'){
      // 发送信息给主窗口
      gameFlow.sendMesToMain('None','')
    }
  }
  if (info.category === 'json_api_event' && info.key === 'raw_data') {
    const obj: { data: any; eventType: string; uri: string } = JSON.parse(info.value)
    if (obj.uri === '/lol-champ-select/v1/current-champion') {
      // gameFlow.showOrHideAssist(true,'champion',info)
    }
  }
})


import './utils/tray.ts'
import {GameFlow} from "./gameFlow.ts";
import {invoke} from "@tauri-apps/api/core";
import {listen} from '@tauri-apps/api/event';
import {configInit,getClientPath} from "@/background/utils/config.ts";
import {MainWindow} from "./utils/creatWindow.ts";
import {ChampionSession} from "@/background/types";

new MainWindow();configInit()
const gameFlow = new GameFlow()
let lastProcessedTime = 0

const initFrank = () => {
  const TIME_LIMIT = 30000; // 设置超时时间（例如：30秒）
  let elapsedTime = 0; // 已经过去的时间
  const intervalTime = 3000; // 每次检查的间隔时间（1秒）
  invoke('init_keyboard')

  const lcuSuccess = setInterval(async () => {
    const isGetPath = await getClientPath()
    if(isGetPath) {
      clearInterval(lcuSuccess)
      setTimeout(()=>{
        gameFlow.sendStartEvent();
        invoke("start_listener")
      },500)
    }

    // 增加已用时间
    elapsedTime += intervalTime;

    // 如果超时，清除 interval 并执行其他操作
    if (elapsedTime >= TIME_LIMIT) {
      clearInterval(lcuSuccess);  // 停止检查
      console.log("超时，客户端未启动");
      // 这里可以执行超时后的操作，比如调用一个回调函数
    }
  }, intervalTime);  // 每秒检查一次

}

invoke('listen_for_client_start').then(() =>{
  // listen client status
  listen<string>('client_status', (event) => {
    switch (event.payload) {
      case 'ClientStarted':
        initFrank()
        return
      case 'ChampSelect':
        gameFlow.sendMesToMain('ChampSelect')
        gameFlow.autoPickBanChamp()
        return
      case 'GameStart':
        gameFlow.showHideMainWin(false, 'GameStart')
        gameFlow.initGameInWindow()
        return
      case 'EndOfGame':
        gameFlow.coloseWin('recentMatchWindow')
        gameFlow.showHideMainWin(true, 'EndOfGame')
        return
      case 'Matchmaking':
        gameFlow.sendMesToMain('Matchmaking')
        return
      case 'ReadyCheck':
        gameFlow.autoAcceptGame()
        gameFlow.writeGameInfo()
        return
      case 'Lobby':
        return gameFlow.sendMesToMain('Lobby')
      case 'None':
        gameFlow.sendMesToMain('None')
        return
    }
  })
  // listen champion select
  listen<ChampionSession>('lol-champ-select', (event) => {
    const champSession = event.payload;

    if (champSession.actions.length === 0) {
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastProcessedTime < 200) {
      return;
    }
    lastProcessedTime = currentTime

    const localCellId = champSession.localPlayerCellId;
    const localAction = champSession.actions[0].find(action => action.actorCellId === localCellId);

    if (localAction?.completed) {
      gameFlow.sendMesToMain('Champion', localAction.championId);
    }
  });
})



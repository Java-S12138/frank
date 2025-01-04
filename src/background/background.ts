import './utils/tray.ts'
import {GameFlow} from "./gameFlow.ts";
import {invoke} from "@tauri-apps/api/core";
import {listen} from '@tauri-apps/api/event';
import {configInit, getClientPath} from "@/background/utils/config.ts";
import {MainWindow} from "./utils/creatWindow.ts";
import {Action, ChampionSession} from "@/background/types";
import {invokeLcu} from "@/lcu";

new MainWindow();configInit()
const gameFlow = new GameFlow()
let lastProcessedTime = 0
// 用于记录已访问过的下标
const visitedIndexes = new Set<number>();

const initFrank = () => {
  const TIME_LIMIT = 30000; // 设置超时时间（例如：30秒）
  let elapsedTime = 0; // 已经过去的时间
  const intervalTime = 3000; // 每次检查的间隔时间（1秒）
  invoke('init_keyboard')

  const lcuSuccess = setInterval(async () => {
    const isGetPath = await getClientPath()
    if (isGetPath) {
      clearInterval(lcuSuccess)
      setTimeout(() => {
        gameFlow.sendStartEvent();
        invoke("start_listener")
      }, 500)
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

// 处理获取当前选中的 champion
const handleGetCurrentChampion = async () => {
  const value = await invokeLcu<number>('get', '/lol-champ-select/v1/current-champion');
  if (value) {
    gameFlow.sendMesToMain('Champion', value);
  }
}

// 查找玩家的选中动作
const findLocalAction = (actionList:Action[][],localCellId:number) => {
    if (actionList.length === 0) {
      return null;
    }

    // 遍历 actions，同时跳过已访问的下标
    for (let i = 0; i < actionList.length; i++) {
      if (visitedIndexes.has(i)) {
        continue; // 跳过已访问的下标
      }

      const actionItem = actionList[i];
      if (actionItem[0].type!=='pick') {
        visitedIndexes.add(i); // 标记当前下标为已访问
      }
      for (const action of actionItem) {
        console.log(actionList);
        if (action.actorCellId === localCellId && action.type === 'pick' && action.completed) {
          return action.championId;
        }
      }
    }

    return null; // 未找到匹配的 action
};



invoke('listen_for_client_start').then(() => {
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
  listen<ChampionSession>('lol-champ-select', async (event) => {
    const currentTime = Date.now();

    // 防止频繁处理事件
    if (currentTime - lastProcessedTime < 300) {
      return;
    }
    lastProcessedTime = currentTime;

    const champSession = event.payload;

    // 如果没有 actions 或者我的队伍为空
    if (champSession.actions.length === 0) {
      if (champSession.myTeam.length === 0) return;
      await handleGetCurrentChampion();
      return;
    }

    const localCellId = champSession.localPlayerCellId;
    const championId = findLocalAction(champSession.actions, localCellId);
    // 如果找到了本地玩家的选中动作，处理它
    if (championId!==null) {
      gameFlow.sendMesToMain('Champion', championId);
    }
  });
})



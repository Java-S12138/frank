import './utils/tray.ts'
import {invokeLcu} from "@/lcu";
import {GameFlow} from "./gameFlow.ts";
import {invoke} from "@tauri-apps/api/core";
import {listen} from '@tauri-apps/api/event';
import {MainWindow} from "./utils/creatWindow.ts";
import {TaskTracker} from "./utils/TaskTracker.ts";
import {Action, ChampionSession} from "@/background/types";
import {configInit, getClientPath} from "@/background/utils/config.ts";


class Background {
  private gameFlow: GameFlow;
  private taskTracker: TaskTracker;
  private lastProcessedTime :number;
  private preChampId:number;
  private visitedIndexes: Set<number>;

  constructor() {
    new MainWindow();
    configInit();
    this.gameFlow = new GameFlow();
    this.taskTracker = new TaskTracker();
    this.lastProcessedTime = 0;
    this.preChampId = 0;
    this.visitedIndexes = new Set<number>();
    this.initializeListeners();
  }

  private initializeListeners() {
    invoke('listen_for_client_start').then(() => {
      listen<string>('client_status', (event) => this.handleClientStatus(event.payload));
      listen<ChampionSession>('lol-champ-select', (event) => this.handleChampionSelect(event.payload));
    });
  }

  private initFrank() {
    const TIME_LIMIT = 30000;
    let elapsedTime = 0;
    const intervalTime = 3000;

    invoke('init_keyboard');
    const lcuSuccess = setInterval(async () => {
      const isGetPath = await getClientPath();
      if (isGetPath) {
        clearInterval(lcuSuccess);
        setTimeout(() => {
          this.gameFlow.sendStartEvent();
          invoke("start_listener");
        }, 500);
      }

      elapsedTime += intervalTime;
      if (elapsedTime >= TIME_LIMIT) {
        clearInterval(lcuSuccess);
        console.log("超时，客户端未启动");
      }
    }, intervalTime);
  }

  private async handleGetCurrentChampion() {
    const value = await invokeLcu<number>('get', '/lol-champ-select/v1/current-champion');
    if (value) {
      this.gameFlow.sendMesToMain('Champion', value);
    }
  }

  private findLocalAction(actionList: Action[][], localCellId: number) {
    for (let i = 0; i < actionList.length; i++) {
      if (this.visitedIndexes.has(i)) continue;
      const actionItem = actionList[i];
      if (actionItem[0].type !== 'pick') {
        this.visitedIndexes.add(i);
        continue;
      }

      const localAction = actionList[i].find(action => action.actorCellId === localCellId);
      if (localAction === undefined) {
        this.visitedIndexes.add(i);
        continue;
      }else {
        if (localAction.completed && localAction.type==='pick') {
          return localAction.championId;
        }
      }
    }
    return null;
  }

  private handleClientStatus(status: string) {
    switch (status) {
      case 'ClientStarted':
        this.initFrank();
        break;
      case 'ChampSelect':
        this.visitedIndexes.clear();
        this.preChampId = 0;
        this.gameFlow.sendMesToMain('ChampSelect');
        this.gameFlow.autoPickBanChamp();
        break;
      case 'GameStart':
        this.gameFlow.showHideMainWin(false, 'GameStart');
        this.gameFlow.initGameInWindow();
        break;
      case 'EndOfGame':
        this.gameFlow.coloseWin('recentMatchWindow');
        this.gameFlow.showHideMainWin(true, 'EndOfGame');
        this.taskTracker.completeTask();
        break;
      case 'Matchmaking':
        this.gameFlow.sendMesToMain('Matchmaking');
        break;
      case 'ReadyCheck':
        this.gameFlow.autoAcceptGame();
        this.gameFlow.writeGameInfo();
        break;
      case 'Lobby':
        this.gameFlow.sendMesToMain('Lobby');
        break;
      case 'None':
        this.gameFlow.sendMesToMain('None');
        break;
    }
  }

  private async handleChampionSelect(champSession: ChampionSession) {
    const currentTime = Date.now();
    if (currentTime - this.lastProcessedTime < 300) return;
    this.lastProcessedTime = currentTime;
    // 如果没有 actions 或者我的队伍为空
    if (champSession.actions.length === 0) {
      if (champSession.myTeam.length === 0) return;
      await this.handleGetCurrentChampion();
      return;
    }

    const localCellId = champSession.localPlayerCellId;
    const championId = this.findLocalAction(champSession.actions, localCellId);
    if (championId !== null && championId !== this.preChampId) {
      this.preChampId = championId;
      this.gameFlow.sendMesToMain('Champion', championId);
    }
  }
}

new Background();

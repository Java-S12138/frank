import './utils/tray.ts'
import {invokeLcu} from "@/lcu";
import {GameFlow} from "./gameFlow.ts";
import {invoke} from "@tauri-apps/api/core";
import {listen, UnlistenFn} from '@tauri-apps/api/event';
import {MainWindow} from "./utils/creatWindow.ts";
import {TaskTracker} from "./utils/TaskTracker.ts";
import {ChampionSession} from "@/background/types";
import {configInit, getClientPath} from "@/background/utils/config.ts";

class Background {
  private gameFlow: GameFlow;
  private taskTracker: TaskTracker;
  private lastProcessedTime :number;
  private preChampId:number;
  private unListenSelectSession: UnlistenFn | undefined

  constructor() {
    new MainWindow();
    configInit();
    this.gameFlow = new GameFlow();
    this.taskTracker = new TaskTracker();
    this.lastProcessedTime = 0;
    this.preChampId = 0;
    this.initializeListeners();
  }

  private  initializeListeners() {
    invoke('listen_for_client_start').then(async () => {
      listen<string>('client_status', (event) => this.handleClientStatus(event.payload));
      listen<number>('lol-current-champ-select', (event) => this.handleCurrentChamp(event.payload));
      this.unListenSelectSession = await listen<ChampionSession>('lol-champ-select',
        (event) => this.handleChampionSelect(event.payload));
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

    if (value === null) return;

    if (value !== 0 && value !== this.preChampId) {
      this.gameFlow.sendMesToMain('Champion', value);
      this.preChampId = value;
      if (this.unListenSelectSession !== undefined) {
        this.unListenSelectSession();
        invoke("start_current_champ_select");
      }
    }
  }


  private handleClientStatus(status: string) {
    switch (status) {
      case 'ClientStarted':
        this.initFrank();
        break;
      case 'ChampSelect':
        this.preChampId = 0;
        this.gameFlow.sendMesToMain('ChampSelect');
        this.gameFlow.autoPickBanChamp();
        break;
      case 'GameStart':
        this.gameFlow.showHideMainWin(false, 'GameStart');
        this.gameFlow.initGameInWindow();
        break;
      case 'PreEndOfGame':
        this.gameFlow.closeWin('recentMatchWindow');
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
    await this.handleGetCurrentChampion();
  }

  private handleCurrentChamp(champId:number) {
    if (champId !== 0 && champId !== this.preChampId) {
      this.preChampId = champId;
      this.gameFlow.sendMesToMain('Champion', champId);
    }
  }
}

new Background();

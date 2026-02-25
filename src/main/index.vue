<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { window } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { useRuneStore } from "@/main/store/useRune";
import { useMessage, MessageReactive } from "naive-ui";
import Dashboard from "@/main/common/dashboard.vue";
import { emitTo, listen } from "@tauri-apps/api/event";
import { useRecordStore } from "@/main/store/useRecord";
import Navigation from "@/main/common/navigation.vue";
import { useTeammateStore } from "@/main/store/useTeammate";
import { queryFriendInfo } from "@/main/views/teammate/utils";
import { MainPageTips } from "@/main/utils/notice.ts";

const router = useRouter();
const curPos = ref(0);
const message = useMessage();
let messageReactive: MessageReactive | null = null;
const teammateStore = useTeammateStore();
const runeStore = useRuneStore();
const recordStore = useRecordStore();
const pageTips = new MainPageTips();
const configSetting = JSON.parse(<string>localStorage.getItem("configSetting"));
const tipsDoneList: number[] = [];

onMounted(() => {
	router.push({ name: "home" });
});

// 处理不同的状态
class GameState {
	public curFlow = "None";
	public islistenSession = false;
	public curQueueId = -1;
	public curChampId = -1;

	// 重置Store数据
	public resetStore = () => {
		runeStore.$reset();
		teammateStore.$reset();
	};
	// 改变页面
	public changeState = (id: string, page: string, index: number) => {
		this.curFlow = id;
		this.navigateToPage(page, index);
	};
	// 改变底部页面图标
	public navigateToPage = (page: string, index: number) => {
		if (!this.preventAccess(index)) {
			const mess =
				index === 2
					? "选择英雄阶段，方可使用"
					: "选择英雄之后，才可使用";
			message.warning(mess, { duration: 2000 });
			return;
		}
		curPos.value = index;
		router.push({ name: page });

		// tips
		if (!tipsDoneList.includes(index)) {
			setTimeout(() => {
				if (index === 1) {
					pageTips.init(configSetting, 1);
				} else if (index === 2) {
					pageTips.init(configSetting, 2);
				}
				tipsDoneList.push(index);
			}, 1200);
		}
	};
	// 防止访问
	public preventAccess = (index: number) => {
		switch (index) {
			case 2:
				return (
					this.curFlow === "ChampSelect" ||
					this.curFlow === "Champion"
				);
			case 3:
				return (
					this.curFlow === "ChampSelect" ||
					this.curFlow === "Champion"
				);
			default:
				return true;
		}
	};
	// 处理None状态
	public handleNone = (id: string) => {
		if (id === this.curFlow) {
			return;
		}
		this.changeState(id, "home", 0);
	};
	// 处理Lobby状态
	public handleLobby = (id: string) => {
		if (id === this.curFlow) {
			return;
		}
		this.changeState(id, "rank", 1);
	};
	// 处理Matchmaking状态
	public handleMatchmaking = (id: string) => {
		this.changeState(id, "rank", 1);
	};
	// 处理ChampSelect状态
	public handleChampSelect = async (id: string) => {
		this.resetStore();
		this.changeState(id, "teammate", 2);
		this.hanleFriendInfo();
	};
	// 获取队友数据
	public hanleFriendInfo = () => {
		const queueId: number = this.queryGameInfo();
		queryFriendInfo(this.islistenSession).then((summonerInfo) => {
			// 启动选择英雄监听
			if (!this.islistenSession) {
				this.islistenSession = true;
				invoke("start_champ_select");
				if (summonerInfo.champId !== 0) {
					this.handleChampion("Champion", summonerInfo.champId);
				}
			}

			const summonerIdList = summonerInfo.list.map(
				(summoner) => summoner.summonerId,
			);
			// 判断是否存在黑名单数据
			recordStore.checkFriSum(summonerIdList).then((value) => {
				teammateStore.initStore(
					summonerInfo.list,
					queueId,
					value,
					false,
				);
				// 从符文配置界面切换过来
				if (value !== null && value.length !== 0) {
					setTimeout(() => {
						this.changeState("Champion", "teammate", 2);
						if (value.length > 1) {
							message.error("点击昵称查看被标记玩家！！！", {
								duration: 5000,
							});
						}
					}, 3000);
				}
			});
		});
	};
	// 获取GameInfo
	public queryGameInfo = () => {
		if (this.curQueueId === -1) {
			const gameInfo = localStorage.getItem("gameInfo");

			if (gameInfo === null) {
				localStorage.setItem(
					"gameInfo",
					String(
						JSON.stringify({
							queueId: 420,
							mapId: 11,
						}),
					),
				);
				return 420;
			} else {
				this.curQueueId = JSON.parse(gameInfo).queueId;
			}
		}
		return this.curQueueId;
	};
	// 处理Champion状态
	public handleChampion = (id: string, content: number) => {
		if (content === 0) {
			return;
		}
		this.curChampId = content;
		const queueId: number = this.queryGameInfo();

		runeStore.initStore(content, queueId).then((res: any) => {
			if (res) {
				message.error("当前英雄暂无符文数据");
				return;
			} else {
				this.changeState(id, "rune", 3);
			}
		});
	};
	// 处理GameStart状态
	public handleGameStart = (id: string) => {
		// 游戏模式ID置空
		this.curQueueId = -1;
		this.changeState(id, "record", 4);
	};
	// 处理EndOfGame状态
	public handleEndOfGame = () => {
		// 当前英雄ID置空
		this.curChampId = -1;
		if (!messageReactive) {
			messageReactive = message.loading("对局结算数据加载中...", {
				duration: 0,
			});
		}

		recordStore.getParticipantsInfo().then((isSuccess) => {
			messageReactive?.destroy();
			messageReactive = null;

			if (isSuccess === null) {
				return;
			} else if (!isSuccess) {
				message.error("获取数据失败，请到查询战绩添加", {
					closable: true,
					duration: 3000,
				});
			}
		});
	};
	// 处理AddBlackList状态
	public handleAddBlackList = (gameId: number) => {
		this.changeState("GameStart", "record", 4);
		recordStore.getParticipantsInfo(gameId);
	};
}

const gameState = new GameState();

listen<{ messageId: string; content: number }>("clientStatus", (event) => {
	switch (event.payload.messageId) {
		case "None":
			return gameState.handleNone("None");
		case "Lobby":
			return gameState.handleLobby("Lobby");
		case "Matchmaking":
			return gameState.handleMatchmaking("Matchmaking");
		case "ChampSelect":
			return gameState.handleChampSelect("ChampSelect");
		case "Champion":
			return gameState.handleChampion("Champion", event.payload.content);
		case "GameStart":
			return gameState.handleGameStart("GameStart");
		case "EndOfGame":
			return gameState.handleEndOfGame();
		case "AddBlackList":
			return gameState.handleAddBlackList(event.payload.content);
	}
});

// gameState.handleChampion("Champion", 777);

listen<string>("cacheMatchList", (event) => {
	if (event.payload === "getMatchList") {
		window.Window.getByLabel("recentMatchWindow").then((win) => {
			if (win !== null) {
				emitTo(
					"recentMatchWindow",
					"matchListCache",
					JSON.parse(JSON.stringify(teammateStore.cacheMatchList)),
				);
				// emitTo("recentMatchWindow", "matchListCache", session450);
			}
		});
	} else if (event.payload === "getTeammate") {
		const summonerInfo = JSON.parse(
			JSON.stringify(teammateStore.summonerInfo),
		);
		const cacheMatchList = JSON.parse(
			JSON.stringify(teammateStore.cacheMatchList),
		);

		window.Window.getByLabel("matchAnalysisWindow").then((win) => {
			if (win !== null) {
				emitTo("matchAnalysisWindow", "teammateData", {
					summonerInfo: summonerInfo,
					cacheMatchList: cacheMatchList,
				});
			}
		});
	} else if (event.payload === "getCurChampId") {
		window.Window.getByLabel("recentMatchWindow").then((win) => {
			if (win !== null) {
				emitTo("recentMatchWindow", "curChampId", {
					id: gameState.curChampId,
				});
			}
		});
	}
});
</script>

<template>
	<div class="main bg-neutral-100 dark:bg-neutral-900">
		<dashboard :configSetting="configSetting" />
		<!--    <button @click="gameState.handleCSSession('CSSession', champSession, true)">NULL</button>-->
		<!--        <button @click="gameState.handleChampion('3',12)">champ</button>-->
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</router-view>
		<navigation
			:cur-pos="curPos"
			:navigate-to-page="gameState.navigateToPage"
		/>
	</div>
</template>

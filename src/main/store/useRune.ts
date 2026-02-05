import { defineStore } from "pinia";
import { champDict } from "@/resources/champList";
import { RuneStoreActions, RuneStoreState } from "@/main/views/rune/runeTypes";
import { QueryRune } from "@/main/views/rune/queryRune";

const queryRune = new QueryRune();

export const useRuneStore = defineStore<
	"useRuneStore",
	RuneStoreState,
	{},
	RuneStoreActions
>("useRuneStore", {
	state: () => {
		return {
			currentChamp: 0,
			currentChampImgUrl: "",
			currentChampAlias: "",
			currentChampTitle: "",
			runeDataList: [],
			blockDataList: [],
			skillsList: [],
			hexItemList: [],
			hexAugments: null,
		};
	},
	actions: {
		mapChampInfo(champId: number) {
			this.currentChamp = champId;
			this.currentChampImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`;
			this.currentChampAlias = champDict[champId].alias;
			this.currentChampTitle = champDict[champId].title;
		},
		async initStore(champId: number, queueId: number) {
			// 如果英雄相同，说明已然存在数据
			if (champId === this.currentChamp) {
				return false;
			}
			if (this.runeDataList.length !== 0) {
				this.$reset();
			}

			this.mapChampInfo(champId);

			// 处理海克斯大乱斗
			if (1) {
				const hexInfo = await queryRune.getHexInfo(this.currentChampAlias);
				if (hexInfo !== null) {
					this.skillsList = hexInfo.skillsList;
					this.hexItemList = hexInfo.itemList;
					this.hexAugments = hexInfo.augments;
					return false;
				}
			}

			const runesData = await queryRune.getRunesData(
				this.currentChampAlias,
				queueId,
			);
			if (runesData !== null) {
				this.skillsList = runesData.skillsList;
				this.runeDataList = runesData.runeDataList;
				this.blockDataList = runesData.blockDataList;
				return false;
			} else {
				return true;
			}
		},
	},
});

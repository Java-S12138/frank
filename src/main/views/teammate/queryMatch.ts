import { queryMatchHistory } from "@/lcu/aboutMatch";
import { Games, SimpleMatchTypes } from "@/lcu/types/queryMatchLcuTypes";
import { champDict } from "@/resources/champList";
import { querySummonerPosition } from "@/lcu/utils";
import { GamesBySgp } from "@/lcu/types/queryMatchSgpGameTypes";

export class QueryMatch {
	public timestampToDate = (timestamp: number) => {
		const date = new Date(timestamp);
		return (
			(date.getMonth() + 1 < 10
				? "0" + (date.getMonth() + 1)
				: date.getMonth() + 1) +
			"-" +
			(date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
		);
	};

	public queryGameType = (queueId: number) => {
		switch (queueId) {
			case 420:
				return "单双";
			case 430:
				return "匹配";
			case 440:
				return "灵活";
			case 450:
				return "极地";
			case 2400:
				return "海斗";
			case 1700:
				return "斗魂";
			case 1900:
				return "无限";
		}
		return "其它";
	};

	public getSimpleMatch = (match: Games | GamesBySgp): SimpleMatchTypes => {
		// 1. 获取第一个参与者对象
		const p0 = match.participants[0];

		// 2. 统一战斗数据源 (LCU 嵌套在 stats 中，SGP 直接在 p0 中)
		const statsSource = "stats" in p0 ? p0.stats : p0;

		// 3. 提取战斗数据和物品 (来自 statsSource)
		const {
			kills,
			deaths,
			assists,
			win,
			champLevel,
			item0,
			item1,
			item2,
			item3,
			item4,
			item5,
			item6,
		} = statsSource;

		// 4. 提取参与者根属性 (championId, spellId 无论哪种格式都在这里)
		const { championId, spell1Id, spell2Id } = p0;

		// 5. 计算 KDA
		const kda =
			deaths === 0
				? kills + assists
				: Math.round(((kills + assists) / deaths) * 3);

		// 6. 处理位置 (Lane) 差异
		const rawLane = "timeline" in p0 ? p0.timeline.lane : (p0 as any).lane;

		// 7. 查找英雄别名 (增加防御性判断)
		const champAlias = champDict[String(championId)]?.alias || "unknown";

		return {
			gameId: match.gameId,
			queueId: match.queueId,
			champId: championId,
			champImgUrl: `${champAlias}.png`,
			isWin: !!win,
			kills,
			deaths,
			assists,
			kda,
			matchTime: this.timestampToDate(match.gameCreation),
			gameModel: this.queryGameType(match.queueId),
			spell1Id: spell1Id,
			spell2Id: spell2Id,
			itemList: [item0, item1, item2, item3, item4, item5, item6],
			lane: querySummonerPosition(rawLane),
			level: champLevel,
		};
	};
	// process record data
	public dealMatchHistory = async (
		puuid: string,
		begIndex: number,
		endIndex: number,
	): Promise<SimpleMatchTypes[] | null> => {
		const matchList = await queryMatchHistory(puuid, begIndex, endIndex);
		if (matchList === null) {
			return null;
		}

		return matchList.map((matchListElement) => {
			return this.getSimpleMatch(matchListElement);
		});
	};
	// query the record of a specific mode
	public querySpecialMatch = async (
		puuid: string,
		matchHis20: SimpleMatchTypes[],
		queueId: number,
	) => {
		const specialList = matchHis20
			.filter((matchList) => matchList.queueId === queueId)
			.slice(0, 10);
		const speListLen = specialList.length;

		if (speListLen === 10 || matchHis20.length < 20) {
			return specialList;
		} else {
			const matchHis40 = await this.dealMatchHistory(puuid, 20, 40);
			if (matchHis40 === null) {
				return specialList;
			}
			return [
				...specialList,
				...matchHis40
					.filter((matchList) => matchList.queueId === queueId)
					.slice(0, 10 - speListLen),
			];
		}
	};

	public getMatchHis = async (puuid: string, isReGet: boolean) => {
		if (isReGet) {
			return await this.dealMatchHistory(puuid, 0, 10);
		}
		return await this.dealMatchHistory(puuid, 0, 20);
	};
	public getSpecialMatchHis = async (
		puuid: string,
		matchHis20: SimpleMatchTypes[],
		queueId: number,
	) => {
		return await this.querySpecialMatch(puuid, matchHis20, queueId);
	};
}

import { queryRankPoint, querySummonerInfo } from "@/lcu/aboutSummoner";
import { Games, SimpleMatchDetailsTypes } from "@/lcu/types/queryMatchLcuTypes";
import { queryMatchHistory } from "@/lcu/aboutMatch";
import { queryGameType } from "@/lcu/utils";
import { champDict } from "@/resources/champList";
import { GamesBySgp } from "@/lcu/types/queryMatchSgpGameTypes";
import { sumInfoTypes } from "@/lcu/types/SummonerTypes";

export default class BaseMatch {
	public summonerId = 0;

	public gerSummonerInfo = async (summonerId?: number) => {
		const summonerInfo = await querySummonerInfo(summonerId);
		if (summonerInfo !== null) {
			const rankList = await queryRankPoint(summonerInfo.puuid);
			return { summonerInfo, rankList };
		}
		return null;
	};

	public dealMatchHistory = async (
		puuid: string,
		begIndex: number,
		endIndex: number,
	): Promise<SimpleMatchDetailsTypes[] | null> => {
		// 写入玩家id
		if (this.summonerId === 0) {
			const localSumInfo: sumInfoTypes = JSON.parse(
				localStorage.getItem("sumInfo") as string,
			);
			this.summonerId = localSumInfo.summonerId;
		}

		const matchList = await queryMatchHistory(puuid, begIndex, endIndex);

		if (matchList === null) {
			return null;
		}

		return matchList.map((matchListElement) => {
			return this.getSimpleMatch(matchListElement);
		});
	};

	public getSimpleMatch = (
		match: Games | GamesBySgp,
	): SimpleMatchDetailsTypes => {
		// 1. 确定参与者数据源
		const participant = match.participants[0];
		const stats =
			"stats" in participant ? (participant as any).stats : participant;

		// 2. 提取核心数值
		const { kills, deaths, assists, win, championId } = stats;

		// 3. 计算 KDA
		const kda =
			deaths === 0
				? kills + assists
				: Math.round(((kills + assists) / deaths) * 3);

		// 4. 处理时间和字典查询
		const [startTime, matchTime] = this.timestampToDate(match.gameCreation);
		const champAlias = champDict[String(championId)]?.alias || "Unknown";

		// 5. 统一返回
		return {
			gameId: match.gameId,
			champId: championId,
			champImgUrl: `${champAlias}.png`,
			isWin: Boolean(win),
			kills,
			deaths,
			assists,
			kda,
			matchTime,
			startTime,
			gameModel: queryGameType(match.queueId),
			queueId: match.queueId,
		};
	};

	public querySpecialMatch = async (puuid: string, queueId: number) => {
		const matchList = await queryMatchHistory(puuid, 0, 60);
		if (matchList === null) {
			return [];
		}
		const specialList = matchList.filter(
			(matchList) => matchList.queueId === queueId,
		);

		return specialList.map((matchListElement) => {
			return this.getSimpleMatch(matchListElement);
		});
	};

	public timestampToDate = (timestamp: number): [string, string] => {
		const date = new Date(timestamp);
		// 获取时间
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return [
			`${hours} : ${minutes}`,
			date.getMonth() + 1 + "-" + date.getDate(),
		];
	};
}

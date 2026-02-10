import { invokeLcu } from "./index";
import {
	lcuSummonerInfo,
	summonerInfo,
	ChampionMasteryTypes,
} from "./types/SummonerTypes";
import { dealDivsion, englishToChinese } from "./utils";
import { champDict } from "@/resources/champList";

// 查询本地召唤师信息
export const querySummonerInfo = async (
	summonerId?: number | string,
): Promise<summonerInfo | null> => {
	const endpoint = summonerId
		? `/lol-summoner/v1/summoners/${summonerId}`
		: "/lol-summoner/v1/current-summoner";

	const summonerInfo: lcuSummonerInfo | null = await invokeLcu("get", endpoint);

	if (summonerInfo === null) {
		return null;
	}

	return {
		privacy: summonerInfo.privacy,
		puuid: summonerInfo.puuid,
		tagLine: summonerInfo.tagLine,
		name: summonerInfo.gameName || summonerInfo.displayName,
		currentId: summonerInfo.summonerId,
		lv: "Lv " + summonerInfo.summonerLevel,
		xp: parseInt(
			String(
				(summonerInfo.xpSinceLastLevel / summonerInfo.xpUntilNextLevel) * 100,
			),
		),
		imgUrl: `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`,
	};
};

// 查询召唤师排位分数
export const queryRankPoint = async (puuid?: string): Promise<string[]> => {
	try {
		// 根据是否提供 puuid 调用不同的接口
		const endpoint = puuid
			? `/lol-ranked/v1/ranked-stats/${puuid}`
			: "/lol-ranked/v1/current-ranked-stats";
		const rankPoint = (await invokeLcu<any>("get", endpoint))?.queues ?? [];

		// 如果 rankPoint 无效，返回默认值
		if (!Array.isArray(rankPoint) || rankPoint.length === 0) {
			return ["未定级", "未定级", "未定级"];
		}

		// 查找不同模式的排名数据
		const rankSolo = rankPoint.find(
			(i: any) => i.queueType === "RANKED_SOLO_5x5",
		);
		const rankFlex = rankPoint.find(
			(i: any) => i.queueType === "RANKED_FLEX_SR",
		);
		const rankTft = rankPoint.find((i: any) => i.queueType === "RANKED_TFT");

		// 生成排名字符串的辅助函数
		const generateRankString = (rank: any): string => {
			if (!rank || rank.tier === "") return "未定级";
			return `${englishToChinese(rank.tier)}${dealDivsion(rank.division)} ${rank.leaguePoints}`;
		};

		// 获取各模式的排名信息
		const RANKED_SOLO = generateRankString(rankSolo);
		const RANKED_FLEX_SR = generateRankString(rankFlex);
		const RANKED_TFT = generateRankString(rankTft);

		return [RANKED_SOLO, RANKED_FLEX_SR, RANKED_TFT];
	} catch (error) {
		return ["Error", "Error", "Error"];
	}
};

// 查看本地召唤师荣誉等级
export const querySummonerHonorLevel = async (): Promise<string> => {
	const summonerHonor: any = await invokeLcu("get", "/lol-honor-v2/v1/profile");
	if (summonerHonor?.honorLevel === undefined) {
		return "Error";
	}
	return (
		"荣誉等级" + summonerHonor?.honorLevel + " 里程" + summonerHonor?.checkpoint
	);
};

// 查询召唤师绝活英雄数据
export const queryMasteryChampList = async (summonerPuuid?: string) => {
	if (summonerPuuid === "") {
		return [];
	}

	let summonerSuperChampData: ChampionMasteryTypes[] | null;
	if (summonerPuuid === undefined) {
		summonerSuperChampData = await invokeLcu(
			"get",
			"/lol-champion-mastery/v1/local-player/champion-mastery",
		);
	} else {
		summonerSuperChampData = await invokeLcu(
			"get",
			`/lol-champion-mastery/v1/${summonerPuuid}/champion-mastery`,
		);
	}
	if (summonerSuperChampData === null) {
		return [];
	}
	return summonerSuperChampData
		.slice(0, 20)
		.reduce((res: string[][], item: ChampionMasteryTypes) => {
			return res.concat([
				[
					`https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
					`${champDict[String(item.championId)].label}•${champDict[String(item.championId)].title}`,
					`英雄等级 ${item.championLevel} / 熟练度 ${item.championPoints}`,
				],
			]);
		}, []);
};

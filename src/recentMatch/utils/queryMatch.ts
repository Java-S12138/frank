import { MatchItemTypes } from "@/recentMatch/utils/queryTypes";
import { champDict } from "@/resources/champList";
import { queryMatchHistory } from "@/lcu/aboutMatch";
import { Games } from "@/lcu/types/queryMatchLcuTypes";
import { GamesBySgp } from "@/lcu/types/queryMatchSgpGameTypes";

class QueryMatch {
    public winCount = 0;

    public queryMatchHistory = async (
        puuid: string,
        queueId: number,
        summonerState: string,
    ): Promise<[MatchItemTypes[], number, boolean]> => {
        try {
            let matchList: MatchItemTypes[] = [];

            // Get match list based on queue type
            if (queueId === 420 || queueId === 440) {
                matchList = await this.findSpecialMatch(puuid, queueId);
            } else {
                matchList = await this.findMatch(puuid);
            }

            // Remove duplicate matches by gameId
            const uniqueMatches = matchList.reduce(
                (acc: MatchItemTypes[], current) => {
                    if (!acc.some((match) => match.gameId === current.gameId)) {
                        acc.push(current);
                    }
                    return acc;
                },
                [],
            );

            // Calculate win count (assuming this.winCount is updated in findMatch/findSpecialMatch)
            const winCount = matchList.length > 0 ? this.winCount : 0;

            // Determine if player is excellent based on their state and match performance
            const isExcel = this.isExcelPlayer(summonerState, uniqueMatches);

            // Reset win count for future calls
            this.winCount = 0;

            return [uniqueMatches, winCount, isExcel];
        } catch (error) {
            console.error("Error in queryMatchHistory:", error);
            // Return default values in case of error
            return [[], 0, false];
        }
    };

    public parseMatch = (games: Games | GamesBySgp): MatchItemTypes => {
        const p0 = games.participants[0];

        // 1. 统一战斗数据源 (LCU 嵌套在 stats，SGP 就在 p0)
        const statsSource = "stats" in p0 ? p0.stats : p0;

        // 2. 提取核心字段
        const { win, kills, deaths, assists } = statsSource;
        const { championId } = p0; // championId 始终在参与者根节点

        // 3. 更新胜率统计 (使用简写)
        if (win) {
            this.winCount++;
        }

        // 4. 获取英雄别名

        const champAlias = champDict[String(championId)]?.alias;
        // 字典缺英雄时回退到 CommunityDragon 图标
        const champImgUrl = champAlias
            ? `https://game.gtimg.cn/images/lol/act/img/champion/${champAlias}.png`
            : `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;

        return {
            champImg: champImgUrl,
            kills,
            deaths,
            assists,
            isWin: !!win,
            gameId: games.gameId,
            queueId: games.queueId,
        };
    };

    public isExcelPlayer = (
        summonerState: string,
        matchList: MatchItemTypes[],
    ) => {
        // 判断是否为小代
        if (summonerState !== "Y") {
            return false;
        }
        let excellentCount = 0;
        for (let match of matchList.slice(0, 5)) {
            const kda =
                match.deaths === 0
                    ? (match.kills + match.assists) * 2
                    : ((match.kills + match.assists) / match.deaths) * 3;
            if (kda >= 12) {
                excellentCount += 1;
            }
        }
        return excellentCount >= 3;
    };

    public findMatch = async (puuid: string): Promise<MatchItemTypes[]> => {
        const matchList = await queryMatchHistory(puuid, 0, 10);
        if (matchList !== null) {
            return matchList.map((games) => this.parseMatch(games));
        } else {
            return [];
        }
    };

    public findSpecialMatch = async (
        puuid: string,
        queueId: number,
    ): Promise<MatchItemTypes[]> => {
        const latestMatch = await queryMatchHistory(puuid, 0, 10);
        const specialList: MatchItemTypes[] = [];

        let offset = 0;
        while (offset < 30) {
            const matchHistory =
                offset === 0
                    ? latestMatch
                    : await queryMatchHistory(puuid, offset, offset + 10);
            if (!matchHistory || matchHistory.length === 0) {
                break;
            }
            const filterMatch = matchHistory.filter(
                (games) => queueId === games.queueId,
            );

            for (const game of filterMatch) {
                specialList.push(this.parseMatch(game));
                if (specialList.length === 10) {
                    return specialList;
                }
            }

            offset += 10;
        }
        if (specialList.length === 0 && latestMatch !== null) {
            return latestMatch.map((games) => this.parseMatch(games));
        } else return specialList;
    };
}

export default QueryMatch;

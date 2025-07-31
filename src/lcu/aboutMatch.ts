import {invoke} from "@tauri-apps/api/core";
import {Games, LcuMatchList} from "./types/queryMatchLcuTypes";

// 辅助函数：处理单次请求
const fetchMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<Games[]> => {
  const uri = `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begIndex}&endIndex=${endIndex}`;
  const matchList = await invoke<LcuMatchList| null>("get_match_list", { uri });
  if (matchList === null) return [];
  return matchList.games.games || [];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 辅助函数：拆分请求区间
const splitRequests = async (puuid: string, begIndex: number, endIndex: number): Promise<Games[]> => {
  const step = 10; // 每段的范围为 10
  let allGames: Games[] = [];
  let currentBegIndex = begIndex;

  // 循环拆分请求
  while (currentBegIndex < endIndex) {
    const currentEndIndex = Math.min(currentBegIndex + step - 1, endIndex);
    const games = await fetchMatchHistory(puuid, currentBegIndex, currentEndIndex);

    if (games.length > 0) {
      allGames = allGames.concat(games);
    }

    currentBegIndex = currentEndIndex + 1;
    await delay(200);
  }

  return allGames;
};

// 主函数：查询历史比赛数据
export const queryMatchHistory = async (puuid: string, begIndex: number, endIndex: number): Promise<Games[] | null> => {
  try {
    let allGames: Games[] = [];
    const MAX_REQUEST_SIZE = 15;

    // 如果请求范围超过最大限制，拆分请求
    if (endIndex - begIndex > MAX_REQUEST_SIZE) {
      allGames = await splitRequests(puuid, begIndex, endIndex);
    } else {
      allGames = await fetchMatchHistory(puuid, begIndex, endIndex);
    }

    // 如果没有获取到游戏数据，返回空数组
    if (!allGames || allGames.length === 0) {
      return [];
    }

    // 去重操作
    const uniqueGames = Array.from(
      new Map(allGames.map(game => [game.gameId, game])).values()
    );

    // 按游戏创建时间降序排序
    return uniqueGames.sort((a, b) => b.gameCreation - a.gameCreation);
  } catch (error) {
    console.error('Error fetching match history:', error);
    return null;
  }
};


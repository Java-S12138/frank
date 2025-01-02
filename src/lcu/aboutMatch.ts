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
    // 如果 begIndex 与 endIndex 的差值大于 15，拆分请求
    if (endIndex - begIndex > 15) {
      allGames = await splitRequests(puuid, begIndex, endIndex);
    } else {
      // 如果差值不大于 15，直接请求整个范围的数据
      allGames = await fetchMatchHistory(puuid, begIndex, endIndex);
    }

    // 如果没有游戏数据，则返回空数组
    if (allGames.length === 0) {
      return [];
    }

    // 判断是否需要反转游戏数据
    if (allGames[0].gameCreation > allGames[allGames.length - 1].gameCreation) {
      return allGames;
    }

    return allGames.reverse();
  } catch (e) {
    return null;
  }
};


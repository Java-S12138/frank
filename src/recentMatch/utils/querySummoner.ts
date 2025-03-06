import {englishToChinese} from "@/lcu/utils";
import {aliasToId, champDict} from "@/resources/champList";
import {invokeLcu} from "@/lcu";
import {RecentSumInfo, SessionTypes, TeamData,SuperChampTypes} from "@/recentMatch/utils/queryTypes";

class QuerySummoner {
  public matchSession: null|SessionTypes = null
  public currentId: number = 0
  public queueId: number = 0

  // 初始化数据
  public init = async () => {
    try {
      this.matchSession = await invokeLcu('get','/lol-gameflow/v1/session') as SessionTypes
      this.queueId = this.matchSession.gameData.queue.id
    }catch (e){
      this.matchSession = null
      this.queueId = 0
      return
    }
    this.currentId = JSON.parse(localStorage.getItem('sumInfo') as string).summonerId
  }
  // 通过Lcu接口查询数据
  public fromLcuQuery = async () => {
    await this.init()
    if (this.matchSession === null){
      return null
    }
    const isTeamOne = this.matchSession.gameData.teamOne.find((i: TeamData) => i.summonerId === this.currentId) !== undefined?true:false
    const [friendList,enemyList] = await Promise.all([
      isTeamOne === true
        ? await this.simplifySummonerInfo(this.matchSession.gameData.teamOne)
        : await this.simplifySummonerInfo(this.matchSession.gameData.teamTwo),
      isTeamOne === true
        ? await this.simplifySummonerInfo(this.matchSession.gameData.teamTwo)
        : await this.simplifySummonerInfo(this.matchSession.gameData.teamOne)
    ])
    return {friendList, enemyList,queueId:this.queueId}
  }
  // 获取召唤师Icon
  public getIconAlias = (summoner:TeamData) => {
    if (summoner.championId !== undefined){
      return  champDict[summoner.championId].alias
    }
    return ""
    // return  champDict[this.playerChampionSelections[(summoner.summonerName.toLowerCase())]].alias
  }
  // 通过lcu接口获取数据再次进行解析
  public simplifySummonerInfo = async (summonerList: TeamData[]) => {
    try {
      const promisesList:Promise<RecentSumInfo>[] =  summonerList.map(async (summoner:TeamData) => {
        const iconAlias = this.getIconAlias(summoner)
        const summonerState = await this.querySummonerSuperChampData(summoner.puuid, iconAlias)
        const rankPoint = await this.queryRankPoint(summoner.puuid)
        return <RecentSumInfo> {
          matchList:[],
          rankPoint:rankPoint,
          summonerState: summonerState,
          summonerId: summoner.summonerId,
          puuid:summoner.puuid,
          summonerName: summoner.summonerName,
          teamParticipantId:summoner.teamParticipantId,
          champId:summoner.championId,
          championUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${iconAlias}.png`
        }
      })

      const reSumInfoList = await Promise.all(promisesList)
      return reSumInfoList.sort((x: RecentSumInfo, y: RecentSumInfo) => {
        return x.teamParticipantId - y.teamParticipantId
      })
    }catch (e) {
      return [] as RecentSumInfo[]
    }
  }
  // 获取段位数据
  public queryRankPoint = async (puuid: string): Promise<string[]> => {
    const fetchRankDataWithRetry = async (retries = 2): Promise<any> => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res = await invokeLcu('get', `/lol-ranked/v1/ranked-stats/${puuid}`);
          if (res !== null) return res; // 如果获取成功，立即返回
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.warn(`Attempt ${attempt + 1} failed:`, error);
        }
      }
      return null; // 如果所有尝试均失败，返回 null
    };

    const res = await fetchRankDataWithRetry();

    if (res === null) {
      return ['error', 'error'];
    }

    // 解析 rank 数据
    const rankData = res.queueMap;
    return ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].reduce((acc: string[], queueType: string) => {
      const tier = rankData[queueType]?.tier === "" ? '未定级' : englishToChinese(rankData[queueType].tier);
      const division = rankData[queueType]?.division === 'NA' ? '' : rankData[queueType]?.division || '';
      acc.push(tier !== '未定级' ? `${tier}${division}` : '未定级');
      return acc;
    }, []);
  };

  // 获取召唤师英雄绝活数据 Z:正常 A:绝活 B:熟练 S:小代 Y:未知 (需要进行下一步判断)
  public querySummonerSuperChampData = async (puuid: string, champAlias: string) => {
    // 获取英雄 ID
    const champId = aliasToId[champAlias];
    const curChampMark = { lv: -1, score: -1 };

    // 获取召唤师英雄绝活数据
    const superList: SuperChampTypes[] | null = await invokeLcu('get', `/lol-champion-mastery/v1/${puuid}/champion-mastery`);

    if (!superList) {
      return { label: 'Z', lv: curChampMark.lv, score: curChampMark.score };
    }

    // 查找当前英雄的等级和分数
    const curChamp = superList.find((val: SuperChampTypes) => val.championId === champId);
    if (curChamp) {
      curChampMark.lv = curChamp.championLevel;
      curChampMark.score = curChamp.championPoints;
    }

    // 检查前 6 名中的位置
    const top6List = superList.slice(0, 6);
    const champIndex = top6List.findIndex((val: SuperChampTypes) => val.championId === champId);

    if (champIndex !== -1) {
      return {
        label: champIndex < 3 ? 'Z' : 'B',
        lv: curChampMark.lv,
        score: curChampMark.score,
      };
    }

    // 英雄未上榜
    return { label: 'Y', lv: curChampMark.lv, score: curChampMark.score };
  };
}

export default QuerySummoner

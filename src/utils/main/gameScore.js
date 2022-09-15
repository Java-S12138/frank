import {appConfig} from "@/utils/main/config";
import {createHttp1Request, createHttp2Request} from "@/utils/league-connect";
import {champDict} from "@/utils/render/lolDataList";


// 查询当前游戏模式
const queryCurrentGameMode = async (credentials) => {
// 获取当前游戏模式信息
  const currentGameInfo = (await createHttp1Request({
    method: "GET",
    url: '/lol-gameflow/v1/session',
  }, credentials)).json()
  try {
    return currentGameInfo.gameData.queue.id
  } catch (e) {
    return null
  }
}

// 获取最近的比赛记录
const getRencentMatchHistoty = async (credentials, session, summonerId) => {
  const matchList = (await createHttp2Request({
    method: "GET",
    url: `/lol-match-history/v3/matchlist/account/${summonerId}?begIndex=0&endIndex=10`,
  }, session, credentials)).json()['games']['games'].reverse()
  return matchList
}

// 查询比赛记录 (最近10场排位)
const queryMatchHistory = async (credentials, session, summonerId) => {
  const currentGameMode = await queryCurrentGameMode(credentials)
  console.log('当前游戏模式:', currentGameMode)
  if (currentGameMode === null) {
    return await getRencentMatchHistoty(credentials, session, summonerId)
  }

  let classicMode = []
  let matchCount = 0
  for (let i = 0; i < 100; i += 20) {
    const matchList = (await createHttp2Request({
      method: "GET",
      url: `/lol-match-history/v3/matchlist/account/${summonerId}?begIndex=${i}&endIndex=${i + 20}`,
    }, session, credentials)).json()['games']['games'].reverse()

    for (const matchListElement of matchList) {
      if (matchListElement.queueId == currentGameMode && matchCount < 10) {
        matchCount += 1
        classicMode.push(matchListElement)
      } else if (matchCount === 10) {
        return classicMode
      }
    }
  }
  return classicMode
}

// 获取召唤师游戏评分分数
export const getGameScore = async (credentials, summonerId, session) => {
  let classicModeGames = await queryMatchHistory(credentials, session, summonerId)
  const simpleMatchHistory = getSimpleMatchHistory(classicModeGames)
  let gameScore = 0
  let gameCount = classicModeGames.slice(0,5).length
  let kdaHistory = ''
  for (const modeGame of classicModeGames.slice(0,5)) {
    gameScore += analyseSingleMatch(modeGame.participants[0].stats)
    let tempKad = `${modeGame.participants[0].stats.kills}/${modeGame.participants[0].stats.deaths}/${modeGame.participants[0].stats.assists}  `
    kdaHistory += tempKad
  }
  gameScore = parseInt(gameScore / gameCount)
  return {
    score: gameScore,
    horse: jundgeHorse(gameScore),
    kdaHistory: kdaHistory,
    simpleMatchHistory: simpleMatchHistory
  }
}

// 获取简单的历史战绩信息
const getSimpleMatchHistory = (matchList) => {
  let position = []
  let winOrLoss = []
  let simpleMatch = []
  for (const match of matchList) {
    simpleMatch.push({
      champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(match.participants[0].championId)].alias}.png`,
      position: match.participants[0].timeline.lane,
      kill: match.participants[0].stats.kills,
      deaths: match.participants[0].stats.deaths,
      assists: match.participants[0].stats.assists,
      isWin: match.participants[0].stats.win,
      gameId: match.gameId
    })
    position.push(match.participants[0].timeline.lane)
    winOrLoss.push(match.participants[0].stats.win)
  }
  const winInfo = inferMatchWinRat(winOrLoss)
  const regularPostion = inferRegularPosition(position)
  return {winInfo, regularPostion, simpleMatch}
}

// 判断最近战绩情况
const inferMatchWinRat = (arr) => {
  const firstMatch = arr[0]
  let count = 0
  for (const arrElement of arr) {
    if (arrElement === firstMatch) {
      count += 1
    } else {
      break
    }
  }
  if (count === 1) {
    return firstMatch === true ? {'info': '一胜一负', isWin: firstMatch} : {'info': '一负一胜', isWin: firstMatch}
  } else if (count === 0) {
    return {'info': '暂无数据', isWin: firstMatch}
  } else {
    return firstMatch === true ? {'info': `${count}连胜中`, isWin: firstMatch} : {
      'info': `${count}连败中`,
      isWin: firstMatch
    }
  }
}

// 判断常玩位置
const inferRegularPosition = (arr) => {
  if (!arr) return false
  if (arr.length === 1) return 1
  let res = {}
  let maxNum = 0
  let maxValue = null
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i]
    res[val] === undefined ? res[val] = 1 : res[val]++
    if (res[val] > maxNum) {
      maxNum = res[val]
      maxValue = val
    }
  }
  return querySummonerPosition(maxValue)
}

// 通过分析单场数据得出单场得分情况
const analyseSingleMatch = (match) => {
  let score = 100
  if (match['firstBloodKill']) {
    score += 10
  } // 一血 加10分
  if (match['firstBloodAssist']) {
    score += 5
  }// 一血助攻 加5分
  if (match['causedEarlySurrender']) {
    score -= 10
  } // 15投发起者 扣10分
  if (match['win']) {
    score += 5
  } else {
    score -= 5
  }// 游戏胜利 加5分
  score += match['doubleKills'] * 2 // 一次双杀加2分
  score += match['tripleKills'] * 5 // 一次三杀加5分
  score += match['quadraKills'] * 10 // 一次四杀加10分
  score += match['pentaKills'] * 15 // 一次五杀加15分
  score += (match['kills'] - match['deaths'])
  score += match['assists'] * 0.5
  return score
}
// 判断是否为 上等马或者下等马
const jundgeHorse = (score) => {
  if (score >= 120) {
    return appConfig.get('horseType.top')
  } else if (score >= 110) {
    return appConfig.get('horseType.mid')
  } else if (score >= 100) {
    return appConfig.get('horseType.bot')
  } else if (score < 100) {
    return appConfig.get('horseType.trash')
  }
}
// 判断玩家位置
const querySummonerPosition = (lane) => {
  switch (lane) {
    case 'MIDDLE' :
      return '中单';
    case 'JUNGLE' :
      return '打野';
    case 'BOTTOM' :
      return '下路';
    case 'TOP' :
      return '上单';
    case 'NONE':
      return '未知'
  }
  return '未知'
}

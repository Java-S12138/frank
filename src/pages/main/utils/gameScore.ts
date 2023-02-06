import {champDict} from "../resources/champList";
import {invokeLcu} from "../lcu";


// 查询当前游戏模式
export const queryCurrentGameMode = async () => {
  // todo dev game mode
  // return 420


  // 获取当前游戏模式信息
  const currentGameInfo = await invokeLcu('get', '/lol-gameflow/v1/session')
  try {
    return currentGameInfo.gameData.queue.id
  } catch (e) {
    return null
  }
}

// 获取最近的比赛记录
const getRencentMatchHistoty = async (summonerId: string,locale:string) => {
  const matchList = await invokeLcu('get', `/lol-match-history/v1/products/lol/${summonerId}/matches`, [0, 10])
  return locale === 'zh_CN' ? matchList['games']['games'].reverse() : matchList['games']['games']
}

// 查询比赛记录 (最近10场排位)
const queryMatchHistory = async (summonerId: string,locale:string) => {
  const currentGameMode = await queryCurrentGameMode()
  console.log('当前游戏模式:', currentGameMode)
  if (currentGameMode === null || currentGameMode === -1) {
    return await getRencentMatchHistoty(summonerId,locale)
  }

  let classicMode = []
  let matchCount = 0
  for (let i = 0; i < 100; i += 20) {
    const matchList = await invokeLcu('get', `/lol-match-history/v1/products/lol/${summonerId}/matches`, [i, i + 20])
    try {
      const forMatchList = locale === 'zh_CN' ? matchList['games']['games'].reverse() : matchList['games']['games']
      for (const matchListElement of forMatchList) {
        if (matchListElement.queueId === currentGameMode && matchCount < 10) {
          matchCount += 1
          classicMode.push(matchListElement)
        } else if (matchCount === 10) {
          return classicMode
        }
      }
    }catch (e) {
      continue
    }
  }
  return classicMode
}

// 获取召唤师游戏评分分数
export const getGameScore = async (summonerId: string,locale:string) => {
  let classicModeGames = await queryMatchHistory(summonerId,locale)
  const simpleMatchHistory = getSimpleMatchHistory(classicModeGames)
  let gameScore = 0
  let gameCount = classicModeGames.slice(0, 10).length
  let kdaHistory = ''
  for (const modeGame of classicModeGames.slice(0, 10)) {
    gameScore += analyseSingleMatch(modeGame.participants[0].stats)
    let tempKad = `${modeGame.participants[0].stats.kills}/${modeGame.participants[0].stats.deaths}/${modeGame.participants[0].stats.assists}  `
    kdaHistory += tempKad
  }
  gameScore = parseInt(String(gameScore / gameCount))
  return {
    score: isNaN(gameScore)===true ? 0 : gameScore,
    horse: jundgeHorse(gameScore),
    kdaHistory: kdaHistory==='' ? '无':kdaHistory,
    simpleMatchHistory: simpleMatchHistory
  }
}

// 获取简单的历史战绩信息
const getSimpleMatchHistory = (matchList: any) => {
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
const inferMatchWinRat = (arr: any) => {
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
const inferRegularPosition = (arr: any) => {
  if (!arr) return false
  if (arr.length === 1) return 1
  let res: any = {}
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
const analyseSingleMatch = (match: any) => {
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
const jundgeHorse = (score: number) => {
  const config = JSON.parse(<string>localStorage.getItem('config'))

  if (score >= 120) {
    return config.horseType.top
  } else if (score >= 110) {
    return config.horseType.mid
  } else if (score >= 100) {
    return config.horseType.bot
  } else if (score < 100) {
    return config.horseType.trash
  }
  return config.horseType.bot
}
// 判断玩家位置
const querySummonerPosition = (lane: any) => {
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

import {queryMatchHistory} from "@/utils/main/lcu";


// 获取召唤师游戏评分分数
export const getGameScore = async (credentials,summonerId) => {
    let classicModeGames = await queryMatchHistory(credentials,summonerId)
    let gameScore = 0
    let gameCount = classicModeGames.length
    let kdaHistory = ''
    for (const modeGame of classicModeGames) {
      gameScore += analyseSingleMatch(modeGame.participants[0].stats)
      let tempKad = `${modeGame.participants[0].stats.kills}/${modeGame.participants[0].stats.deaths}/${modeGame.participants[0].stats.assists}  `
      kdaHistory +=tempKad
    }
    gameScore = parseInt(gameScore/gameCount)
    return {score:gameScore,horse:jundgeHorse(gameScore),kdaHistory:kdaHistory}
}
// 通过分析单场数据得出单场得分情况
const analyseSingleMatch = (match) => {
  let score = 100
  if (match['firstBloodKill']){score+=10} // 一血 加10分
  if (match['firstBloodAssist']){score+=5}// 一血助攻 加5分
  if (match['causedEarlySurrender']){score-=10} // 15投发起者 扣10分
  if (match['win']){score+=5} else {score-=5}// 游戏胜利 加5分
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
  if (score>=120){
    return '上等马'
  }else if (score>=110){
    return '中等马'
  }else if(score>=100){
    return '下等马'
  }else if (score<100){
    return '小牛马'
  }
}

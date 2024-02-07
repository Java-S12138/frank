const iconDict:{ [key: string]: string } = {
  'assists':'助攻最多, 从不K头',
  'firstBlood':'第一滴血, 这局我Carry',
  'fiveKills':'五杀! Superexcellent',
  'fourKills':'四杀! Excellent',
  'god':'超神! So Easy',
  'goldEarned':'获得最多金币 So Rich',
  'kills':'击杀最多 是在下无敌啦',
  'mvp':'Most Valuable Player',
  'svp':'Super Valuable Player',
  'threeKills':'三杀! Good Job',
  'totalDamageDealtToChampions':'输出最高伤害 人称小代',
  'totalDamageTaken':'承伤最多的坦克爸爸',
  'totalMinionsKilled':'补刀最多 随便玩玩啦',
  'turretKills':'拆塔最多, 人在塔拆',
  'visionScore':'视野得分最高'
}

// 获取iconImgUrl
const getIconEle = (key:string) => {
  const imgUrl = new URL(`/src/assets/matchImage/${key}.png`, import.meta.url).href
  return [iconDict[key],imgUrl]
}
export const getIconImg = (iconList:string[],isMvp:boolean,isWin:boolean) => {
  const iconImgEle = iconList.map((icon) => {
    return getIconEle(icon)
  })
  if (isMvp && isWin){
    iconImgEle.unshift(getIconEle('mvp'))
  }else if (isMvp && !isWin){
    iconImgEle.unshift(getIconEle('svp'))
  }
  return iconImgEle
}

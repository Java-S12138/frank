// 英文段位昵称转中文
export const englishToChinese = (tier:string) => {
  switch (tier) {
    case 'CHALLENGER' :return '王者';
    case 'GRANDMASTER' :return '宗师';
    case 'MASTER' :return '大师';
    case 'DIAMOND' :return '钻石';
    case 'EMERALD' :return '翡翠';
    case 'PLATINUM' :return '铂金';
    case 'GOLD' :return '黄金';
    case 'SILVER' :return '白银';
    case 'BRONZE' :return '青铜';
    case 'IRON' :return '黑铁';
    default:return '未定级'
  }
}
// 处理段位数据
export const dealDivsion = (divsion:string) => {
  return divsion === 'NA'?'':divsion
}

// 根据游戏模式ID判断 游戏模式
export const queryGameType = (queueId:number) => {
  switch (queueId) {
    case 420 :
      return '单双排位';
    case 430 :
      return '匹配模式';
    case 440 :
      return '灵活排位';
    case 450 :
      return '极地乱斗';
    case 1700 :
      return '斗魂竞技';
  }
  return '其它模式'
}
// 判断localStorage是否存在某个值
export const isStoreageHas = (key:string,value:string) => {
  const storeageJson = JSON.parse(String(localStorage.getItem(key)))
  if (storeageJson === null){
    return false
  }
  if (value !== 'null' && storeageJson[value] === undefined){
    return false
  }
  return true
}

// 通过召唤师id获取召唤师图片地址
export const getspellImgUrl = (spellId:number) => {
  switch (spellId) {
    case 4:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_flash.png';
    case 14:return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerIgnite.png';
    case 11:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_smite.png';
    case 6:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_haste.png';
    case 12:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_teleport.png';
    case 21:return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerBarrier.png';
    case 3:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_exhaust.png';
    case 1:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_boost.png';
    case 7:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_heal.png';
    case 32:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_Mark.png'
    case 2201:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_teleport.png'
    case 2202:return 'https://game.gtimg.cn/images/lol/act/img/spell/Summoner_flash.png'
  }
  return 'https://game.gtimg.cn/images/lol/act/img/spell/SummonerMana.png'
}

// 获取icon元素
export const getIconEle = (key:string) => {
  return new URL(`/src/assets/matchImage/${key}.png`, import.meta.url).href
}

// 通过物品id获取图片地址
export const getItemImgUrl = (item:number) => {
  if (item == 0 ){
    // @ts-ignore
    return new URL("/src/assets/svg/image.png", import.meta.url).href
  }else {
    return `https://game.gtimg.cn/images/lol/act/img/item/${item}.png`
  }
}
// 判断玩家位置
export const querySummonerPosition = (lane:string):string => {
  switch (lane) {
    case 'MIDDLE' : return '中单';
    case 'JUNGLE' : return '打野';
    case 'BOTTOM' : return '下路';
    case 'UTILITY' : return '下路';
    case 'TOP' : return '上单';
    case 'NONE': return '未知'
    default:return '未知'
  }
}
// 获取位置序号, 方便排序
export const getPosition = (selectedPosition:string) => {
  switch (selectedPosition) {
    case 'BOTTOM': return 4;
    case 'JUNGLE': return 2;
    case 'TOP': return 1;
    case 'MIDDLE': return 3;
    case 'UTILITY': return 5;
    case 'NONE':return 0;
  }
}

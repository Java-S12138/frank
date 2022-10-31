// 英文段位昵称转中文
export const englishToChinese = (tier:string) => {
  switch (tier) {
    case 'CHALLENGER' :return '王者';
    case 'GRANDMASTER' :return '宗师';
    case 'MASTER' :return '大师';
    case 'DIAMOND' :return '钻石';
    case 'PLATINUM' :return '铂金';
    case 'GOLD' :return '黄金';
    case 'SILVER' :return '白银';
    case 'BRONZE' :return '青铜';
    case 'IRON' :return '黑铁';
  }
}
// 处理段位数据
export const dealDivsion = (divsion:string) => {
  return divsion === 'NA'?'':divsion
}

// 根据游戏模式ID判断 游戏模式
export const queryGameType = (queueId:number) => {
  switch (queueId) {
    case 420 : return '排位赛 单排/双排';
    case 430 : return '匹配模式';
    case 440 : return '排位赛 灵活排位';
    case 450 : return '极地大乱斗';
  }
  return '其它模式'
}

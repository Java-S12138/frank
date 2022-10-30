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

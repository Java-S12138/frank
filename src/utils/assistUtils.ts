// 转换百分数
export const toPercent = (point:number):string => {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}
// 获取当前日期
export const getLacalDateStr = ():number => {
  let currentDate = new Date()
  let dateList = currentDate.toLocaleDateString().split('/')
  dateList[1] = dateList[1].length == 1 ? '0' + dateList[1] : dateList[1]
  return parseInt(dateList.join('')) - 2
}
// 获取位置信息
const getPosition = (pos:string) => {
  switch (pos) {
    case 'middle':
      return '中单';
    case 'top':
      return '上单';
    case 'support':
      return '辅助';
    case 'jungle':
      return '打野';
    case 'bottom':
      return '射手';
    case 'aram':
      return '极地';
  }
}
// 获取图片地址
const getImaUrl = (imgId:string) => {
  return require(`../../assets/runes/${imgId}.png`)
}
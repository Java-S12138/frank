import {request} from "@/main/utils/request";
import {champDict} from "@/resources/champList";
import {ChampInfo} from "@/main/views/rank/rankTypes";
import {ConfigRank} from "@/background/utils/backgroundTypes";

export const rankOptions =  [
  {
    label: '国服排位英雄数据',
    key: 'CN'
  },
  {
    label: '韩服排位英雄数据',
    key: 'KR'
  }
]

export const cnOptions = [
  {
    label: '铂金•王者',
    value: 200
  },
  {
    label: '全部•段位',
    value: 999
  },
  {
    label: '王者•段位',
    value: 0
  },
  {
    label: '宗师•段位',
    value: 5
  },
  {
    label: '大师•段位',
    value: 6
  },
  {
    label: '钻石•段位',
    value: 10
  },
  {
    label: '翡翠•段位',
    value: 15
  },
  {
    label: '铂金•段位',
    value: 20
  },
  {
    label: '黄金•段位',
    value: 30
  },
  {
    label: '白银•段位',
    value: 40
  },
  {
    label: '黄铜•段位',
    value: 50
  },
  {
    label: '黑铁•段位',
    value: 80
  }
]

export const krOptions = [
  {
    label: '翡翠•王者',
    value: 2
  },
  {
    label: '钻石•王者',
    value: 13
  },
  {
    label: '大师•王者',
    value: 3
  },
  {
    label: '青铜•铂金',
    value: 1
  },
]

export const positionOptions = [
  {
    label: '上路',
    key: 'top'
  },
  {
    label: '打野',
    key: 'jungle'
  },
  {
    label: '中路',
    key: 'mid'
  },
  {
    label: '射手',
    key: 'bottom'
  },
  {
    label: '辅助',
    key: 'support'
  }
]

// 转换百分数
const toPercent = (point:number) => {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}

// 获取对于的位置
export const getPostion = (lane:string) => {
  switch (lane) {
    case lane = 'top':
      return '0'
    case lane = 'jungle':
      return '1'
    case lane = 'mid':
      return '2'
    case lane = 'bottom':
      return '3'
    case lane = 'support':
      return '4'
    default:
      return '2'
  }
}
// 获取当前日期
export const getLacalDateStr = () => {
  let currentDate = new Date()
  let dateList = currentDate.toLocaleDateString().split('/')
  dateList[1] = dateList[1].length == 1 ? '0' + dateList[1] : dateList[1]
  dateList[2] = dateList[2].length == 1 ? '0' + dateList[2] : dateList[2]
  return parseInt(dateList.join('')) - 1
}
// 获取国服英雄数据排行
export const queryCNServe = async (configRank:ConfigRank,tier:number, lane:string, time:number,recursionCount:number):Promise<null|[]|ChampInfo[]|undefined> => {
  if (recursionCount>10){
    return null
  }
  configRank.tier = tier
  localStorage.setItem('config',JSON.stringify(configRank))

  let championdetails = ''
  let champSliceList:any[] = []
  let partUrl = 'https://x1-6833.native.qq.com/x1/6833/1061021&3af49f?championid=666'
  const res = await request({
    url: partUrl + `&lane=${lane}&ijob=all&dtstatdate=${time}&gamequeueconfigid=420&tier=${tier}`,
    method: 'GET',
  })

  if (res.data.data.result === "") {
    recursionCount += 1
    return queryCNServe(configRank,tier, lane, time - 1,recursionCount)
  }

  try {
    championdetails = JSON.parse(res.data.data.result).championdetails
  } catch (e) {
    return champSliceList
  }

  let chapmDetailList = championdetails.split('#')
  for (const [index, chapmDetailListElement] of chapmDetailList.entries()) {
    let sliceIndex = chapmDetailListElement.indexOf('_[')
    let dataStr = index < 9 ? chapmDetailListElement.slice(2, sliceIndex) : chapmDetailListElement.slice(3, sliceIndex)
    let dataList = dataStr.split('_')

    champSliceList.push(<ChampInfo>{
      sortId: index,
      imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[dataList[0]]['alias']}.png`,
      name: champDict[dataList[0]]['label']+'•'+champDict[dataList[0]]['title'],
      tLevel: dataList[1],
      win: toPercent(parseFloat(dataList[2])),
      ban: toPercent(parseFloat(dataList[3])),
      appearance: toPercent(parseFloat(dataList[4])),
      champId: Number(dataList[0])
    })
  }
  return champSliceList
}

// 查询韩服数据
export const queryKRServe = async (configRank:ConfigRank,tier:number,lane:string,version:string) => {
  configRank.tier = tier
  localStorage.setItem('config',JSON.stringify(configRank))
  try {
    const url = `https://lol.ps/api/statistics/tierlist.json?region=0&version=${version}&tier=${tier}&lane=${lane}`
    const res = await request({
      url:url,
      method:"GET"
    })
    const champList:ChampInfo[] = res.data.data.reduce((res:any,item:any,index:number) => {

      const currentChamp:ChampInfo = {
        appearance: Number(item.pickRate).toFixed(1) +'%',
        ban: Number(item.banRate).toFixed(1) +'%',
        champId: item.championId,
        imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
        name: champDict[item.championId]['label']+'•'+champDict[item.championId]['title'],
        tLevel: item.isOp === true ? '0' : item.opTier,
        win: Number(item.winRate).toFixed(1) +'%',
        sortId: index
      }
      return res.concat(currentChamp)
    },[])
    return champList
  }catch (e) {
    return null
  }
}

// 获取英雄反制数据
export const getRestraintData = async (champId:number, lane:string,tier:number,is101:boolean,version:string) => {
  let tierRes = 2

  const position = getPostion(lane)
  if (!is101){
    tierRes = tier
  }
  const url = `https://lol.ps/api/champ/${champId}/versus.json?region=0&version=${version}&tier=${tierRes}&lane=${position}`
  const result = await request({
    'url': url,
    method: 'GET'
  })

  if (result.data.data == null || result.status !== 200){
    return null
  }

  const resList:[string,string,number,number,number][] = []
  const counterChampionIdList = JSON.parse(result.data.data['counterChampionIdList'])
  const counterWinrateList = JSON.parse(result.data.data['counterWinrateList'])
  const counterCountList = JSON.parse(result.data.data['counterCountList'])
  for (let i = 0; i < counterChampionIdList.length; i++) {
    const chapmId:number = counterChampionIdList[i]
    const label = champDict[chapmId].label +'•' + champDict[chapmId].title
    const imgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[chapmId].alias}.png`
    const winRate:number = counterWinrateList[i]
    const countMatch:number = counterCountList[i]
    resList.push([label, imgUrl, winRate,chapmId,countMatch])
  }
  return resList
}

import {request} from "@/main/utils/request";
import {champDict} from "@/resources/champList";
import {ChampInfo} from "@/main/pages/assist/views/rank/rankTypes";
import {ConfigRank} from "@/background/utils/configTypes";

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
      champId: dataList[0]
    })
  }
  return champSliceList
}

// 查询韩服数据
export const queryKRServe = async (configRank:ConfigRank,tier:number,lane:string) => {
  configRank.tier = tier
  localStorage.setItem('config',JSON.stringify(configRank))
  try {
    const url = `https://lol.ps/api/statistics/tierlist.json?region=0&version=88&tier=${tier}&lane=${lane}`
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

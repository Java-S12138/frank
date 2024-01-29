import {request} from "@/main/utils/request"
// @ts-ignore
import _orderBy from "lodash/orderBy";
import {flatRunes} from './runes'
import {champDict} from "@/resources/champList";

const parseCode = (string:any) => {
  try {
    const [result] = string.match(/{"(.*)"}/);
    const data = JSON.parse(result)
    return data;
  } catch (error:any) {
    throw new Error(error);
  }
};

const getStyleId = (i:any) => {
  let result = null;
  for (const [mId, ids] of flatRunes) {
    if (+i === +mId) {
      result = +i;
      break;
    }

    if (ids.includes(+i)) {
      result = +mId;
      break;
    }
  }
  return result;
};

const isDifferentStyleId = (a:any, b:any) => {
  if (!a || !b) {
    return false;
  }

  const idA = getStyleId(a);
  const idB = getStyleId(b);
  const notSame = idA !== idB;

  return idA && idB && notSame;
}

const makePerkData = (perk:any, champion:string, position:string) => {
  const { runes,igamecnt } = perk;
  const data = runes.reduce(
    ({ primaryStyleId, subStyleId }:any, i:any) => {
      if (!primaryStyleId) {
        primaryStyleId = getStyleId(+i);
      }
      if (primaryStyleId && !subStyleId) {
        const isStyleId = isDifferentStyleId(+primaryStyleId, +i);
        if (isStyleId) {
          subStyleId = getStyleId(+i);
        }
      }
      return {
        primaryStyleId,
        subStyleId,
      };
    },
    {
      primaryStyleId: ``,
      subStyleId: ``,
    },
  );
  if (position==='mid'){
    position = 'middle'
  }
  const runeList:number[] = runes.map((i:string) => {
    if (i === '0'){
      i = '5001'
    }
    return Number(i)
  })
  data.selectedPerkIds = runeList.slice(0,9)
  data.alias = champion;
  data.position = position;
  data.pickCount = igamecnt;
  return data;
};

export const get101Runes = async (champId:string|number) => {
  const url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${champId}.js`
  const res = await request({
    method:"GET",
    url:url
  })
  const jsonRes = parseCode(res.data)
  const perks:any = Object.values(jsonRes.list.championLane).reduce((res:any, l:any) => {
    if (l.hold3 !==''){
      const perkDetail =  JSON.parse(l.perkdetail);
      const position = l.lane;
      const pData:any = Object.values(perkDetail).reduce((result:any, i:any) => {
        const vals = Object.values(i).map(({ perk,...rest }:any) => ({
          runes: perk.split(`&`),
          ...rest,
        }));
        return result.concat(vals);
      }, []);

      const sorted = _orderBy(pData, (i:any) => i.igamecnt, [`desc`]);

      var pages:any = sorted.slice(0, 2).map((i:any) => makePerkData(i, champDict[champId].alias, position));
    }
    return res.concat(pages);
  }, []);
  // @ts-ignore
  return _orderBy(perks.filter(x=>!!x==true), `pickCount`, [`desc`]);
}

// @ts-ignore
import _orderBy from "lodash/orderBy";
import {flatRunes} from './runes'
import {champDict} from "@/resources/champList";
import {fetch} from "@tauri-apps/plugin-http";

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
  if (position === 'mid'){
    position = 'middle'
  }
  data.selectedPerkIds = runes
  data.alias = champion;
  data.position = position;
  data.pickCount = igamecnt;
  return data;
};

export const get101Runes = async (champId:string|number) => {
  const url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${champId}.js`

  const res = await fetch(url, {method:'GET'})
  const data = await res.text()

  if (res.status !== 200) {return null}
  const jsonRes = parseCode(data)
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

      const filteredData = sorted.filter((item: { runes: any[]; }) => {
        const valueAtIndex4 = Number(item.runes[4]);
        return valueAtIndex4 >= 6000;
      })

      const pages:any = filteredData.slice(0, 2).map((i:any) => makePerkData(i, champDict[champId].alias, position));
      return res.concat(pages);
    }
    return res;
  }, []);
  // @ts-ignore
  return _orderBy(perks.filter(x=>!!x==true), `pickCount`, [`desc`]);
}

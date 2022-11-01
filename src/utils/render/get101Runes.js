import {request} from "@/utils/render/request";
import _orderBy from "lodash/orderBy";
import {flatRunes} from '@/utils/render/runes'
import {champDict} from "@/utils/render/lolDataList";

const parseCode = (string) => {
  try {
    const [result] = string.match(/{"(.*)"}/);
    const data = JSON.parse(result)
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getStyleId = (i) => {
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

const isDifferentStyleId = (a, b) => {
  if (!a || !b) {
    return false;
  }

  const idA = getStyleId(a);
  const idB = getStyleId(b);
  const notSame = idA !== idB;

  return idA && idB && notSame;
}

const makePerkData = (perk, champion, position) => {
  const { runes,igamecnt } = perk;
  const data = runes.reduce(
    ({ primaryStyleId, subStyleId }, i) => {
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

  data.selectedPerkIds = runes.map(Number);
  data.alias = champion;
  data.position = position;
  data.pickCount = igamecnt;
  return data;
};

export const get101Runes = async (champId) => {
  const url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${champId}.js`
  const res = await request({
    method:"GET",
    url:url
  })
  const jsonRes = parseCode(res.data)
  const perks = Object.values(jsonRes.list.championLane).reduce((res, l) => {
    if (l.hold3 !==''){
      const perkDetail =  JSON.parse(l.perkdetail);
      const position = l.lane;
      const pData = Object.values(perkDetail).reduce((result, i) => {
        const vals = Object.values(i).map(({ perk,...rest }) => ({
          runes: perk.split(`&`),
          ...rest,
        }));
        return result.concat(vals);
      }, []);

      const sorted = _orderBy(pData, (i) => i.igamecnt, [`desc`]);
      var pages = sorted.slice(0, 2).map((i) => makePerkData(i, champDict[champId].alias, position));
    }
    return res.concat(pages);
  }, []);

  return _orderBy(perks.filter(x=>!!x==true), `pickCount`, [`desc`]);
}

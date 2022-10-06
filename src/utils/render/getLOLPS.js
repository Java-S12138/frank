// 数据来源 :https://lol.ps/
import {request} from "@/utils/render/request";
import {champDict} from "@/utils/render/lolDataList";

export const queryKoreaServe = async (tier,lane) => {
  const url = `https://lol.ps/lol/get_lane_champion_tier_list/?region=0&tier=${tier}&lane=${lane}&region=0&order_by=-op_score`
  const res = await request({
    url:url,
    method:"GET"
  })

  const champList = res.data.results.reduce((res,item,index) => {
    const currentChamp = {
      appearance:  toPercent(item.pick_rate),
      ban: toPercent(item.ban_rate),
      champId: item.champion__data_key,
      imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.champion__data_key)].alias}.png`,
      name: item.champion__name_cn,
      tLevel: `${item.op_tier-1}`,
      win: toPercent(item.win_rate),
      sortId: index
    }
    return res.concat(currentChamp)
  },[])
  return champList
}
const toPercent = (point) => {
  var str = Number(point).toFixed(1);
  str += "%";
  return str;
}

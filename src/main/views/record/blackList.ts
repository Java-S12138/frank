import {findHaterByHaterId, findPlayerByPlayerId} from "@/main/utils/request";
import {ExsitDataTypes, HateIdListType, Hater} from "./blackListTypes";
import {sumInfoTypes} from "@/background/utils/backgroundTypes";

class BlackList {
  public sumInfo:sumInfoTypes = JSON.parse(localStorage.getItem('sumInfo') as string)

  // 从本地查询黑名单列表
  public queryBlacklist = async (cubeUserId:string):Promise<string[]|null> => {
    const res = await findPlayerByPlayerId({
      url:`/player/findPlayerByPlayerId?playerId=${cubeUserId}`,
      method:'GET'
    })
    if (res === null){
      return null
    }
    // 查询当前大区是否存在数据
    const haterIdList:HateIdListType = JSON.parse(res.haterIdList)
    const haterList = haterIdList[this.sumInfo.platformId]

    if (haterList === undefined){
      return null
    }else {
      // 如果存在数据，判断是否为当前召唤师的数据
      const existData:undefined|ExsitDataTypes = haterList[this.sumInfo.summonerId]
      if (existData === undefined){
        return null
      }
      return existData.sumIdList
    }
  }
  // 通过summonerId获取黑名单数据
  public querySumDetails = async (sumIdList:string[]):Promise<Hater[]|null> => {
    const res = await findHaterByHaterId({
      url:'/hater/findHaterBySumId',
      data:{'sumIdList':sumIdList,'area':this.sumInfo.platformId},
      method:'POST'
    })
    if (res === null){
      return null
    }
    return res
  }
}

export default BlackList

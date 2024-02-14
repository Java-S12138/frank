import {findHaterByHaterId, findPlayerByPlayerId, updatePlayerRecord} from "@/main/utils/request";
import {ExsitDataTypes, HateIdListType, Hater, UserInfos} from "./blackListTypes";
import {sumInfoTypes} from "@/background/utils/backgroundTypes";

class BlackList {
  public sumInfo:sumInfoTypes|null = null

  // 从本地查询黑名单列表
  public queryBlacklist = async (cubeUserId:string):Promise<[string[],UserInfos]|null> => {
    this.sumInfo = this.sumInfo || JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

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
      return [[],res]
    }else {
      // 如果存在数据，判断是否为当前召唤师的数据
      const existData:undefined|ExsitDataTypes = haterList[this.sumInfo.summonerId]
      if (existData === undefined){
        return [[],res]
      }
      return [existData.sumIdList,res]
    }
  }
  // 通过summonerId获取黑名单数据
  public querySumDetails = async (sumIdList:string[]):Promise<Hater[]|null> => {
    this.sumInfo = this.sumInfo|| JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes
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
  // 更新user过期的数据
  public updateUserInfo = async (userInfos:UserInfos,newSumId:string[]) => {
    this.sumInfo = this.sumInfo|| JSON.parse(localStorage.getItem('sumInfo') as string) as sumInfoTypes

    const haterIdListObj = JSON.parse(userInfos.haterIdList)
    haterIdListObj[this.sumInfo.platformId][this.sumInfo.summonerId].sumIdList = newSumId
    return await updatePlayerRecord({
      url: '/player/updatePlayer',
      method: 'PUT',
      data: {
        ID: userInfos.ID,
        CreatedAt: userInfos.CreatedAt,
        playerId: userInfos.playerId,
        haterIdList: JSON.stringify(haterIdListObj)
      }
    })
  }
}

export default BlackList

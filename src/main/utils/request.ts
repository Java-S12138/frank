import axios from "axios";
import {BlacklistListTypes, Hater, UserInfos} from "@/main/views/record/blackListTypes";

export const request = axios.create({
  timeout: 9999
})

const blacklistServe = (config: any): Promise<any | null> => {
  return cube.net.sendHttpRequest('http://121.40.58.64:8412' + config.url,
    {method: config.method, body: JSON.stringify(config?.data)}
  ).then((res) => {
    if (res.status === 200) {
      return JSON.parse(res.data)
    } else {
      return null
    }
  }).catch(() => null)
}


export const findPlayerByPlayerId = async (config: any): Promise<null | UserInfos> => {
  const res = await blacklistServe(config)
  if (res === null || res.code !== 0) {
    return null
  }
  return res.data
}

export const findHaterByHaterId = async (config: any): Promise<null | Hater[]> => {
  const res = await blacklistServe(config)
  if (res === null || res.code !== 0) {
    return null
  }
  return res.data
}
export const findBlacklistByHId = async (config: any): Promise<null | BlacklistListTypes> => {
  const res = await blacklistServe(config)
  if (res === null || res.code !== 0) {
    return null
  }
  return res.data
}

const handleRequest = (res:any)  => {
  if (res === null || res.code !== 0) {
    return false
  }
  return true
}

export const reviseHaterContent = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  return handleRequest(res)
}
export const deleteBlacklist = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  return handleRequest(res)
}
export const deleteHater = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  return handleRequest(res)
}
export const createHaterContent = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  return handleRequest(res)
}
export const updatePlayerRecord = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  return handleRequest(res)
}

import axios from "axios";
import {Hater, UserInfos} from "@/main/views/record/blackListTypes";

export const request = axios.create({
  timeout: 9999
})

const blacklistServe = (config: any): Promise<any | null> => {
  return cube.net.sendHttpRequest('http://127.0.0.1:8412' + config.url,
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
export const reviseHaterContent = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  if (res === null || res.code !== 0) {
    return false
  }
  return true
}
export const deleteHaterContent = async (config: any): Promise<boolean> => {
  const res = await blacklistServe(config)
  if (res === null || res.code !== 0) {
    return false
  }
  return true
}

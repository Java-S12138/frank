import {ConfigRank, ConfigSettingTypes} from "../types";
import {invokeLcu} from "@/lcu";

const configSetting: ConfigSettingTypes = {
  'autoPickChampion': {
    championId: "157",
    isAuto: false
  },
  'autoBanChampion': {
    championId: "101",
    isAuto: false
  },
  'autoIsOne':true,
  'autoAccept': 50,
  'theme': 'light',
  'isGameInWindow':true,
  'isGameInTips':false,
  'autoWriteBlock':true,
  'inWinOpacity':100,
  'warmTips':{
    autoRune:false
  }
}


const configRank: ConfigRank = {
  'tier': 200,
  'lane': 'mid',
  'is101': true,
}

const addConfig = (configName:string,configObj:any) => {
  const localS = JSON.parse(<string>(localStorage.getItem(configName)))
  if (Object.keys(localS).length === Object.keys(configObj).length){
    return
  }

  for (const configKey of Object.keys(configObj)) {
    if (!localS.hasOwnProperty(configKey)) {
      // @ts-ignore
      localS[configKey] = configObj[configKey]
      localStorage.setItem(configName, JSON.stringify(localS))
    }
  }
}

export const configInit = () => {
  if (localStorage.getItem('configSetting') === null) {
    localStorage.setItem('configSetting', JSON.stringify(configSetting))
    localStorage.setItem('configRank', JSON.stringify(configRank))
  } else {
    addConfig('configSetting',configSetting)
    addConfig('configRank',configRank)
  }
}

export const getClientPath = async () => {
  const clientPath = await invokeLcu<string | null>('get', '/data-store/v1/install-dir');

  if (clientPath === null) return false;  // 早期返回，避免后续代码执行

  const storedPath = localStorage.getItem('clientPath');
  const updatedPath = clientPath.replace('LeagueClient', 'TCLS\\client.exe');

  // 只在路径不一致时更新
  if (storedPath?.toLowerCase() !== updatedPath.toLowerCase()) {
    localStorage.setItem('clientPath', updatedPath);
  }
  return true
}





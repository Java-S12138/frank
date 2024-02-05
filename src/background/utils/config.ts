import {ConfigRank, ConfigSettingTypes} from "./backgroundTypes";

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
}


const configRank: ConfigRank = {
  'tier': 2,
  'lane': 'mid',
  'is101': false,
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


if (localStorage.getItem('init') === null) {
  localStorage.setItem('init', 'SYJun')
  localStorage.setItem('configSetting', JSON.stringify(configSetting))
  localStorage.setItem('configRank', JSON.stringify(configRank))
} else {
  addConfig('configSetting',configSetting)
  addConfig('configRank',configRank)
}


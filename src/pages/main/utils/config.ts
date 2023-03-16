export const config: any = {
  'autoPickChampion': {
    championId: "157",
    isAuto: false
  },
  'autoBanChampion': {
    championId: "101",
    isAuto: false
  },
  'autoAccept': 50,
  'horseColor': {
    'topHorse': '#7BD9A5',
    'midHorse': '#F9C97D',
    'bottomHorse': '#77C1F7',
    'trashHorse': '#F17D7D',
  },
  'horseType': {
    'top': '锋芒毕露',
    'mid': '驰骋沙场',
    'bot': '浑水摸鱼',
    'trash': '操作抽象',
  },
  'champRankOption': {
    'tier': 2,
    'lane': 'mid'
  },
  'isSwitchBlacklist': true,
  'runeType': '韩服数据',
  'isGameInWindow': true,
  'is101': false,
  'isJungleTime': false,
  'isAutoLaunchGame':true,
  'currentArea':'t_1',
  'autoWriteBlock':true,
  'showMatchDetail':true
}

if (localStorage.getItem('config') === null) {
  localStorage.setItem('config', JSON.stringify(config))
} else {
  const localS = JSON.parse(<string>(localStorage.getItem('config')))
  for (const configKey of Object.keys(config)) {
    if (!localS.hasOwnProperty(configKey)) {
      localS[configKey] = config[configKey]
      localStorage.setItem('config', JSON.stringify(localS))
    }
  }
}

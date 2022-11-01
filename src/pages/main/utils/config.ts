 export const config= {
  'autoPickChampion': {
    championId: "157",
    isAuto: false
  },
  'autoBanChampion': {
    championId: "101",
    isAuto: false
  },
  'autoAccept': 50,
  'horseColor':{
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
    'tier': 200,
    'lane': 'mid'
  },
  'isSwitchBlacklist': true,
  'blacklist': {},
  'runeType': '国服数据',
  'isAutoDeleteWGProcess': false,
  'is101': true
}
if (localStorage.getItem('config')===null){
  localStorage.setItem('config',JSON.stringify(config))
}

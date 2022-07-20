import Store from 'electron-store'

export const appConfig = new Store({
  defaults: {
    'userInfo':{
      name:'',
      area:1,
    },
    'autoPickChampion':{
      championId:"157",
      isAuto:false
    },
    'autoBanChampion':{
      championId:"101",
      isAuto:false
    },
    'autoRune':{},
    'credentials':{"port": ""},
    'gameDirectory':'',
    'autoAccept':50,
    'topHorse' :'#7BD9A5',
    'midHorse' :'#F9C97D',
    'bottomHorse' :'#77C1F7',
    'trashHorse' :'#F17D7D',
    'isRecommend':true,
    'horseType':{
      'top':'锋芒毕露',
      'mid':'驰骋沙场',
      'bot':'浑水摸鱼',
      'trash':'操作抽象',
    }
  }
})
import Store from 'electron-store'

export const appConfig = new Store({
  defaults: {
    'assistWindowPosition':{
      x:0,
      y:0,
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
    'credentials':{'port': ''},
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
    },
    'champRankOption':{
      'tier':200,
      'lane':'mid'
    },
    'isSwitchBlacklist':true,
    'blacklist':{},
    'runeType':'国服数据',
    'isAutoDeleteWGProcess':false,
    'is101':true
  }
})

export const userAgentList = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E216 MicroMessenger/7.0.18(0x1700122f) NetType/4G Language/zh_CN',
  'Mozilla/5.0 (Linux; Android 9; LYA-AL00 Build/HUAWEILYA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/12.4 SP-engine/2.25.0 baiduboxapp/12.4.0.11 (Baidu; P1 9) NABar/1.0',
  'Mozilla/5.0 (Linux; Android 11; Redmi K30 Pro Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/12.4 SP-engine/2.25.0 baiduboxapp/12.4.0.11 (Baidu; P1 11) NABar/1.0',
  'Mozilla/5.0 (Linux; Android 10; TNY-AL00 Build/HUAWEITNY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045415 Mobile Safari/537.36 MMWEBID/6965 MicroMessenger/7.0.20.1781(0x2700143F) Process/tools WeChat/arm64 NetType/4G Language/zh_HK ABI/arm64',
  'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; LDN-AL00 Build/HUAWEILDN-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.8 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 8.1.0; JSN-AL00a Build/HONORJSN-AL00a; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/12.4 SP-engine/2.25.0 baiduboxapp/12.4.0.11 (Baidu; P1 8.1.0) NABar/1.0',
  'Mozilla/5.0 (Linux; Android 10; M2007J1SC Build/QKQ1.200419.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/12.4 SP-engine/2.25.0 baiduboxapp/12.4.0.11 (Baidu; P1 10) NABar/1.0',
  'Mozilla/5.0 (Linux; U; Android 10; zh-cn; LIO-AL00 Build/HUAWEILIO-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/11.0 Mobile Safari/537.36 COVC/045429',
  'Mozilla/5.0 (Linux; Android 10; HD1900 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/12.4 SP-engine/2.25.0 baiduboxapp/12.4.0.11 (Baidu; P1 10) NABar/1.0',
  'Mozilla/5.0 (Linux; U; Android 11; zh-cn; Mi 10 Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.3.20'
]

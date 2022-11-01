# Frank Project Introduction
<img src="https://camo.githubusercontent.com/163c90665dcebea8429b19f75a086ac3f405baa7e9eaafbb47165cd3e110601e/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032322f706e672f32393438333939362f313635363932363635383433312d34623230306564652d336364652d343661392d626265662d6138323030653333646539302e706e67" height="400" /> 

> ❤️ [使用教程](https://www.yuque.com/java-s/frank/introduction)
🫰 [提供建议](https://www.yuque.com/java-s/frank/proposal)
🚨[反馈BUG](https://www.yuque.com/java-s/frank/bug)
🚩[软件下载](https://www.yuque.com/java-s/frank/introduction#dZwDV)
📺[视频介绍](https://www.bilibili.com/video/BV1nU4y1D7FQ)

## 项目介绍
> Frank是一款基于Electron20+Vue3, 开发的一款桌面应用程序,主要功能如下所示:

💡 	自动启动游戏 | 排位分查询 | 英雄熟练度展示 | 秒选英雄 | 秒禁英雄 | 自动接受对局 | 国服数据排行榜

💡	查看英雄对位压制 | 查看英雄优势对线 | 符文配置 | 自动配置符文 | 匹马信息可视化展示

💡	发送匹马信息到聊天界面 | 查看召唤师战绩 | 查看召唤师绝活英雄 | 查看召唤师战绩详情

 💡 排位笔记 | 查看永恒星碑 | 查询(隐藏)战绩

💡  软件如果可以启动, 但是无法正常使用请到Feedback页面查看原因 [链接](https://www.yuque.com/java-s/frank/bug)👈

🚨   Frank不要和WeGame同时使用, 会有几率封号

🚨   如果你的电脑是wegame强制登录英雄联盟客户端

🚨   使用wegame登录游戏后,退出wegame即可, 然后管理员权限打开Frank

> 🤤下载完成后, 双击 Frank Setup.exe安装到本地
> 打开的时候, 右键管理员权限打开


## 软件首页
|                                      个人生涯                                      |                                      英雄数据                                      |                                      永恒星碑                                      |
|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
| <img src="https://img1.imgtp.com/2022/09/02/x9UE1aN6.png" width="320" alt=""/> | <img src="https://img1.imgtp.com/2022/09/02/QhEUihjj.png" width="320" alt=""/> | <img src="https://img1.imgtp.com/2022/09/02/tXeyTPos.png" width="320" alt=""/> |

## 助手窗口
|                                      英雄排行                                      |                                      英雄反制                                      |                                      符文配置                                      |
|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
| <img src="https://img1.imgtp.com/2022/09/02/6uM7LjCu.png" width="320" alt=""/> | <img src="https://img1.imgtp.com/2022/09/02/ImlBxCLt.png" width="320" alt=""/> | <img src="https://img1.imgtp.com/2022/09/02/W4pj9ogG.png" width="320" alt=""/> |

## 查询战绩

![Snipaste_2022-09-02_21-54-14.png](https://img1.imgtp.com/2022/09/02/OB1a3r66.png)

![Snipaste_2022-09-02_22-01-09.png](https://img1.imgtp.com/2022/09/02/Dcvu3uRA.png)

![屏幕截图 2022-09-02 220049.png](https://img1.imgtp.com/2022/09/02/p2xpz1m8.png)




## Project setup

> 管理员权限启动项目, 或者打开IDE的时候选择管理员权限打开

```
yarn install

electron 可能会安装失败, 执行下列命令后, 再次执行yarn install
yarn config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
```

### 启动项目
```
yarn electron:serve
```

### 编译项目
```
yarn electron:build
```
## 目录结构
```
├─frankElectron
│      assist.js 助手窗口
│      home.js   首页窗口
│      index.js  暴露函数
│      listenCommonIpc.js 共用的监听
│      makeTray.js        系统托盘
│      matchHistory.js    历史战绩窗口
│      queryMatch.js      查询战绩窗口
│      
├─resources
│      app-icon.png  项目图标
│      riotgames.pem HTTP2验证文件
│      
└─src
    │  background.js 主进程
    │  
    ├─render         渲染进程
    │  │  App.vue
    │  │  main.js
    │  │  
    │  ├─assets      资源文件
    │  │          
    │  ├─components
    │  │  ├─assist   助手窗口
    │  │  │      addBlacklist.vue
    │  │  │      assistWindow.vue
    │  │  │      blacklist.vue
    │  │  │      blacklistContent.vue
    │  │  │      champRank.vue
    │  │  │      pickSummoner.vue
    │  │  │      restraint.vue
    │  │  │      rune.vue
    │  │  │      
    │  │  ├─home  首页窗口
    │  │  │      appMain.vue
    │  │  │      dashboard.vue
    │  │  │      fbottom.vue
    │  │  │      index.vue
    │  │  │      realPower.vue
    │  │  │      setting.vue
    │  │  │      
    │  │  ├─matchHistory  历史战绩窗口
    │  │  │      barKDA.vue
    │  │  │      gameDetails.vue
    │  │  │      index.vue
    │  │  │      leftCard.vue
    │  │  │      standing.vue
    │  │  │      
    │  │  └─queryMatch   查询战绩窗口
    │  │          dashboard.vue
    │  │          gameDetails.vue
    │  │          index.vue
    │  │          matchDetailed.vue
    │  │          personalGameDetails.vue
    │  │          recentEchart.vue
    │  │          summonerInfo.vue
    │  │          
    │  ├─directives    窗口拖动
    │  │      index.js
    │  │      mouseDrag.js
    │  │      
    │  ├─router       路由文件
    │  │      index.js
    │  │      
    │  └─store        状态管理 pinia
    │          index.js
    │          
    └─utils
        ├─league-connect       连接英雄联盟客户端
        │      authentication.js
        │      client.js
        │      http.js
        │      http2.js
        │      index.js
        │      request.js
        │      request_deprecated.js
        │      websocket.js
        │      
        ├─main                主进程工具函数
        │      clientStart.js
        │      config.js
        │      gameScore.js
        │      lcu.js
        │      queryDetailedGame.js
        │      
        └─render              渲染进程工具函数
                blacklistUtils.js
                echarts.js
                getUserInfo.js
                lolDataList.js
                matchHistoryLcu.js
                queryMatchLcu.js
                renderLcu.js
                request.js
                RIOT.js
```

## 🔋 JetBrains 开源证书支持

`Frank` 项目一直以来都是在 JetBrains 公司旗下的 WebStorm 集成开发环境中进行开发，基于 **free JetBrains Open Source license(s)** 正版免费授权，在此表达我的谢意。

<a href="https://www.jetbrains.com/" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/jetbrains/jetbrains-variant-4.png" width="250" align="middle"/></a> 
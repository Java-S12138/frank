<img src="https://cdn.nlark.com/yuque/0/2022/png/29483996/1656926658431-4b200ede-3cde-46a9-bbef-a8200e33de90.png" height="400" /> 

> ❤️ [使用教程](https://www.yuque.com/java-s/frank/introduction) 
🫰 [提供建议](https://www.yuque.com/java-s/frank/proposal) 
🚨[反馈BUG](https://www.yuque.com/java-s/frank/bug)
🚩[软件下载](https://www.yuque.com/java-s/frank/introduction#dZwDV) 

## 项目介绍
> Frank基于[Electron](https://github.com/electron/electron)与[Vue3](https://github.com/vuejs/core)开发, 主要功能如下所示:

💡 	自动启动游戏 | 隐藏分查询 | 真实实力分析 | 秒选英雄 | 秒禁英雄 | 自动接受对局 | 国服数据排行榜

💡	查看英雄对位压制 | 查看英雄优势对线 | 符文配置 | 自动配置符文 | 匹马信息可视化展示

💡	发送匹马信息到聊天界面 | 查看召唤师战绩 | 查看召唤师绝活英雄 | 查看召唤师战绩详情



## 安装项目
```
yarn install

若安装失败，请尝试更换国内 npm 源后重试，更换淘宝 npm 源：
yarn config set ELECTRON_MIRROR https://npmmirror.com/
```

## 启动项目
```
yarn electron:serve
```

## 编译项目
```
yarn electron:build
```
## 目录结构
```
project
│
├─resources
│      app-icon.png  项目图标
│      riotgames.pem HTTP2验证文件
└─src
    │─background.js 主进程
    │
    ├─render 渲染进程
    │  │  App.vue
    │  │  main.js
    │  │
    │  ├─assets 资源
    │  │  ├─css
    │  │  ├─fonts
    │  │  ├─icon
    │  │  ├─runes 符文图标
    │  │  └─tLevel英雄梯度图标
    │  │
    │  ├─components 组件
    │  │  ├─assist 助手
    │  │  │      assistWindow.vue 助手组件入口文件
    │  │  │      champRank.vue    国服榜单页面
    │  │  │      rune.vue         符文配置页面
    │  │  │
    │  │  ├─home 主页
    │  │  │      appMain.vue 首页
    │  │  │      dashboard.vue header
    │  │  │      fbottom.vue bottom
    │  │  │      index.vue 主页组件入口文件
    │  │  │      realPower.vue 真实实力分析
    │  │  │      setting.vue 设置界面
    │  │  │
    │  │  └─matchHistory 战绩查询
    │  │         barKDA.vue 匹马信息可视化图表
    │  │         gameDetails.vue 游戏对局详细数据
    │  │         index.vue 战绩查询组件入口文件
    │  │         leftCard.vue 左侧召唤师基本信息
    │  │         standing.vue 召唤师历史战绩
    │  │
    │  ├─directives 窗口拖动
    │  │
    │  ├─router 路由
    │  │
    │  └─store pinia
    │
    └─utils
        ├─league-connect 连接英雄联盟客户端
        │
        ├─main 主进程工具函数
        │
        └─render 渲染进程工具函数
```


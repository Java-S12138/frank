<script setup lang="ts">
import {NCard,NSpace,NTag, NDropdown, useMessage, NButton,NTable} from 'naive-ui'

const message = useMessage()
const options = [
  {
    label: '启动国服',
    key: 54261
  },
  {
    label: '启动台服',
    key: 65131
  },
  {
    label: '其它地区',
    key: 10086
  },
]

const startGame = (gameId:number) => {
  if (gameId===10086){
    message.warning('请手动启动客户端', {duration: 5000})
    return
  }
  cube.utils.launchGame(gameId).then(() => {
    message.loading('英雄联盟客户端启动中...', {duration: 5000})
  }).catch(() => {
    message.error('台服客户端不存在`(*>﹏<*)′')
  })
}
const openGuideSite = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank')
}
const openIntro = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/proposal')
}

const tableData = [
  ["秒选英雄 / 秒禁英雄", "✅", "✅"],
  ["自动接收对局", "❌", "✅"],
  ["查询召唤师战绩", "✅", "✅"],
  ["对局详细数据", "❌", "✅"],
  ["国服 / 韩服 英雄数据", "✅", "✅"],
  ["队友战绩数据分析", "❌", "✅"],
  ["游戏内显示敌方数据", "✅", "✅"],
  ["绝活/熟练/小代 检测", "❌", "✅"],
]
</script>

<template>
  <n-card class="shadow" size="small">
    <div  class="spinnerDiv">
      <div class="spinner"></div>
    </div>
    <n-space vertical>
      <n-space justify="space-between">
        <n-button type="success" @click="openGuideSite" secondary>使用手册</n-button>
        <n-dropdown trigger="click" :options="options" @select="startGame">
          <n-button type="success">开始游戏</n-button>
        </n-dropdown>
      </n-space>
      <n-tag  type="success" size="small" style="width: 203px;justify-content: center"
              :bordered="false">
        <p>进入LOL大厅后•自动获取数据</p>
      </n-tag>
    </n-space>
  </n-card>
  <n-card class="shadow mt-4" size="small">
    <n-table :bordered="false" :single-line="false">
      <thead>
      <tr>
        <th>Software Introduction </th>
        <th style="width: 28px;">普通</th>
        <th style="width: 28px;">订阅</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in tableData" :key="index">
        <td>{{ row[0] }}</td>
        <td style="padding-left: 16px">{{ row[1] }}</td>
        <td style="padding-left: 16px">{{ row[2] }}</td>
      </tr>
      </tbody>
    </n-table>
    <n-space style="margin-top: 21px;" justify="space-between">
      <n-tag type="success" :bordered="false">Frank 部分功能介绍</n-tag>
      <n-button @click="openIntro"
        size="small" type="success" :bordered="false">全部功能</n-button>
    </n-space>
  </n-card>
</template>

<style scoped>
.spinnerDiv {
  float: left;
  width: 60px;
  height: 60px;
  margin-right: 15px;
  margin-top: 1px;
}

.spinner {
  --size: 30px;
  --first-block-clr: #FF8282;
  --second-block-clr: #FFDC80;
  --clr: #111;
  width: 60px;
  height: 60px;
  position: relative;
}

.spinner::after, .spinner::before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  width: var(--size);
  height: var(--size);
  top: 50%;
  animation: up 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
  left: 50%;
  background: var(--first-block-clr);
  border-radius: 50px;
}

.spinner::after {
  background: var(--second-block-clr);
  top: calc(50% - var(--size));
  left: calc(50% - var(--size));
  animation: down 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes down {
  0%, 100% {
    transform: none;
  }

  25% {
    transform: translateX(100%);
  }

  50% {
    transform: translateX(100%) translateY(100%);
  }

  75% {
    transform: translateY(100%);
  }
}

@keyframes up {
  0%, 100% {
    transform: none;
  }

  25% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(-100%) translateY(-100%);
  }

  75% {
    transform: translateY(-100%);
  }
}

</style>

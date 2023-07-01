<template>
  <div v-if="isSubscribe">
      <dashboard></dashboard>
      <n-space>
          <summoner-info></summoner-info>
          <match-detailed></match-detailed>
      </n-space>
  </div>

  <div v-else>
    <div class="recordDiv">
      <div class="recordInfoDiv">
        <n-alert title="应游戏官方要求 下架国服战绩查询功能" type="warning">
          推荐使用查询战绩平替软件 [ Record ] <br>
          使用Rust重构 体积更小(仅为8m) 速度更快
        </n-alert>
        <n-space vertical justify="space-between">
          <n-button @click="openWin">查看详情</n-button>
          <n-button @click="colseWin">关闭窗口</n-button>
        </n-space>
      </div>
      <img :src="recordImg">
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NSpace,NAlert,NButton
} from 'naive-ui'
import Dashboard from './dashboard.vue'
import SummonerInfo from "./summonerInfo.vue";
import MatchDetailed from "./matchDetailed.vue";
import '../../utils/echarts';
const isSubscribe =  localStorage.getItem('isSubscribe')
const recordImg = new URL("/src/assets/svg/record.png", import.meta.url).href
// const locale = <string>localStorage.getItem('locale')
cube.windows.message.on('received',async (id) => {
  if (id==='refresdh-window'){
    location.reload()
  }
})

const colseWin = () => {
  cube.windows.getCurrentWindow().then((v:any) => {
    cube.windows.close(v.id)
  })
}
const openWin = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/bug#nBD9V')
}
</script>

<style scoped>
.recordDiv {
  margin-top: 24px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.recordDiv img {
  width: 900px;
  border-radius: 12px;
}
.recordInfoDiv {
  display: flex;
  gap: 12px;
}
</style>

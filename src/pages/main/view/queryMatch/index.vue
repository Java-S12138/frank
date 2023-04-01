<template>
  <div v-if="locale!=='zh_CN'">
      <dashboard></dashboard>
      <n-space>
          <summoner-info></summoner-info>
          <match-detailed></match-detailed>
      </n-space>
  </div>

  <div v-else>
      <n-result
              style="margin-top: 150px"
              status="403"
              title="应游戏官方要求"
              size="huge"
              description="下架国服战绩查询功能"
      >
          <template #footer>
              <n-space justify="center">
                  <n-button @click="colseWin">关闭窗口</n-button>
                  <n-button @click="openWin">查看详情</n-button>
              </n-space>
          </template>
      </n-result>
  </div>
</template>

<script setup lang="ts">
import {
  NSpace,NResult,NButton
} from 'naive-ui'
import Dashboard from './dashboard.vue'
import SummonerInfo from "./summonerInfo.vue";
import MatchDetailed from "./matchDetailed.vue";
import '../../utils/echarts';

const locale = <string>localStorage.getItem('locale')
cube.windows.message.on('received',async (id) => {
  if (id==='refresdh-window'){
    location.reload()
  }
})

const colseWin = () => {
  cube.windows.getCurrentWindow().then((v) => {
    cube.windows.close(v.id)
  })
}
const openWin = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/bug')
}
</script>

<style scoped>

</style>

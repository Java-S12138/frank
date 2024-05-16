<script setup lang="ts">
import {NSpace, NTag, NCard, useMessage, NButton} from 'naive-ui'
import {useTeammateStore} from "@/main/store/useTeammate";
import SummonerList from "./summonerList.vue";

const teammateStore = useTeammateStore()
const message = useMessage()

const openWin = () => {
  if (localStorage.getItem('subscribe') === null){
    message.warning('对局分析，需要订阅服务')
    return
  }
  cube.windows.obtainDeclaredWindow('matchAnalysis')
}

</script>

<template>
  <n-card
    size="small" class="shadow"
    style="height: 616px"
    content-style="padding-top: 2px;">

    <summoner-list/>

    <div class="matchAnalysisDash dark:border-gray-700">
      <n-space justify="space-between" style="width: 100%;">
        <n-button @click="openWin" size="small"
                  class="px-2" type="success"
                  :disabled="teammateStore.isCacheSuccess !== 1"
                  :bordered="false" round>
          对局分析
        </n-button>
        <n-tag type="info" round v-if="teammateStore.isCacheSuccess === 0"
               :disabled="true" :bordered="false">
          正在获取队友战绩数据
        </n-tag>
        <n-tag type="success" round v-else-if="teammateStore.isCacheSuccess===1"
               :disabled="true" :bordered="false">
          点击左侧按钮查看更多
        </n-tag>
        <n-tag type="error" round v-else-if="teammateStore.isCacheSuccess===-1"
               :disabled="true" :bordered="false">
          啊哦~ 战绩数据获取异常
        </n-tag>
      </n-space>
    </div>
  </n-card>
</template>

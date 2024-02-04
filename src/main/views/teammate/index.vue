<script setup lang="ts">
import {NSpace, NTag, NCard, useMessage, NButton} from 'naive-ui'
import {useTeammateStore} from "@/main/store/useTeammate";
import SummonerList from "./summonerList.vue";

const teammateStore = useTeammateStore()
const message = useMessage()

const openWin = () => {
  cube.windows.obtainDeclaredWindow('matchAnalysis')
}

</script>

<template>
  <n-card
    size="small" class="shadow"
    style="height: 616px"
    content-style="padding-top: 2px;">

    <summoner-list/>

    <div class="matchAnalysisDash">
      <n-space justify="space-between" style="width: 100%;">
        <n-button @click="openWin" size="small"
                  class="px-2" type="success"
                  :disabled="!teammateStore.isCacheSuccess"
                  :bordered="false" round>
          对局分析
        </n-button>
        <n-tag type="success" round
               :disabled="true" :bordered="false">点击头像查看更多信息
        </n-tag>
      </n-space>
    </div>
  </n-card>
</template>

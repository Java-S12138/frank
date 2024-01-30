<script setup lang="ts">
import {NSpace, NDivider, NTag, NCard,useMessage} from 'naive-ui'
import {useTeammateStore} from "@/main/store/useTeammate";
import SummonerList from "./summonerList.vue";
import {ref} from "vue";

const teammateStore = useTeammateStore()
const isDisabled = ref(true)
const message = useMessage()

const openWin = () => {
  if (isDisabled.value){
    message.warning('数据加载中...')
    return
  }
  if (teammateStore.isCacheSuccess){
    cube.windows.obtainDeclaredWindow('matchAnalysis')
  }else {
    message.error('数据异常，功能暂时无法使用')
  }

}

const fetchDataWithTimeout = async (teammateStore, isDisabled) => {
  await new Promise(resolve => setTimeout(resolve, 3000))

  if (teammateStore.isCacheSuccess) {
    isDisabled.value = false
    return
  }

  let count = 0
  const interval = setInterval(() => {
    if (teammateStore.isCacheSuccess || count === 3) {
      isDisabled.value = false
      clearInterval(interval)
    }
    count += 1
  }, 1000)
}


fetchDataWithTimeout(teammateStore, isDisabled)

</script>

<template>
  <n-card size="small" class="mt-4 shadow"
          style="height: 609px"
          content-style="padding-top: 4px;">
    <summoner-list/>

    <n-divider dashed style="margin-top: 0px;margin-bottom: 12px;"/>

    <div>
      <n-space justify="space-between" style="width: 100%;">
        <n-tag @click="openWin" class="cursor-pointer" type="success"
               :bordered="false" round>对局分析
        </n-tag>
        <n-tag type="info" round
               :disabled="true" :bordered="false">点击头像查看更多信息
        </n-tag>
      </n-space>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {NSpace,NDivider,NTag,NCard} from 'naive-ui'
import SummonerList from "./summonerList.vue";

const openWin = () => {

}
</script>

<template>
  <n-card size="small" class="mt-4 shadow" content-style="padding-top: 4px;">
    <summoner-list/>

    <n-divider dashed style="margin-top: 0px;margin-bottom: 12px;"/>

    <div>
      <n-space justify="space-between" style="width: 100%;">
        <n-tag @click="openWin" class="cursor-pointer" type="success" :bordered="false" round>对局分析</n-tag>
        <n-tag type="info" round
               :disabled="true" :bordered="false">点击头像查看更多信息</n-tag>
      </n-space>
    </div>
  </n-card>
</template>

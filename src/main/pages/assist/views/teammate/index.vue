<script setup lang="ts">
import {queryFriendInfo, queryMasteryChampList} from "./utils";
import {onMounted} from "vue";
import {NSpace,NDivider,NTag,NCard} from 'naive-ui'
import {QueryMatch} from "./queryMatch";
import SummonerList from "./summonerList.vue";
import {useTeammateStore} from "@/main/store/useTeammate";

const teammateStore = useTeammateStore()

onMounted(async () => {
  const useMatch = new QueryMatch(0)

  let showMateryChamp = false

  for (const [index,summoner] of teammateStore.summonerInfo.entries()) {
    const matchList = await useMatch.getResultInfo(summoner.puuid,index)

    if (matchList.length === 0 || showMateryChamp){
      showMateryChamp = true
      const masteryList = await queryMasteryChampList(summoner.puuid)
      if (masteryList !== null){
        teammateStore.masteryChampList.push(masteryList)
      }
    }else {
      teammateStore.recentMatchList.push(matchList)
    }
  }
  // 查询最近战绩出错
  if (showMateryChamp){
    teammateStore.isLcuErr = true
  }
})

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

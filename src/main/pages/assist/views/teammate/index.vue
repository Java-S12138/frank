<script setup lang="ts">
import {queryFriendInfo} from "./utils";
import {onMounted, Ref, ref} from "vue";
import {SummonerInfoList} from "./teammateTypes";
import {NSpace,NDivider,NTag,NCard,NDrawer} from 'naive-ui'
import {QueryMatch} from "./queryMatch";
import SummonerList from "./summonerList.vue";

const friSummonerInfo:Ref<SummonerInfoList[]> = ref([])


onMounted(async () => {
  const useMatch = new QueryMatch(0)
  friSummonerInfo.value = await queryFriendInfo()

  for (const summoner of friSummonerInfo.value) {
    const matchList = await useMatch.getResultInfo(summoner.puuid)
    summoner.match.recentMatchList = matchList
    // console.log(matchList)
  }
})


const openWin = () => {

}
</script>

<template>
  <n-card size="small" class="mt-4 shadow" content-style="padding-top: 4px;">
    <summoner-list :fri-summoner-info="friSummonerInfo"/>

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

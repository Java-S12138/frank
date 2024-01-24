<script setup lang="ts">
import QueryHeader from "./components/queryHeader.vue";
import SummonerInfoView from "./components/summonerInfoView.vue";
import MatchMain from "./components/matchMain.vue";
import {summonerInfo} from "@/lcu/types/SummonerTypes";
import {onMounted, provide, Ref, ref} from "vue";
import BaseMatch from "./utils/BaseMatch";
import {SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";

const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}

const sumInfo:Ref<{ info:summonerInfo, rank:string[] }|null> = ref(null)
const matchList:Ref<SimpleMatchDetailsTypes[]> = ref([])

// 向matchList.vue传输数据
provide('matchList',matchList)

onMounted(async () => {
  const baseMatch = new BaseMatch()
  const sumResult = await baseMatch.gerSummonerInfo()
  if (sumResult!==null){
    sumInfo.value =  {info:sumResult.summonerInfo,rank:sumResult.rankList}
    matchList.value = await baseMatch.dealMatchHistory(sumResult.summonerInfo.puuid,0,8)
    // console.log(matchListResult)
  }
})
</script>

<template>
  <div v-if="sumInfo!==null" class="main bg-neutral-100 dark:bg-neutral-900">
    <div @mousedown="dragMove()" class="dragDiv"></div>

    <query-header class="h-10 mb-2"/>

    <div class="flex">
      <summoner-info-view :sum-info="sumInfo"/>

      <div class="ml-3 flex-grow">
        <match-main :summoner-id="sumInfo.info.currentId"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SummonerMatch from "./summonerMatch.vue";
import MatchAnalysis from "./matchAnalysis.vue";
import {findTopChamp} from "@/main/views/teammate/utils";
import {useTeammateStore} from "@/main/store/useTeammate";
import SummonerKdaName from "@/main/views/teammate/summonerKdaName.vue";
import {NDrawerContent,NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
import SummonerMasteryChamp from "@/main/common/summonerMasteryChamp.vue";
import {CurrentSumInfoTypes, RencentDataAnalysisTypes} from "./teammateTypes";

const teammateStore = useTeammateStore()
const {sumInfo,index} = defineProps<{ sumInfo:CurrentSumInfoTypes,index:number }>()
const analysisData:RencentDataAnalysisTypes|null = findTopChamp(teammateStore.recentMatchList[index])
const existChampList = teammateStore.masteryChampList[index]

</script>

<template>
  <n-drawer-content body-content-style="padding:15px 21px 0px">
    <div class="flex gap-x-3" style="height: 50px;">
      <n-avatar
        round
        :size="50"
        :src="sumInfo.imgUrl"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <n-space class="flex-grow" vertical :size="[0,6]">
        <summoner-kda-name
          :name="sumInfo.name"
          :kda="sumInfo.kda"
          :hater="sumInfo.hater"
        />
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="info">{{sumInfo.rank}}</n-tag>
      </n-space>
    </div>

    <n-tabs style="margin-top: 6px" type="line" animated justify-content="space-between" >
      <n-tab-pane name="最近战绩" tab="最近战绩" display-directive="show">
         <summoner-match :match-list="teammateStore.recentMatchList[index]"/>
      </n-tab-pane>
      <n-tab-pane v-if="analysisData!==null" name="数据分析" tab="数据分析">
        <match-analysis :analysis-data="analysisData"/>
      </n-tab-pane>
      <n-tab-pane name="绝活英雄" tab="绝活英雄" display-directive="show">
        <summoner-mastery-champ
          :max-h="378" :p-right="14"
          :puuid="sumInfo.puuid" :exist-champ-list="existChampList"/>
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>



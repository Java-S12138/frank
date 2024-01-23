<script setup lang="ts">
import {NDrawerContent,NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
import {CurrentSumInfoTypes, RencentDataAnalysisTypes} from "./teammateTypes";
import SummonerMatch from "./summonerMatch.vue";
import SummonerMasteryChamp from "@/main/common/summonerMasteryChamp.vue";
import MatchAnalysis from "./matchAnalysis.vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import {findTopChamp} from "@/main/views/teammate/utils";

const teammateStore = useTeammateStore()
const {name,puuid,rank,profileIconId,index} = defineProps<CurrentSumInfoTypes>()
const analysisData:RencentDataAnalysisTypes|null = findTopChamp(teammateStore.recentMatchList[index])
const existChampList = teammateStore.masteryChampList[index]

const getImgUrl = (profileIconId: number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}
</script>

<template>
  <n-drawer-content body-content-style="padding:12px 21px 0px">
    <div class="flex gap-x-3" style="height: 50px;">
      <n-avatar
        :size="50"
        round
        :src="getImgUrl(profileIconId)"
      />
      <n-space class="flex-grow" vertical :size="[0,6]">
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="success">{{ name }}</n-tag>
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="info">{{rank}}</n-tag>
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
          :puuid="puuid" :exist-champ-list="existChampList"/>
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>



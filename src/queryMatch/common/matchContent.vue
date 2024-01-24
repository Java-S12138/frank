<script setup lang="ts">
import MatchConHeader from "./matchConHeader.vue";
import MatchDetails from "./matchDetails.vue";
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";

const {teamOne,teamTwo,headerInfo,summonerId} = defineProps<{
  teamOne: SummonerDetailInfo[],
  teamTwo: SummonerDetailInfo[],
  headerInfo: string[],
  summonerId:number
}>()

</script>

<template>
  <match-con-header :title-list="headerInfo"/>
  <div class="flex justify-between">
    <match-details :summoner-list="teamOne" :cur-sum-id="summonerId" :is-one="true"/>
    <match-details :summoner-list="teamTwo" :cur-sum-id="summonerId" :is-one="false"/>
  </div>
</template>


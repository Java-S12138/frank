<template>
  <dashboard></dashboard>
  <n-space>
    <summoner-info></summoner-info>
    <match-detailed></match-detailed>
  </n-space>
</template>

<script setup lang="ts">
import {
  NSpace
} from 'naive-ui'
import Dashboard from './dashboard.vue'
import SummonerInfo from "./summonerInfo.vue";
import MatchDetailed from "./matchDetailed.vue";

</script>

<style scoped>

</style>

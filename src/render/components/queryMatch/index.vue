<template>
  <dashboard></dashboard>
  <n-space>
    <summoner-info></summoner-info>
    <match-detailed></match-detailed>
  </n-space>
</template>

<script setup>
import {
  NSpace
} from 'naive-ui'
import Dashboard from './dashboard'
import SummonerInfo from "./summonerInfo";
import MatchDetailed from "./matchDetailed";
document.title='QueryMatch'
</script>

<style scoped>

</style>

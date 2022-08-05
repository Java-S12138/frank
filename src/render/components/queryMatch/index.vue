<template>
  <dashboard></dashboard>
  <n-space>
    <summoner-info></summoner-info>
    <match-detailed></match-detailed>
  </n-space>
</template>

<script setup>
import Dashboard from './dashboard'
import SummonerInfo from "./summonerInfo";
import MatchDetailed from "./matchDetailed";
import {NSpace} from "naive-ui"

</script>

<style scoped>

</style>

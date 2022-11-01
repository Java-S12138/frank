<template>
  <Dashboard @changePage="() => { pageCount =  pageCount === 1 ? 2 : 1}"/>
  <div>
    <summoner-info v-if="pageCount===1" class="slide-in-left "/>
    <fbottom v-if="pageCount===1" class="slide-in-left "/>
    <setting v-else-if="pageCount===2" class="slide-in-right" @changePage="() => { pageCount = 1}"/>
  </div>
</template>

<script setup lang="ts" >
import Dashboard from './dashboard.vue'
import SummonerInfo from './summonerInfo.vue'
import Fbottom from './fbottom.vue'
import Setting from './setting.vue'
import {ref} from 'vue'

const pageCount = ref(1)
</script>


<style scoped>
@import url(@/assets/css/animationCommon.css);
</style>

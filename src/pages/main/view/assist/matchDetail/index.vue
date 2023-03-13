<template>
  <n-card class="boxShadow" size="small" content-style="padding:10px 10px">
    <n-space v-if="store.summonerInfo.length===0" justify="center" vertical align="center">
      <p style="color: rgb(102, 111, 117)">当前友方队伍数据为空</p>
      <p style="color: rgb(102, 111, 117)">处于选择英雄阶段即可使用此功能</p>
    </n-space>
    <summoner-list v-else/>
  </n-card>
</template>

<script setup lang="ts">
import {NCard, NSpace,useMessage,} from 'naive-ui'
import assistStore from "../../../store/assistStore";
import SummonerList from "./summonerList.vue"

const store = assistStore()

</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}
</style>

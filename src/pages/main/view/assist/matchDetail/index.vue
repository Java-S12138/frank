<template>
  <n-card class="boxShadow" size="small" content-style="padding:10px 10px">
    <n-space v-if="store.summonerInfo.length===0" justify="center" vertical align="center">
      <p style="color: rgb(102, 111, 117)">当前友方队伍数据为空</p>
      <p style="color: rgb(102, 111, 117)">处于选择英雄阶段即可使用此功能</p>
      <n-space>
        <p style="color: rgb(102, 111, 117)">数据获取成功后 优先显示此页面</p>
        <n-switch style="margin-bottom: 2.5px" v-model:value="active" size="small"  @click="changeSetting" />
      </n-space>
      <img style="height: 250px;margin-top: 3px" src="../../../../../assets/svg/matchNull2.svg">
      <img style="height: 250px" src="../../../../../assets/svg/matchNull.svg">
    </n-space>
    <summoner-list v-else/>
  </n-card>

</template>

<script setup lang="ts">
import {NCard, NSpace,NSwitch} from 'naive-ui'
import assistStore from "../../../store/assistStore";
import SummonerList from "./summonerList.vue"
import {ref} from "vue";

const store = assistStore()
const active = ref(JSON.parse(<string>(localStorage.getItem('config'))).showMatchDetail)
const changeSetting = () => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  config['showMatchDetail'] = active.value
  localStorage.setItem('config',JSON.stringify(config))
}

</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}
</style>

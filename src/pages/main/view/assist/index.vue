<template>
  <n-tabs type="segment" :animated=true
          ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="查看战绩" @click="showMatch"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" class="slide-in-bottom"></champ-rank>
    <rune v-show="transValue==='rune'"  @changePage="changePage"
          class="slide-in-bottom" ></rune>
<!--    <div v-if="isSwitchBlacklist" >-->
<!--      <blacklist v-show="transValue==='blacklist'" class="slide-in-bottom"></blacklist>-->
<!--    </div>-->
  <n-button @click="test">按我</n-button>
</template>

<script setup>
import {
  NTabs, NTab, useMessage,NButton
} from "naive-ui";
import Rune from './rune.vue'
import ChampRank from './champRank.vue'
// import Blacklist from "./blacklist.vue"
import {onMounted, ref} from "vue";
import {assistStore} from "../../store";
import {storeToRefs} from "pinia";
import {invokeLcu} from "../../lcu/"

const test = async () => {
  console.log(await invokeLcu('post','/lol-matchmaking/v1/ready-check/accept'))
}

onMounted(() => {
  let nTabsRail = document.querySelector('.n-tabs-rail')
  let champRank = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(1) > div')
  let rune = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(2) > div.n-tabs-tab')
  nTabsRail.style.margin = "12px 12px 0 12px"
  champRank.style['border-radius'] = '5px'
  champRank.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' +
    ' color 1s var(--n-bezier),\n' +
    ' background-color 1s var(--n-bezier),\n' +
    ' border-color 1s var(--n-bezier)'
  rune.style['border-radius'] = '5px'
  rune.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' +
    ' color 1s var(--n-bezier),\n' +
    ' background-color 1s var(--n-bezier),\n' +
    ' border-color 1s var(--n-bezier)'
})
const tabsInstRef = ref(['champRank', 'rune','blacklist'])
const transValue = ref('champRank')
const message = useMessage()
const store = assistStore()
const {summonerInfo,showSummonerInfoModal,currentBlackList,endGameAfterInfo} = storeToRefs(store)
const isSwitchBlacklist = true


const getCurrentBlacklist = () => {
  console.log('getCurrentBlacklist')
}

const showMatch = async () => {
  console.log('showmatch')
}
const changePage = (e) => {
  if (e){
    transValue.value = 'rune'
  }else {
    transValue.value = 'champRank'
  }
}

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

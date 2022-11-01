<template>
  <n-tabs type="segment" :animated=true
          ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="查看战绩" @click="showMatch"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" class="slide-in-bottom"></champ-rank>
    <rune v-show="transValue==='rune'" class="slide-in-bottom" ></rune>
    <div v-if="isSwitchBlacklist" >
      <blacklist v-show="transValue==='blacklist'" class="slide-in-bottom"></blacklist>
    </div>

</template>

<script setup>
import {
  NTabs, NTab, useMessage
} from "naive-ui";
import Rune from './rune.vue'
import ChampRank from './champRank.vue'
import Blacklist from "./blacklist.vue"
import {onMounted, ref} from "vue";
import {ipcRenderer} from "electron";
import {createHttp1Request} from "@/utils/league-connect";
import {appConfig} from "@/utils/main/config";
import {assistStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {querySummonerIdAndSummonerName,queryEnemySummonerIdAndSummonerName} from "@/utils/render/blacklistUtils";

document.title = 'Assist'

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
let transValue = ref('champRank')
const message = useMessage()
const store = assistStore()
const {summonerInfo,showSummonerInfoModal,currentBlackList,endGameAfterInfo} = storeToRefs(store)
const isSwitchBlacklist = appConfig.get('isSwitchBlacklist')

ipcRenderer.once('client-connect-success',() => {
  location.reload()
})

ipcRenderer.on('show-other-summoner', () => {
  if (isSwitchBlacklist){
    currentBlackList.value.length = 0
    transValue.value = 'blacklist'
  }
})

ipcRenderer.on('query-enemy-summoner',() => {
  if (isSwitchBlacklist) {
    setTimeout(async () => {
      const res = await queryEnemySummonerIdAndSummonerName(appConfig.get('credentials'))
      console.log(res)
      endGameAfterInfo.value = [[], []]
      endGameAfterInfo.value = res
    }, 1500)
  }
})

ipcRenderer.on('query-other-summoner',() => {
  showSummonerInfoModal.value = false
  transValue.value = 'champRank'
  ipcRenderer.once('current-champ-select', () => {
    transValue.value = 'rune'
  })
  if (isSwitchBlacklist){
    setTimeout( async () => {
      const res =  await querySummonerIdAndSummonerName(appConfig.get('credentials'))
      summonerInfo.value = []
      summonerInfo.value = res
      getCurrentBlacklist(summonerInfo.value)
    },1500)
  }
})

const getCurrentBlacklist = (summonerInfo) => {
  let summonerList = []

  for (const summoner of summonerInfo) {
    summonerList.push(`${summoner.summonerId}`)
  }

  const blacklistIds = Object.keys(appConfig.get('blacklist'))
  for (const blacklistId of blacklistIds) {
    if (summonerList.indexOf(blacklistId) !=-1){
      currentBlackList.value.push(blacklistId)
    }
  }
  if (currentBlackList.value.length > 1){
    transValue.value = 'blacklist'
  }
}

const showMatch = async () => {
  const clientStatus = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/gameflow-phase/`,
  }, appConfig.get('credentials'))).json()
  if (clientStatus == '"ChampSelect"' ||  clientStatus == '"InProgress"'){
    ipcRenderer.send('showCharts',clientStatus)
    message.success('获取战绩成功 !')
  }
  else {
    message.error('请先开始一局游戏哟 !')
  }
}

</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

<template>
  <n-tabs type="segment" :animated=true ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="查看战绩" @click="showMatch"></n-tab>
    <n-tab name="blacklist" tab="拉黑名单" @click="transValue='blacklist'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" class="slide-in-bottom"></champ-rank>
    <rune v-show="transValue==='rune'" class="slide-in-bottom" ></rune>
    <blacklist v-if="transValue==='blacklist'"></blacklist>

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

ipcRenderer.once('current-champ-select', () => {
    transValue.value = 'rune'
})
ipcRenderer.once('client-connect-success',() => {
  location.reload()
})

ipcRenderer.on('refresh-assisit-window', () => {
  location.reload()
})

const showMatch = async () => {
  const clientStatus = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/gameflow-phase/`,
  }, appConfig.get('credentials'))).json()
  if (clientStatus == '"ChampSelect"' || clientStatus == '"GameStart"'){
    ipcRenderer.send('showCharts')
    message.success('获取战绩成功 !')
  }else {
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

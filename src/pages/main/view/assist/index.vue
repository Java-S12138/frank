<template>
  <n-tabs type="segment" :animated=true @mousedown="handldDrge"
          ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="查看战绩" @click="showMatch"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" class="slide-in-bottom"></champ-rank>
    <rune v-show="transValue==='rune'"  @changePage="changePage"
          class="slide-in-bottom" ></rune>
    <div v-if="isSwitchBlacklist" >
      <blacklist v-show="transValue==='blacklist'" class="slide-in-bottom"></blacklist>
    </div>
</template>

<script setup lang="ts">
import {
  NTabs, NTab, useMessage
} from "naive-ui";
import Rune from './rune.vue'
import ChampRank from './champRank.vue'
import Blacklist from "./blacklist.vue"
import {onMounted, ref} from "vue";
import {assistStore} from "../../store";
import {storeToRefs} from "pinia";
import {querySummonerIdAndSummonerName,queryEnemySummonerIdAndSummonerName} from "../../utils/blacklistUtils"
import {invokeLcu} from "../../lcu";

onMounted(() => {
  let nTabsRail = document.querySelector('.n-tabs-rail')
  let champRank = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(1) > div')
  let rune = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(2) > div.n-tabs-tab')
  // @ts-ignore
  nTabsRail.style.margin = "12px 12px 0 12px";champRank.style['border-radius'] = '5px';champRank.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)';rune.style['border-radius'] = '5px';rune.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)'
})
const tabsInstRef = ref(['champRank', 'rune','blacklist'])
const transValue = ref('champRank')
const message = useMessage()
const store = assistStore()
const {summonerInfo,showSummonerInfoModal,currentBlackList,endGameAfterInfo,onlinePlayerInfo}:any = storeToRefs(store)
const isSwitchBlacklist = JSON.parse(String(localStorage.getItem('config'))).isSwitchBlacklist

cube.windows.message.on('received',async (id) => {
  // 查询我方召唤师
  if (id==='query-other-summoner' && isSwitchBlacklist){
    showSummonerInfoModal.value = false
    transValue.value = 'champRank'
    setTimeout( async () => {
      const res =  await querySummonerIdAndSummonerName()
      summonerInfo.value = []
      summonerInfo.value = res
      getCurrentBlacklist(summonerInfo.value)
    },1500)
  }else if (id==='query-enemy-summoner'&& isSwitchBlacklist){
    // 查询敌方召唤师
    setTimeout(async () => {
      const res = await queryEnemySummonerIdAndSummonerName()
      endGameAfterInfo.value = [[], []]
      endGameAfterInfo.value = res
    }, 1500)
  }else if (id==='show-other-summoner'&& isSwitchBlacklist){
    currentBlackList.value.length = 0
    transValue.value = 'blacklist'
  }else if (id==='refresh'){
    location.reload()
  }
})


const getCurrentBlacklist = (summonerInfo:any) => {
  const areaSetting = JSON.parse(String(localStorage.getItem('config'))).currentArea
  // 获取当前队伍中的召唤师ID
  const summonerList = summonerInfo.reduce((res:String[],item:{name:string,summonerId:number}) => {
    return res.concat([String(item.summonerId)])
  },[])
  console.log(summonerList)

  if (onlinePlayerInfo.value.haterIdList[areaSetting] !== undefined){
    const blacklistIds = onlinePlayerInfo.value.haterIdList[areaSetting].sumIdList
    for (const blacklistId of blacklistIds) {
      if (summonerList.indexOf(blacklistId) !== -1){
        currentBlackList.value.push(blacklistId)
      }
    }
    if (currentBlackList.value.length > 1){
      transValue.value = 'blacklist'
    }
  }
  console.log( currentBlackList.value)
}

// 显示队伍战绩历史窗口
const showMatch = async () => {
  // todo dev game mode
  // cube.windows.obtainDeclaredWindow('matchHistory')
  // return
  const clientStatus = await invokeLcu('get','/lol-gameflow/v1/gameflow-phase')
  if (clientStatus == 'ChampSelect' ||  clientStatus == 'InProgress'){
    cube.windows.obtainDeclaredWindow('matchHistory')
    message.success('获取战绩成功 !')
  }
  else {
    message.error('请先开始一局游戏哟 !')
  }
}

const changePage = (e:string) => {
  if (e){
    transValue.value = 'rune'
  }else {
    transValue.value = 'champRank'
  }
}
const handldDrge = () => {
  cube.windows.current.dragMove()
}
</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

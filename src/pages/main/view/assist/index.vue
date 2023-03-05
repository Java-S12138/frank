<template>
  <n-tabs type="segment" :animated=true @mousedown="handldDrge"
          ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="对局详情" @click="showMatch"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" :trans-value-rank="transValue" class="slide-in-bottom"></champ-rank>
    <rune v-show="transValue==='rune'"  @changePage="changePage"
          class="slide-in-bottom" ></rune>
    <div v-if="isSwitchBlacklist" >
      <blacklist v-show="transValue==='blacklist'" class="slide-in-bottom"></blacklist>
      <n-drawer v-model:show="queryMatchAddition.active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
                :height="420" placement="bottom" :auto-focus="false">
        <add-blacklist @closeDra="closeDrawer"
                       :name="queryMatchAddition.blacklistName"
                       :summonerId="queryMatchAddition.blacklistId"
                       :gameAfterId="queryMatchAddition.gameAfterId"></add-blacklist>
      </n-drawer>
    </div>
</template>

<script setup lang="ts">
import {
  NTabs, NTab, useMessage,NDrawer
} from "naive-ui";
import Rune from './runePages/rune.vue'
import ChampRank from './champRank.vue'
import Blacklist from "./rankNote/blacklist.vue"
import AddBlacklist from "./rankNote/addBlacklist.vue"
import {onMounted, ref} from "vue";
import {assistStore} from "../../store";
import {storeToRefs} from "pinia";
import {querySummonerIdAndSummonerName,queryEnemySummonerIdAndSummonerName,handleHaterListBySumId} from "../../utils/blacklistUtils"
import {invokeLcu} from "../../lcu";
import {blacklistServe} from "../../utils/request";

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
const {summonerInfo,showSummonerInfoModal,currentBlackList,endGameAfterInfo,localSummonerInfo}:any = storeToRefs(store)
const isSwitchBlacklist = JSON.parse(<string>(localStorage.getItem('config'))).isSwitchBlacklist
const queryMatchAddition = ref({
  active:false,
  blacklistName:'',
  blacklistId:'',
  gameAfterId:0
})

cube.windows.message.on('received',async (id,content:any) => {
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
    const locale = <string>(localStorage.getItem('locale'))
    if (locale==='zh_CN'){
      setTimeout(async () => {
        const res = await queryEnemySummonerIdAndSummonerName()
        endGameAfterInfo.value = [[], []]
        endGameAfterInfo.value = res
      }, 1500)
    }
  }else if (id==='show-other-summoner'&& isSwitchBlacklist){
    currentBlackList.value.length = 0
    transValue.value = 'blacklist'
  }else if (id==='refresh'){
    location.reload()
  }else if (id==='queryMatch-add-blacklist'){
    transValue.value = 'blacklist'
    queryMatchAddition.value.active=true
    queryMatchAddition.value.blacklistId=content.summonerId
    queryMatchAddition.value.gameAfterId=content.gameId
    queryMatchAddition.value.blacklistName=content.name
  }
})


const getCurrentBlacklist = async (summonerInfo:any) => {
  currentBlackList.value = []
  const areaSetting = localStorage.getItem('currentArea')
  // 获取当前队伍中的召唤师ID
  const summonerList = summonerInfo.reduce((res:String[],item:{name:string,summonerId:number}) => {
    return res.concat([String(item.summonerId)])
  },[])

  const res = await blacklistServe({
    url:'/hater/findHaterBySumId',
    data:{'sumIdList':summonerList,'area':areaSetting},
    method:'POST'
  })
  if (res.data.code !== 0){
    return
  }
  if (res.data.data?.length !==0){
      handleHaterListBySumId(res.data.data,localSummonerInfo.value.playerSumId).then((res) => {
        currentBlackList.value = res.blackList
        if (res.blackList.length > 1){
          transValue.value = 'blacklist'
        }
      })
  }
}

// 显示队伍战绩历史窗口
const showMatch = async () => {
  // todo dev game mode
  // cube.windows.obtainDeclaredWindow('matchHistory')
  // return
  const clientStatus = await invokeLcu('get','/lol-gameflow/v1/gameflow-phase')
  if (clientStatus === 'ChampSelect'){
    cube.windows.obtainDeclaredWindow('matchHistory')
    message.success('获取战绩成功 !')
  }
  else if (clientStatus === 'InProgress') {
    cube.windows.obtainDeclaredWindow('recentMatch',{height:551}).then(value => {
      if (value!==undefined){
        cube.windows.show(value.id)
      }
    })
  }else {
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
const closeDrawer = () => {
  queryMatchAddition.value.active = false
}
</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

<template>
  <n-tabs type="segment" :animated=false @mousedown="handldDrge" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="matchDetail" tab="对局详情" @click="transValue='matchDetail'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'"
                :trans-value-rank="transValue" class="slide-in-bottom"></champ-rank>
    <match-detail  v-show="transValue==='matchDetail'" class="slide-in-bottom"/>
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
import {NDrawer, NTab, NTabs, useMessage} from "naive-ui";
import Rune from './runePages/rune.vue'
import ChampRank from './champRank.vue'
import Blacklist from "./rankNote/blacklist.vue"
import AddBlacklist from "./rankNote/addBlacklist.vue"
import MatchDetail from "./matchDetail/index.vue"
import {onMounted, ref} from "vue";
import assistStore from "../../store/assistStore";
import {
  handleHaterListBySumId,
  queryEnemySummonerIdAndSummonerName,
  querySummonerIdAndSummonerName
} from "../../utils/blacklistUtils"
import {invokeLcu} from "../../lcu";
import {blacklistServe} from "../../utils/request";
onMounted(() => {
  let nTabsRail = document.querySelector('.n-tabs-rail')
  let champRank = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(1) > div')
  let rune = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(2) > div.n-tabs-tab')
  // @ts-ignore
  nTabsRail.style.margin = "12px 12px 0 12px";champRank.style['border-radius'] = '5px';champRank.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)';rune.style['border-radius'] = '5px';rune.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)'
})
const transValue = ref('champRank')
const message = useMessage()
const store = assistStore()

const isSwitchBlacklist = JSON.parse(<string>(localStorage.getItem('config'))).isSwitchBlacklist
const queryMatchAddition = ref({
  active:false,
  blacklistName:'',
  blacklistId:'',
  gameAfterId:0
})

// todo 测试
/*store.summonerInfo =   [
  {
    "name": "18岁游走型中单",
    "summonerId": "4016690740",
    "puuid": "c9b0fd7a-59cd-54c6-bf7e-6b5241ebee84",
    "profileIconId": 5430,
  },
    {
      "name": "捉只TAMU烤来吃",
      "summonerId": "2973065473205536",
      "puuid": "d07f0dc9-fa09-513a-8213-3692c19aa16a",
      "profileIconId": 5675,
    },
    {
      "name": "苏城旧梦",
      "summonerId": "2928701827",
      "puuid": "c3f03f56-1a70-53ee-9bf0-33920159b7d5",
      "profileIconId": 1296,
    },
    {
      "name": "捉只Timor烤来吃",
      "summonerId": "2316548464919392",
      "puuid": "4da9b56c-8699-5805-8b31-27c08f823fc9",
      "profileIconId": 4864,
    },
    {
      "name": "那一抹忧伤88",
      "summonerId": "4014910477",
      "puuid": "27f4909d-93c4-55a7-b847-80692c8f14d1",
      "profileIconId": 5528,
    }
  ]*/

cube.windows.message.on('received',async (id,content:any) => {
  // 查询我方召唤师
  if (id==='query-other-summoner'){
    store.currentBlackList = []
    transValue.value = 'champRank'
    store.showSummonerInfoModal = false
    setTimeout( async () => {
      store.summonerInfo = await querySummonerIdAndSummonerName()
      if (store.summonerInfo.length !==0){
        transValue.value='matchDetail'
      }
      if (isSwitchBlacklist){
        getCurrentBlacklist(store.summonerInfo)
      }
    },1500)
  }else if (id==='query-enemy-summoner' && isSwitchBlacklist){
    // 查询敌方召唤师
    setTimeout(async () => {
      store.endGameAfterInfo = await queryEnemySummonerIdAndSummonerName()
    }, 1500)
  }else if (id==='show-other-summoner' && isSwitchBlacklist){
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


const getCurrentBlacklist = async (summonerInfo:{name: string, summonerId: string}[]) => {
  const areaSetting = localStorage.getItem('currentArea')
  // 获取当前队伍中的召唤师ID
  const summonerList = summonerInfo.reduce((res:string[],item:{name:string,summonerId:string}) => {
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
      handleHaterListBySumId(res.data.data,store.localSummonerInfo.playerSumId).then((res) => {
        store.currentBlackList = res.blackList
        if (res.blackList.length > 1){
          transValue.value = 'blacklist'
        }
      })
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

<template>
  <n-tabs id="assistTabs" type="segment" :animated=false @mousedown="handldDrge" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="matchDetail" tab="对局详情" @click="transValue='matchDetail'"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
    <n-tab v-if="isSwitchBlacklist" name="blacklist" tab="排位笔记" @click="transValue='blacklist'"></n-tab>
  </n-tabs>

    <champ-rank v-show="transValue==='champRank'" :trans-value-rank="transValue" class="slide-in-bottom"></champ-rank>
    <match-detail  v-show="transValue==='matchDetail'" class="slide-in-bottom"/>
    <rune v-show="transValue==='rune'"  ref="runeChampSelect" class="slide-in-bottom" ></rune>

    <div v-if="isSwitchBlacklist" >
      <blacklist v-show="transValue==='blacklist'" ref="handleBlacklist" class="slide-in-bottom"></blacklist>
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
import {blacklistServe} from "../../utils/request";
import {SummonerInfoList} from "../../interface/blacklistTypes";

onMounted(() => {
  let nTabsRail = document.querySelector('.n-tabs-rail')
  let champRank = document.querySelector('#assistTabs > div > div > div:nth-child(1) > div')
  let rune = document.querySelector('#assistTabs > div > div > div:nth-child(2) > div.n-tabs-tab')
  // @ts-ignore
  nTabsRail.style["backgroundColor"]='#ffffff00';nTabsRail.style.margin = "12px 12px 0 12px";champRank.style['border-radius'] = '5px';champRank.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)';rune.style['border-radius'] = '5px';rune.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' + ' color 1s var(--n-bezier),\n' + ' background-color 1s var(--n-bezier),\n' + ' border-color 1s var(--n-bezier)'
})
const transValue = ref('champRank')
const message = useMessage()
const store = assistStore()
const config = JSON.parse(<string>(localStorage.getItem('config')))
const isSwitchBlacklist = config.isSwitchBlacklist
const queryMatchAddition = ref({
  active:false,
  blacklistName:'',
  blacklistId:'',
  gameAfterId:0
})
const runeChampSelect: any = ref()
const handleBlacklist: any = ref()

cube.windows.message.on('received',async (id,content:any) => {
  // 查询我方召唤师
  if (id==='ChampSelect'){
    transValue.value = 'champRank'
    store.showSummonerInfoModal = false
    retryFunction()
  }else if (id==='GameStart' && isSwitchBlacklist){
    // 查询敌方召唤师
    store.summonerInfo = []
    setTimeout(async () => {
      store.endGameAfterInfo = await queryEnemySummonerIdAndSummonerName()
    }, 3000)
  }else if (id==='show-other-summoner' && isSwitchBlacklist){
    transValue.value = 'blacklist'
  }else if (id==='refresh'){
    location.reload()
  }else if (id==='queryMatch-add-blacklist'){
    handleMatchAddBlacklist(content)
  }else if (id==='champion'){
    handleRuneChampSelect(content)
  }
})

const retryFunction = async (): Promise<any> => {
  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const result = await querySummonerIdAndSummonerName()

    if (result.length === 5) {
      initSummonerInfo(result)
      return
    }else {
      attempts++
      if (attempts===3){
        initSummonerInfo(result)
      }
    }
  }
}

const initSummonerInfo = (result:SummonerInfoList[]) => {
  store.summonerInfo = result
  if (config.showMatchDetail){
    transValue.value='matchDetail'
  }
  if (isSwitchBlacklist){
    getCurrentBlacklist(store.summonerInfo)
  }
}

// 判读是否当前队友存在于共享排位笔记中
const getCurrentBlacklist = async (summonerInfo:SummonerInfoList[]) => {
  store.currentBlackList = []
  const areaSetting = localStorage.getItem('currentArea')
  // 获取当前队伍中的召唤师ID
  const summonerList = summonerInfo.reduce((res:string[],item:SummonerInfoList) => {
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
        const length = res.blackList.length
        if (length > 1){
          transValue.value = 'blacklist'
        }
        handleBlacklist.value.watchCheckRankNote(length)
      })
  }
}
// 窗口拖动
const handldDrge = () => {
  cube.windows.current.dragMove()
}
// 关闭抽屉
const closeDrawer = () => {
  queryMatchAddition.value.active = false
}
// 处理选择英雄结束后的操作
const handleRuneChampSelect = (content:any) => {
  const champ: { data: number; eventType: string; uri: string } =  JSON.parse(content.value)
  runeChampSelect.value.watchChampSelect(champ)
  if (champ.data !== 0 ){
    transValue.value = 'rune'
  }else {
    transValue.value = 'champRank'
  }
}
// 处理从查询战绩页面过来的添加排位笔记操作
const handleMatchAddBlacklist = (content:any) => {
  transValue.value = 'blacklist'
  queryMatchAddition.value.active=true
  queryMatchAddition.value.blacklistId=content.summonerId
  queryMatchAddition.value.gameAfterId=content.gameId
  queryMatchAddition.value.blacklistName=content.name
}
</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

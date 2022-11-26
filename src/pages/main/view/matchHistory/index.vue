<template>
  <div style="overflow: hidden;">
    <n-space>
      <left-card @summonerId="querySpecialSummoner($event)" @backHome="backHome"></left-card>
      <n-space>
        <bar-k-d-a @summonerId="querySpecialSummoner($event)"
                   v-if="pageCount==4" class="slide-in-right"/>
        <standing :matchData="matchData"
                  @changePage="backHome"
                  @toGameDetailsPage="toGameDetailsPage($event)"
                  v-else-if="pageCount==2" class="slide-in-right"/>
        <gameDetails v-else-if="pageCount==3"
                     class="slide-in-right"
                     :lastPage="lastPage"/>
        <recent-game v-else-if="pageCount==1"
                     @toGameDetailsPage="toGameDetailsPage($event)"
                     @summonerId="querySpecialSummoner($event)"
                     class="slide-in-right"/>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import LeftCard from "./leftCard.vue";
import BarKDA from "./barKDA.vue";
import Standing from "./standing.vue";
import GameDetails from "./matchGameDetils.vue";
import RecentGame from "./recentGame.vue";
import {NSpace} from "naive-ui";
import {onBeforeMount, Ref, ref} from "vue";
import {matchStore} from "../../store";
import {storeToRefs} from "pinia/dist/pinia";
import {getSummonerNickName} from "../../lcu/matchHistoryLcu";
import {queryMatchSummonerInfo} from "../../lcu/matchHistoryLcu";
import '../../utils/echarts';

const matchData:Ref<any> = ref([])
const lastPage = ref(0)
const store = matchStore()
const {
  summonerInfo,
  echartsData,
  currentQueryGameId,
  currentSummonerName,
  pageCount,
  querySummonerId
}:any = storeToRefs(store)

// 获取对应的图表数据
const getChartsData = (res:any) => {
  if (res === null){return}
  echartsData.value = {name: [], data: [], kdaHistory: [], horse: [],summonerId:[]}
  for (const re of res) {
    echartsData.value.name.push(re.name)
    echartsData.value.data.push(re.score)
    echartsData.value.kdaHistory.push(re.kdaHistory)
    echartsData.value.horse.push(re.horse)
    echartsData.value.summonerId.push(re.summonerId)
  }
}

onBeforeMount(async () => {
  const res = await getSummonerNickName()
  summonerInfo.value = []
  summonerInfo.value = res
  getChartsData(summonerInfo.value)
})
// 查询指定召唤师历史战绩
const querySpecialSummoner = async (summonerData:any) => {
  pageCount.value = 2
  currentSummonerName.value = summonerData.name
  querySummonerId.value = summonerData.summonerId
  const res = await queryMatchSummonerInfo(summonerData.summonerId)
  matchData.value = res
}
// 进入战绩详情页面
const toGameDetailsPage = (pageInfo:any) => {
  lastPage.value= pageInfo.lastPage
  pageCount.value = 3
  currentQueryGameId.value = pageInfo.gameId
}
// 回到首页
const backHome = () => {
  pageCount.value=1
  currentSummonerName.value = ''
}

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);
</style>

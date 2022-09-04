<template>
  <div style="overflow: hidden;">
    <n-space>
      <left-card @summonerId="getSummonerId($event)" @backHome="backHome"></left-card>
      <n-space>
<!--        <bar-k-d-a @summonerId="getSummonerId($event)"-->
<!--          v-if="pageCount==1" class="slide-in-right"></bar-k-d-a>-->
<!--        <standing :matchData="matchData"-->
<!--                  @changePage="backHome"-->
<!--                  @toGameDetailsPage="toGameDetailsPage($event)"-->
<!--                  v-else-if="pageCount==2" class="slide-in-right"></standing>-->
<!--        <gameDetails v-else-if="pageCount==3" class="slide-in-right"-->
<!--                     @changePageSencond="() => {pageCount=2}"></gameDetails>-->
        <recent-game></recent-game>
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
import LeftCard from "@/render/components/matchHistory/leftCard";
import BarKDA from "@/render/components/matchHistory/barKDA";
import Standing from "@/render/components/matchHistory/standing";
import GameDetails from "@/render/components/matchHistory/gameDetails";
import RecentGame from "@/render/components/matchHistory/recentGame";
import {NSpace} from "naive-ui";
import {onBeforeMount, ref} from "vue";
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {getSummonerNickName, queryMatchSummonerInfo} from "@/utils/main/lcu";
import {appConfig} from "@/utils/main/config";
import {createHttp1Request} from "@/utils/league-connect";
import {querySummonerIDInProgress} from "@/utils/render/matchHistoryLcu";

document.title = 'MatchHistory'

let matchData = ref([])
let pageCount = ref(1)
const store = useStore()
const {
  summonerInfo,
  echartsData,
  currentQueryGameId,
  currentSummonerName,
  currentTeam,
  currentEchartData
} = storeToRefs(store)
const credentials = appConfig.get('credentials')

const getChartsData = (res) => {
  echartsData.value = {name: [], data: [], kdaHistory: [], horse: [],summonerId:[]}
  for (const re of res) {
    echartsData.value.name.push(re.name)
    echartsData.value.data.push(re.score)
    echartsData.value.kdaHistory.push(re.kdaHistory)
    echartsData.value.horse.push(re.horse)
    echartsData.value.summonerId.push(re.summonerId)
  }
  currentEchartData.value = echartsData.value
}
onBeforeMount(async () => {
  const clientStatus = (await createHttp1Request({
    method: "GET",
    url: `/lol-gameflow/v1/gameflow-phase/`,
  }, credentials)).json()

  if (clientStatus === '"InProgress"'){
    var summonerId = await querySummonerIDInProgress(credentials)
    var res = await getSummonerNickName(credentials,summonerId)
  }else {
    var res = await getSummonerNickName(credentials)
  }

  currentTeam.value = 1
  summonerInfo.value = []
  summonerInfo.value = res
  getChartsData(summonerInfo.value)
})

const getSummonerId = async (summonerData) => {
  pageCount.value = 2
  currentSummonerName.value = summonerData.name
  const res = await queryMatchSummonerInfo(credentials, summonerData.summonerId)
  matchData.value = res
}

const toGameDetailsPage = (gameId) => {
  pageCount.value = 3
  currentQueryGameId.value = gameId
}

const backHome = () => {
  pageCount.value=1
  currentSummonerName.value = ''
}

</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
</style>

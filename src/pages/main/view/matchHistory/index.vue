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
  // const res = await getSummonerNickName()
  const res = [{
    "summonerId": 4016690740,
    "puuid": "c9b0fd7a-59cd-54c6-bf7e-6b5241ebee84",
    "name": "18岁游走型中单",
    "iconId": 5430,
    "score": 100,
    "horse": "浑水摸鱼",
    "kdaHistory": "5/2/3  4/14/14  1/4/1  10/2/25  5/1/1  1/6/1  1/5/11  3/11/15  6/14/10  4/11/5  ",
    "simpleMatchHistory": {
      "winInfo": {
        "info": "3连败中",
        "isWin": false
      },
      "regularPostion": "中单",
      "simpleMatch": [
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png",
          "position": "MIDDLE",
          "kill": 5,
          "deaths": 2,
          "assists": 3,
          "isWin": false,
          "gameId": 7722419523
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Yone.png",
          "position": "MIDDLE",
          "kill": 4,
          "deaths": 14,
          "assists": 14,
          "isWin": false,
          "gameId": 7722141731
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png",
          "position": "MIDDLE",
          "kill": 1,
          "deaths": 4,
          "assists": 1,
          "isWin": false,
          "gameId": 7722029115
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Sejuani.png",
          "position": "MIDDLE",
          "kill": 10,
          "deaths": 2,
          "assists": 25,
          "isWin": true,
          "gameId": 7721859739
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png",
          "position": "NONE",
          "kill": 5,
          "deaths": 1,
          "assists": 1,
          "isWin": false,
          "gameId": 7721744733
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png",
          "position": "TOP",
          "kill": 1,
          "deaths": 6,
          "assists": 1,
          "isWin": false,
          "gameId": 7720459705
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png",
          "position": "MIDDLE",
          "kill": 1,
          "deaths": 5,
          "assists": 11,
          "isWin": false,
          "gameId": 7720402588
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png",
          "position": "TOP",
          "kill": 3,
          "deaths": 11,
          "assists": 15,
          "isWin": true,
          "gameId": 7719334272
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Sylas.png",
          "position": "BOTTOM",
          "kill": 6,
          "deaths": 14,
          "assists": 10,
          "isWin": false,
          "gameId": 7719161473
        },
        {
          "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Sylas.png",
          "position": "JUNGLE",
          "kill": 4,
          "deaths": 11,
          "assists": 5,
          "isWin": false,
          "gameId": 7718882537
        }
      ]
    },
    "rankPoint": "Lv: 264"
  }]
  console.log(res)
  summonerInfo.value = []
  summonerInfo.value = res
  getChartsData(summonerInfo.value)
})
// 查询指定召唤师历史战绩
const querySpecialSummoner = async (summonerData:any) => {
  pageCount.value = 2
  currentSummonerName.value = summonerData.name
  querySummonerId.value = summonerData.summonerId
  const res = await queryMatchSummonerInfo(summonerData.puuid,summonerData.summonerId)
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

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
  const res = [
    {
      "summonerId": 2947489903,
      "puuid": "c9b0fd7a-59cd-54c6-bf7e-6b5241ebee84",
      "name": "多元函数积分学",
      "iconId": 5430,
      "score": 102,
      "horse": "浑水摸鱼",
      "kdaHistory": "2/2/0  2/13/14  6/5/18  6/8/1  7/12/13  2/4/2  6/7/6  7/11/8  8/4/3  5/9/6  ",
      "simpleMatchHistory": {
        "winInfo": {
          "info": "2连败中",
          "isWin": false
        },
        "regularPostion": "中单",
        "simpleMatch": [
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png",
            "position": "NONE",
            "kill": 2,
            "deaths": 2,
            "assists": 0,
            "isWin": false,
            "gameId": 2200910139
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png",
            "position": "BOTTOM",
            "kill": 2,
            "deaths": 13,
            "assists": 14,
            "isWin": false,
            "gameId": 2200588446
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png",
            "position": "MIDDLE",
            "kill": 6,
            "deaths": 5,
            "assists": 18,
            "isWin": true,
            "gameId": 2200585702
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Yone.png",
            "position": "MIDDLE",
            "kill": 6,
            "deaths": 8,
            "assists": 1,
            "isWin": false,
            "gameId": 2200583956
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png",
            "position": "TOP",
            "kill": 7,
            "deaths": 12,
            "assists": 13,
            "isWin": true,
            "gameId": 2200550444
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png",
            "position": "NONE",
            "kill": 2,
            "deaths": 4,
            "assists": 2,
            "isWin": false,
            "gameId": 2200539795
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png",
            "position": "NONE",
            "kill": 6,
            "deaths": 7,
            "assists": 6,
            "isWin": true,
            "gameId": 2200547293
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png",
            "position": "BOTTOM",
            "kill": 7,
            "deaths": 11,
            "assists": 8,
            "isWin": false,
            "gameId": 2200554061
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png",
            "position": "MIDDLE",
            "kill": 8,
            "deaths": 4,
            "assists": 3,
            "isWin": true,
            "gameId": 2200533116
          },
          {
            "champImg": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png",
            "position": "MIDDLE",
            "kill": 5,
            "deaths": 9,
            "assists": 6,
            "isWin": false,
            "gameId": 2200226969
          }
        ]
      },
      "rankPoint": "Lv: 2"
    }
  ]
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

<script setup lang="ts">
import {ref, Ref} from "vue";
import QuerySummoner from "@/recentMatch/utils/querySummoner";
import Dashboard from "@/recentMatch/components/dashboard.vue";
import RecentMatchList from "@/recentMatch/components/recentMatchList.vue";
import {RecentAllSumInfo, RecentSumInfo} from "@/recentMatch/utils/queryTypes";
import QueryMatch from "@/recentMatch/utils/queryMatch";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import MatchContent from "@/queryMatch/common/matchContent.vue";
import MatchDetails from "@/queryMatch/utils/matchDetails";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import {NResult} from "naive-ui";
import NullPage from "@/recentMatch/components/nullPage.vue";

const querySummoner = new QuerySummoner()
const queryMatch = new QueryMatch()

const isLcuErr = ref(false)
const friendList: Ref<RecentSumInfo[]> = ref([])
const enemyList: Ref<RecentSumInfo[]> = ref([])
const queueId: Ref<number> = ref(0)
const winCount = ref({friend: [0, 0], enemy: [0, 0]})
const isFriCount = ref(true)

const currentId = ref(0)
const matchDetials = new MatchDetails()
const isDetailModal = ref(false)
const isDetailModalLeft = ref(true)
const participantsInfo: Ref<ParticipantsInfo | null> = ref(null)

// cube.windows.openDevTools(cube.windows.current.id())

cube.windows.getWindowByName('main').then((mainWin: any) => {
  cube.windows.message
    .invoke(<number>mainWin.id, 'getMatchList', '')
    .then((simpleMatchList: { [key: string]: SimpleMatchTypes[] }) => {
      init(simpleMatchList)
    })
})

const init = (simpleMatchList: { [key: string]: SimpleMatchTypes[] }) => {
  querySummoner.fromLcuQuery().then(async (allSumInfo: RecentAllSumInfo | null) => {
    if (allSumInfo === null) {
      isLcuErr.value = true
      return
    }
    queueId.value = allSumInfo.queueId
    // 是否从缓存数据中获取队友的战绩数据
    Object.keys(simpleMatchList).length > 0
      ? getSumInfoFromCache(allSumInfo.friendList, simpleMatchList)
      : await getCompleteSumInfo(allSumInfo.friendList, allSumInfo.queueId, true)

    await getCompleteSumInfo(allSumInfo.enemyList, allSumInfo.queueId, false)
    // 判断敌我双方谁的赢场最多
    isFriCount.value = winCount.value.friend[0] >= winCount.value.enemy[0]
  })
}

const getCompleteSumInfo = async (sumInfos: RecentSumInfo[], queueId: number, isFri: boolean) => {
  for (const summoner of sumInfos) {
    // 根据已获取的召唤师puuid获取每一个召唤师的战绩数据
    const resultList = await queryMatch.queryMatchHistory(summoner.puuid, queueId, summoner.summonerState)
    summoner.matchList = resultList[0]
    // 判断是否为小代
    if (resultList[2]) {
      summoner.summonerState = 'S'
    }else {
      summoner.summonerState = 'Z'
    }

    // 判断是否为友方或敌方，分别写入不同的数据
    const targetList = isFri ? friendList.value : enemyList.value
    const countList = isFri ? winCount.value.friend : winCount.value.enemy

    countList[0] += resultList[1]
    countList[1] += resultList[0].length
    targetList.push(summoner)
  }
}


const getSumInfoFromCache = (sumInfos: RecentSumInfo[], simpleMatchList: { [key: string]: SimpleMatchTypes[] }) => {

  for (const sumInfo of sumInfos) {
    let winMatchCount = 0
    const matchListElement = simpleMatchList[String(sumInfo.summonerId)].map((match) => {
      winMatchCount = match.isWin ? winMatchCount + 1 : winMatchCount
      return {
        champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${match.champImgUrl}`,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        isWin: match.isWin,
        gameId: match.gameId,
        queueId: match.queueId,
      }
    })
    // 判断是否为小代
    if (queryMatch.isExcelPlayer(sumInfo.summonerState, matchListElement)) {
      sumInfo.summonerState = 'S'
    }else {
      sumInfo.summonerState = 'Z'
    }
    sumInfo.matchList = matchListElement
    friendList.value.push(sumInfo)
    winCount.value.friend[0] += winMatchCount
    winCount.value.friend[1] += matchListElement.length
  }
}

const openDetailDrawer = async (gameId: number, summonerId: number, isFri: boolean) => {
  isDetailModalLeft.value = isFri
  const matchInfo = await matchDetials.queryGameDetail(gameId, summonerId)
  if (matchInfo !== null) {
    currentId.value = summonerId
    participantsInfo.value = matchInfo
  }
  isDetailModal.value = true
}
const closeModalOutside = (event) => {
  if (!event.target.closest('.bg-white')) {
    isDetailModal.value = false
  }
}
</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :win-count="winCount" :is-fri-count="isFriCount"/>

    <null-page v-if="isLcuErr"/>

    <div v-else class="flex justify-between">
      <recent-match-list @show-detail="openDetailDrawer"
                         :sum-list="friendList" :queue-id="queueId" :is-fri="true"/>
      <recent-match-list @show-detail="openDetailDrawer"
                         :sum-list="enemyList" :queue-id="queueId" :is-fri="false"/>
    </div>
  </div>
  <!-- Modal -->
  <div v-if="isDetailModal" @click="closeModalOutside"
       class="fixed inset-0 bg-neutral-950 bg-opacity-40
       flex items-center z-50" :class="isDetailModalLeft?'justify-end':'justify-start'">
    <div class="bg-white text-neutral-900 p-3 h-full box-border rounded dark:bg-zinc-900 dark:text-neutral-200" style="width: 632px">
      <match-content
        v-if="participantsInfo!==null"
        :header-info="participantsInfo.headerInfo"
        :team-one="participantsInfo.teamOne"
        :team-two="participantsInfo.teamTwo"
        :queue-id="participantsInfo.queueId"
        :summoner-id="currentId"
        :is-game-in="true"
      />
      <div class="w-full h-full flex justify-center items-center" v-else>
        <n-result
          size="large"
          status="418"
          title="获取当前战绩数据异常"
          description="请切换其它战绩, 尝试再次获取数据..."
        >
        </n-result>
      </div>
    </div>

  </div>
</template>

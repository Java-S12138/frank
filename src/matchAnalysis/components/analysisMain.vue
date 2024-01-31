<script setup lang="ts">
import {NCard, NDrawer, NResult,NDrawerContent} from "naive-ui";
import AnalysisSum from "./analysisSum.vue";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {SummonerInfoList} from "@/main/views/teammate/teammateTypes";
import {Ref, ref} from "vue";
import {SummonerAnaInfo} from "@/matchAnalysis/utils/MatchAnalysisTypes";
import {findTopChamp} from "@/main/views/teammate/utils";
import MatchContent from "@/queryMatch/common/matchContent.vue";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import MatchDetails from "@/queryMatch/utils/matchDetails";

const {showType,summonerList} = defineProps<{showType:boolean,summonerList:SummonerAnaInfo[]}>()

const matchDetials = new MatchDetails()
// 当前游戏模式ID
const queueId:number = (JSON.parse(localStorage.getItem('gameInfo') as string)).queueId
const isDetailDrawer = ref(false)
const currentId = ref(0)
const participantsInfo: Ref<ParticipantsInfo | null> = ref(null)

const openDetailDrawer = async (gameId: number, summonerId: number) => {
  const matchInfo = await matchDetials.queryGameDetail(gameId, summonerId)
  if (matchInfo !== null) {
    currentId.value = summonerId
    participantsInfo.value = matchInfo
  }
  isDetailDrawer.value = true
}
</script>

<template>
  <n-card size="small" content-style="padding:8px" style="height: 512px;" class="mt-2 shadow">
    <div class="flex justify-between">
      <analysis-sum
        v-for="summoner in summonerList"
        :name="summoner.name"
        :summoner-id="summoner.summonerId"
        :img-url="summoner.imgUrl"
        :is-thumb-up="summoner.isThumbUp"
        :rank-list="summoner.rankList"
        :match-list="summoner.matchList"
        :match-analysis="summoner.matchAnalysis"
        :show-type="showType"
        :queue-id="queueId"
        :open-detail-drawer="openDetailDrawer"
      />
    </div>
  </n-card>

  <n-drawer
    class="rounded-l-xl"
    v-model:show="isDetailDrawer"
    @after-leave="() => participantsInfo = null"
    :width="630" placement="right">
    <n-drawer-content>
      <match-content
        v-if="participantsInfo !== null"
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
    </n-drawer-content>
  </n-drawer>
</template>



<script setup lang="ts">
import MatchList from "./matchList.vue";
import MatchContent from "../common/matchContent.vue";
import useMatchStore from "@/queryMatch/store";
import {NResult} from "naive-ui";

const matchStore = useMatchStore()
const searchSum = (summonerId: number) => {
  matchStore.init(summonerId)
}
</script>

<template>
  <div class="flex">
    <match-list/>
    <div class="flex-grow p-3 ml-7"
         :key="matchStore.participantsInfo.gameId"
         v-if="matchStore.participantsInfo !== null">
      <match-content
        :header-info="matchStore.participantsInfo.headerInfo"
        :team-one="matchStore.participantsInfo.teamOne"
        :team-two="matchStore.participantsInfo.teamTwo"
        :queue-id="matchStore.participantsInfo.queueId"
        :summoner-id="matchStore.summonerId"
        @change-sum="searchSum"
      />
    </div>
    <div class="w-full flex justify-center items-center"
         style="height: 594px;" v-else>
      <n-result
        size="large"
        status="418"
        title="获取当前战绩数据异常"
        description="请在左侧切换其它战绩, 尝试再次获取数据..."
      >
        <template #footer>
        </template>
      </n-result>
    </div>
  </div>
</template>


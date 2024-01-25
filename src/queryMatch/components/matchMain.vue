<script setup lang="ts">
import MatchList from "./matchList.vue";
import {NCard} from "naive-ui"
import MatchContent from "../common/matchContent.vue";
import useMatchStore from "@/queryMatch/store";

const matchStore = useMatchStore()

const searchSum = (summonerId:number) => {
  matchStore.init(summonerId)
}
</script>

<template>
  <n-card
    class="shadow h-full" size="small" style="height: 596px;"
    content-style="padding:0 0 0 12px">
    <div class="flex">
      <match-list :key="matchStore.summonerId"/>
      <div class="flex-grow p-3 ml-7"
           v-if="matchStore.participantsInfo!==null"
           :key="matchStore.participantsInfo.gameId">
        <match-content
          :header-info="matchStore.participantsInfo.headerInfo"
          :team-one="matchStore.participantsInfo.teamOne"
          :team-two="matchStore.participantsInfo.teamTwo"
          :summoner-id="matchStore.summonerId"
          @change-sum="searchSum"
        />
      </div>
    </div>
  </n-card>
</template>


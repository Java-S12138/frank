<script setup lang="ts">
import MatchList from "./matchList.vue";
import MatchContent from "../common/matchContent.vue";
import useMatchStore from "@/queryMatch/store";

const matchStore = useMatchStore()

const searchSum = (summonerId:number) => {
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
        :summoner-id="matchStore.summonerId"
        @change-sum="searchSum"
      />
    </div>
  </div>
</template>


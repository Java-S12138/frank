<script setup lang="ts">
import QueryHeader from "./components/queryHeader.vue";
import SummonerInfoView from "./components/summonerInfoView.vue";
import MatchMain from "./components/matchMain.vue";
import useMatchStore from "@/queryMatch/store";

const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}

const matchStore = useMatchStore()
matchStore.init()

</script>

<template>
  <div v-if="matchStore.sumInfo!==null" class="main bg-neutral-100 dark:bg-neutral-900">
    <div @mousedown="dragMove()" class="dragDiv"></div>

    <query-header class="h-10 mb-2"/>

    <div class="flex">
      <summoner-info-view :sum-info="matchStore.sumInfo"/>

      <div class="ml-3 flex-grow">
        <match-main :summoner-id="matchStore.summonerId"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {NLayout, NLayoutHeader,NLayoutSider} from 'naive-ui'
import QueryHeader from "./components/queryHeader.vue";
import SummonerInfo from "./components/summonerInfo.vue";

const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}
</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <div @mousedown="dragMove()" class="dragDiv"></div>

    <query-header class="h-10 mb-4"/>

    <div class="flex">
      <summoner-info style="width: 246px;"/>

      <div class="flex-grow">

      </div>
    </div>
  </div>
</template>

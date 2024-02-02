<script setup lang="ts">
import QueryHeader from "./components/queryHeader.vue";
import SummonerInfoView from "./components/summonerInfoView.vue";
import MatchMain from "./components/matchMain.vue";
import useMatchStore from "@/queryMatch/store";
import {NCard, NResult} from "naive-ui";
import MatchErr from "@/queryMatch/components/matchErr.vue";
import {onBeforeMount} from "vue";

const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}

const matchStore = useMatchStore()

onBeforeMount(() => {
  // 判断是否从其它窗口启动的此窗口
  const isQueryRecord = localStorage.getItem('queSumMatch')

  if (isQueryRecord === null){
    matchStore.init()
  }else {
    const locSumId = JSON.parse((localStorage.getItem('sumInfo') as string)).summonerId
    matchStore.init(Number(isQueryRecord),locSumId)
    localStorage.removeItem('queSumMatch')
  }
})
</script>

<template>
  <div v-if="matchStore.sumInfo!==null" class="main bg-neutral-100 dark:bg-neutral-900">
    <div @mousedown="dragMove()" class="dragDiv"></div>
    <query-header class="h-10 mb-2"/>

    <div class="flex">
      <summoner-info-view
        :key="matchStore.summonerId"
        :sum-info="matchStore.sumInfo"/>

      <div class="ml-3 flex-grow">
        <n-card
          class="shadow h-full" size="small" style="height: 596px;"
          content-style="padding:0 0 0 12px">

          <match-err v-if="matchStore.matchList === null" />

          <match-main
            v-else-if="matchStore.matchList.length!==0"
            :summoner-id="matchStore.summonerId"/>

          <div v-else class="w-full h-full flex justify-center items-center">
            <n-result
              size="large"
              status="404"
              title="召唤师数据为空"
              description="此页数不存在数据，请返回前一页"
            >
              <template #footer>
                生活总归带点荒谬
              </template>
            </n-result>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

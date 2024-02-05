<script setup lang="ts">
import QueryHeader from "./components/queryHeader.vue";
import SummonerInfoView from "./components/summonerInfoView.vue";
import MatchMain from "./components/matchMain.vue";
import useMatchStore from "@/queryMatch/store";
import {NCard, NResult,NDrawer,NDrawerContent} from "naive-ui";
import MatchErr from "@/queryMatch/components/matchErr.vue";
import {onBeforeMount, Ref, ref} from "vue";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import MatchContent from "@/queryMatch/common/matchContent.vue";

const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}

const matchStore = useMatchStore()
const blackMatchDrawer = ref(false)
const blackMatchDetails:Ref<[ParticipantsInfo,number]|null> = ref(null)

onBeforeMount(() => {
  // 判断是否从其它窗口启动的此窗口
  const isQueryRecord = localStorage.getItem('queSumMatch')

  if (isQueryRecord === null){
    matchStore.init()
  }else {
    handleBlackListMatch(isQueryRecord).then(() => {
      localStorage.removeItem('queSumMatch')
    })
  }
})

const handleBlackListMatch = async (isQueryRecord:string) => {
  const locSumId = JSON.parse((localStorage.getItem('sumInfo') as string)).summonerId
  const queSumMatchInfo = isQueryRecord.split('-')
  if (queSumMatchInfo[1] !=='') {
    const participantsInfo = await matchStore.queryMatchDetail(Number((queSumMatchInfo[1])),Number(queSumMatchInfo[0]))
    if (participantsInfo===null){return}
    blackMatchDetails.value = [participantsInfo,Number(queSumMatchInfo[0])]
    blackMatchDrawer.value = true
  }
  await matchStore.init(Number(queSumMatchInfo[0]),locSumId)
}
const clearBlackMatch = () => {
  blackMatchDetails.value = null
  blackMatchDrawer.value = false
}
</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <div @mousedown="dragMove()" class="dragDiv"></div>

    <query-header class="h-10 mb-2"/>

    <div class="flex">
      <summoner-info-view
        v-if="matchStore.sumInfo"
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
          <div v-else-if="!matchStore.matchLoading" class="w-full h-full flex justify-center items-center">
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

  <n-drawer v-model:show="blackMatchDrawer"  @after-leave="clearBlackMatch"
            class="rounded-l-xl" :width="658" placement="right">
    <n-drawer-content body-content-style="padding:24px 12px" v-if="blackMatchDetails">
      <match-content
        :queue-id="blackMatchDetails[0].queueId"
        :header-info="blackMatchDetails[0].headerInfo"
        :team-two="blackMatchDetails[0].teamTwo"
        :summoner-id="blackMatchDetails[1]"
        :is-game-in="true"
        :team-one="blackMatchDetails[0].teamOne"
        />
    </n-drawer-content>
  </n-drawer>
</template>

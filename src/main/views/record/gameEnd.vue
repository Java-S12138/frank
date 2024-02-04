<script setup lang="ts">
import {NDrawerContent, NIcon, NButton, NTabPane, NTabs, useMessage,TabsInst} from "naive-ui"
import {CircleX} from "@vicons/tabler";
import SummonerEnd from "@/main/views/record/summonerEnd.vue";
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {Ref, ref} from "vue";
import AddBlackList from "@/main/views/record/addBlackList.vue";
import {HaterStructTypes} from "@/main/views/record/blackListTypes";

const {closeDrawer, teamOne, teamTwo,gameId,platformId} = defineProps<{
  closeDrawer: () => void,
  teamOne: SummonerDetailInfo[]
  teamTwo: SummonerDetailInfo[],
  gameId:number,
  platformId:string
}>()

const message = useMessage()
const tabsInstRef = ref<TabsInst | null>(null)
const valueRef = ref('friend')

const hInfo:Ref<{name:string,sumId:string,isTeamOne:boolean}|null> = ref(null)
const isHaterState = ref(true)

const handleBeforeLeave = (tabName: string) => {
  switch (tabName) {
    case 'add':
      return false
    default: return true
  }
}
const handleAddBlackList = (
  isHater: boolean,
  requiredInfo:{name:string,sumId:string,isTeamOne:boolean}) =>
{
  hInfo.value = requiredInfo
  isHaterState.value = isHater
  valueRef.value = 'add'
}

const backSelectState = (isTeamOne:boolean) => {
  if (isTeamOne){
    valueRef.value = 'friend'
  }
  valueRef.value = 'enemy'
}
</script>

<template>
  <n-drawer-content body-content-style="padding:0 8px">
    <n-button class="absolute z-50" style="right: 8px;top: 10px"
              @click="closeDrawer"
              :focusable="false" text>
      <template #icon>
        <n-icon :size="24" :component="CircleX"/>
      </template>
    </n-button>
    <n-tabs
      ref="tabsInstRef" v-model:value="valueRef"
      tab-style="padding:8px 0px" type="line" animated
      @before-leave="handleBeforeLeave"
    >
      <n-tab-pane name="friend" tab="友方召唤师">
        <summoner-end
          :is-team-one="true"
          :sum-list="teamOne"
          :addBlackList="handleAddBlackList"
        />
      </n-tab-pane>
      <n-tab-pane name="enemy" tab="敌方召唤师">
        <summoner-end
          :is-team-one="false"
          :sum-list="teamTwo"
          :addBlackList="handleAddBlackList"/>
      </n-tab-pane>
      <n-tab-pane name="add" tab="新增">
        <add-black-list
          v-if="hInfo"
          :is-hater="isHaterState"
          :h-info="hInfo"
          :platform-id="platformId"
          :game-id="gameId"
          :back-select-state="backSelectState"
        />
      </n-tab-pane>
    </n-tabs>
    <text
      style="left: 77px;bottom: 2px"
      class="absolute text-gray-400 text-xs">
      {{valueRef==='add'?'添加成功后下次遇见将弹出提示':'点击英雄头像可查看召唤师战绩'}}
    </text>
  </n-drawer-content>
</template>



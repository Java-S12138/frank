<script setup lang="ts">
import {ref, Ref, onMounted} from "vue";
import {NAvatar, NList,NTabs,NTabPane, NScrollbar,NSkeleton,NListItem, NSpace, NTag, useMessage, NDrawerContent} from "naive-ui";
import {getRestraintData} from "./utils";
import {ChampDetailDrawer} from "./rankTypes";
import {invokeLcu} from "@/lcu"
import ChampWinRate from "./champWinRate.vue";

const {champId,lane,tier,is101,selectedList} = defineProps<ChampDetailDrawer>()

const message = useMessage()
const advancedList:Ref<[string,string,number,number,number][]> = ref([])
const regressList:Ref<[string,string,number,number,number][]> = ref([])
let preselectActionID:number|null = null

onMounted(async () => {
  const res = await getRestraintData(champId,lane,tier,is101,localStorage.getItem('rankVers') as string)
  if (res!==null){
    advancedList.value = res.filter(element => element[2] >= 50).reverse()
    regressList.value = res.filter(element => element[2] < 50)
  }else {
    message.error('获取英雄数据异常')
  }
})

// 预选英雄
const preselectChamp = async (champId:number) => {
  if (preselectActionID===null){
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    if (res===null){
      message.error('请在选择英雄阶段使用')
      return
    }
    const localPlayerCellId = res.localPlayerCellId
    const actions = res.actions
    for (let action of actions) {
      for (let actionElement of action) {
        if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
          preselectActionID = actionElement.id
          return champSelectPatchAction(preselectActionID,champId)
        }
      }
    }
  }else {
    return champSelectPatchAction(preselectActionID,champId)
  }
}

const champSelectPatchAction = async (actionID:any, champId:number) => {
  const localBody = {
    "completed": false,
    "type": 'pick',
    "championId": champId
  }
  try {
    invokeLcu('patch',
      `/lol-champ-select/v1/session/actions/${actionID}`,
      JSON.stringify(localBody))
    return true
  } catch (e) {
    return false
  }
}
</script>

<template>
  <n-drawer-content body-content-style="padding:0 21px">
    <n-list>
      <template #header>
        <div class="flex h-12 gap-x-3">
            <n-avatar
              class="cursor-pointer hover:rounded"
              style="transition: border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);"
              round
              :bordered="false"
              :size="48"
              @click="preselectChamp(Number(selectedList[3]))"
              :src=selectedList[0]
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            />
          <div class="flex-grow">
            <n-space vertical :size=[0,2]>
              <text>{{ selectedList[1] }}</text>
              <n-space justify="space-between">
                <text class="text-gray-400" style="font-size: 13px">当前英雄胜率•请看下方数据</text>
              </n-space>
            </n-space>
          </div>
          <div class="absolute top-3" style="right: 20px"
               :class="'imgT'+selectedList[2]"></div>
        </div>
      </template>

      <n-tabs size="small" type="segment" animated>
        <n-tab-pane name="advanced" tab="优势对线">
          <ChampWinRate :champ-list="advancedList" :preselect-champ="preselectChamp" />
        </n-tab-pane>
        <n-tab-pane name="regress" tab="劣势对线">
          <ChampWinRate :champ-list="regressList" :preselect-champ="preselectChamp" />
        </n-tab-pane>
      </n-tabs>
    </n-list>
    <text class="absolute  text-gray-400" style="font-size: 12px;left: 56px;bottom: 6px">
      点击头像可在 [选择英雄阶段] 预选英雄</text>
  </n-drawer-content>
</template>

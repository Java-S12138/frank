<script setup lang="ts">
import {invokeLcu} from "@/lcu";
import {ref, Ref, onMounted} from "vue";
import {NAvatar, NList, NScrollbar,NSkeleton,NListItem, NSpace, NTag, useMessage, NDrawerContent} from "naive-ui";
import {getRestraintData} from "./utils";
import {ChampDetailDrawer} from "./rankTypes";

const {champId,lane,tier,is101,selectedList} = defineProps<ChampDetailDrawer>()

const message = useMessage()
const isRestraint = ref(true)
const restraintList:Ref<[string,string,number,number,number][]> = ref([])
let preselectActionID:number|null = null

onMounted(async () => {
  const res = await getRestraintData(champId,lane,tier,is101)
  if (res!==null){
    restraintList.value = res
  }else {
    message.warning('当前英雄数据异常')
  }
})

// 预选英雄
const preselectChamp = async (champId:number) => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('预选英雄功能 需要订阅服务')
    return
  }
  if (preselectActionID===null){
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    if (res?.success === false){
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
    invokeLcu('patch',`/lol-champ-select/v1/session/actions/${actionID}`,[localBody])
    return true
  } catch (e) {
    return false
  }
}

// 改变是否为英雄克制 或者优势对线
const changeRes = () => {
  isRestraint.value = !isRestraint.value
  if (isRestraint.value) {
    restraintList.value.sort((x, y) => {
      return x[2] > y[2] ? 1 : -1
    })
  } else {
    restraintList.value.sort((x, y) => {
      return x[2] < y[2] ? 1 : -1
    })
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
                <text style="color: #d03050;cursor: pointer;font-size: 13px" @click=changeRes v-if="isRestraint">劣势对线</text>
                <text style="color: #18a058;cursor: pointer;font-size: 13px" @click=changeRes v-else>优势对线</text>
                <text class="text-gray-400" style="font-size: 13px">下方数据为当前英雄胜率</text>
              </n-space>
            </n-space>
          </div>
          <div class="absolute top-3" style="right: 20px"
               :class="'imgT'+selectedList[2]"></div>
        </div>
      </template>
      <n-list-item v-if="restraintList.length===0"
                   v-for="count in 5">
        <n-space>
          <n-skeleton height="48px" circle />
          <n-space vertical size="medium">
            <n-skeleton height="20px" width="216px" round />
            <n-skeleton height="20px" width="216px" round />
          </n-space>
        </n-space>
      </n-list-item>
      <n-scrollbar style="max-height: 350px;padding-right: 17px" v-else>
        <n-list-item v-for="champRes in restraintList">
          <div class="flex gap-x-3">
            <n-avatar
              class="cursor-pointer hover:rounded"
              style="transition: border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);"
              round
              lazy
              :bordered="false"
              :size="48"
              @click="preselectChamp(champRes[3])"
              :src=champRes[1]
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            />
            <div class="flex-grow flex flex-col  justify-between">
              <n-tag type="info" :bordered="false" size="small" round
                     style="justify-content: center;height: 20px;">
                {{ champRes[0] }}
              </n-tag>
              <n-tag :type="champRes[2] >= 50 ? 'success' :'error'" :bordered="false" size="small"
                     style="justify-content: center;height: 20px;" round>
                场数: {{ champRes[4] }}&emsp;胜率: {{champRes[2]}}%
              </n-tag>
            </div>
          </div>
        </n-list-item>
      </n-scrollbar>
    </n-list>
    <text class="absolute bottom-0 text-gray-400" style="font-size: 12px;left: 56px">
      点击头像可在 [ 选择英雄阶段 ] 预选英雄</text>
  </n-drawer-content>
</template>

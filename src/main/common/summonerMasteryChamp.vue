<script setup lang="ts">
import {NSpace,NScrollbar,NAvatar, NTag,NLayout, NLayoutSider,NResult,NSkeleton} from 'naive-ui'
import {onMounted, ref} from "vue";
import {queryMasteryChampList} from "@/lcu/aboutSummoner";

const {puuid,existChampList,maxH} = defineProps<
  {puuid:string,existChampList:string[][]|undefined, maxH:number }
>()
const champList:any = ref([])
const stylySco = `max-height:${maxH}px;padding-right: 13px`

onMounted(() => {
  if (existChampList !== undefined){
    champList.value = existChampList
  }else {
    queryMasteryChampList(puuid).then((value) => {
      if (value === null){
        champList.value = null
      }else {
        champList.value = value
      }
    })
  }
})
</script>

<template>
  <n-scrollbar v-if="champList.length === 0 " :style="stylySco">
    <n-space vertical :size="[0,15]" style="margin-top: 3px">
      <div class="flex" v-for="i in 6">
        <n-skeleton height="50px" width="50px" :sharp="false" style="margin-right: 8px;"/>
        <div class="flex-grow flex flex-col justify-between">
          <n-skeleton height="22px" width="100%" :sharp="false" />
          <n-skeleton height="22px" width="100%" :sharp="false" />
        </div>
      </div>
    </n-space>
  </n-scrollbar>
  <n-scrollbar v-else-if="champList.length !== 0" :style="stylySco">
    <div>
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="champ in champList"
                  style="height: 50px" has-sider>
          <n-layout-sider width="50" style="margin-right: 8px;">
            <div class="flex gap-x-3" >
              <div class="flex items-center justify-center rounded bg-blue-100" style="width: 50px;height: 50px;">
                <n-avatar
                  lazy
                  :size="42"
                  :src="champ[0]"
                  style="display: block"/>
              </div>
            </div>

          </n-layout-sider>
          <n-layout>
              <div class="flex flex-col justify-between h-full">
                <n-tag class="justify-center" size="small" :bordered="false" type="success">{{champ[1]}}</n-tag>
                <n-tag class="justify-center" size="small" :bordered="false" type="info">{{ champ[2] }}</n-tag>
              </div>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
  </n-scrollbar>
  <n-result v-else style="margin-top: 80px"
            status="418" title="数据获取失败" description="生活总归带点荒谬">
  </n-result>
</template>

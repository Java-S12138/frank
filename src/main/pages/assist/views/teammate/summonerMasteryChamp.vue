<script setup lang="ts">
import {NSpace,NScrollbar,NAvatar, NTag,NLayout, NLayoutSider,NResult} from 'naive-ui'
import {onMounted, ref} from "vue";
import {queryMasteryChampList} from "./utils";

const {puuid,existChampList} = defineProps<{puuid:string,existChampList:string[][]|undefined}>()
const champList:any = ref([])

onMounted(() => {
  if (existChampList!==undefined){
    champList.value = existChampList
  }else {
    queryMasteryChampList(puuid).then((value) => {
      if (value ===null){
        champList.value = null
      }else {
        champList.value = value
      }
    })
  }
})
</script>

<template>
  <n-scrollbar v-if="champList !== null" style="max-height: 378px;padding-right: 14px">
    <div class="fade-in-bottom">
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="champ in champList"
                  style="height: 50px" has-sider>
          <n-layout-sider width="50" style="margin-right: 8px;">
            <n-avatar
              :size="50"
              :src="champ[0]"
              style="display: block"/>
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
    <template #footer>
    </template>
  </n-result>
</template>

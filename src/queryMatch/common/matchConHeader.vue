<script setup lang="ts">
import {NGrid, NGi, NSpace} from "naive-ui"

const {titleList} = defineProps<{
  titleList:string[],title:string,changeShow:() => void
}>()
</script>

<template>
  <n-grid class="bg-neutral-100 rounded" :cols="7">
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局日期</text>
        <text>{{ titleList[0] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局类型</text>
        <text>{{ titleList[2] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">开始时间</text>
        <text>{{ titleList[1] }}</text>
      </n-space>
    </n-gi>

    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">数据显示</text>
        <text @click="changeShow" class="cursor-pointer text-emerald-500">{{ title }}</text>
      </n-space>
    </n-gi>

    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">双方比分</text>
        <div>
          <text style="color: #FF6666">{{ titleList[4] }}</text>
            /
          <text style="color: #66B3FF">{{ titleList[5] }}</text>
        </div>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局时长</text>
        <text>{{ titleList[3] }}分钟</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">经济差距</text>
        <text v-if="titleList[6]>titleList[7]" style="color: #FF6666">{{ (titleList[6]-titleList[7] ).toFixed(1)}} K</text>
        <text v-else style="color: #66B3FF">{{ (titleList[7]-titleList[6] ).toFixed(1)}} K</text>
      </n-space>
    </n-gi>
  </n-grid>
</template>



<script setup lang="ts">
import {NGrid, NGi, NSpace} from "naive-ui"

const {titleList} = defineProps<{titleList:string[]}>()
</script>

<template>
  <n-grid class="bg-neutral-100 rounded" :cols="7">
    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">对局日期</text>
        <text>{{ titleList[0] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">对局类型</text>
        <text>{{ titleList[2] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">开始时间</text>
        <text>{{ titleList[1] }}</text>
      </n-space>
    </n-gi>

    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">数据显示</text>
        <text style="cursor:pointer;color: #18a058">输出伤害</text>
      </n-space>
    </n-gi>

    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">双方比分</text>
        <div>
          <text style="color: #d03050">{{ titleList[4] }}</text>
            /
          <text style="color: #4098fc">{{ titleList[5] }}</text>
        </div>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">对局时长</text>
        <text>{{ titleList[3] }}分钟</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-ss5 text-gray-400">经济差距</text>
        <text>0.4k</text>
      </n-space>
    </n-gi>
  </n-grid>
</template>



<script setup lang="ts">
import {ThumbDown, ThumbUp} from "@vicons/tabler";
import {NEllipsis, NIcon, NTag} from "naive-ui";

const {kda,name} = defineProps<{kda:number|undefined,name:string}>()
</script>

<template>
  <n-tag
    v-if="kda===undefined"
    round size="small" class="w-full justify-center text-sm"
    :bordered="false" type="success">
    <n-ellipsis :tooltip="false" style="max-width: 130px">
      {{ name }}
    </n-ellipsis>
  </n-tag>
  <!--            根据KDA计算数据-->
  <n-tag
    v-else
    round size="small" class="w-full justify-center text-sm"
    :bordered="false" :type="kda>=9?'success':'error'">
    <text class="pr-2">{{ kda}}</text>
    <n-ellipsis :tooltip="false" style="max-width: 130px">
      {{ name }}
    </n-ellipsis>
    <template #icon>
      <n-icon :size="16">
        <ThumbUp v-if="kda>=9"/>
        <ThumbDown v-else/>
      </n-icon>
    </template>
  </n-tag>
</template>


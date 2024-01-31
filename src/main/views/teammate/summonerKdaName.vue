<script setup lang="ts">
import {ThumbDown, ThumbUp} from "@vicons/tabler";
import {NEllipsis, NIcon, NTag} from "naive-ui";

const {kda, name} = defineProps<{ kda: number | undefined, name: string }>()
</script>

<template>
  <n-tag
    v-if="kda === undefined"
    round size="small" class="w-full justify-center text-sm"
    :bordered="false" type="success">
    <n-ellipsis :tooltip="false" style="max-width: 180px">
      {{ name }}
    </n-ellipsis>
  </n-tag>
  <!--            根据KDA计算数据-->
  <div v-else class="flex gap-x-3">
    <n-tag
      round size="small"
      style="width: 85px" class="justify-center text-sm"
      :bordered="false" :type="kda>=9?'success':'error'">
      <div class="flex gap-x-0.5 items-center">
        <n-icon :size="16">
          <ThumbUp v-if="kda>=9"/>
          <ThumbDown v-else/>
        </n-icon>
        <text>{{ kda }}</text>
      </div>
    </n-tag>
    <n-tag
      round size="small" class="w-full justify-center text-sm"
      :bordered="false" :disabled="true" style="cursor: default !important;">
      <n-ellipsis :tooltip="false" style="max-width: 130px">
        {{ name }}
      </n-ellipsis>
    </n-tag>
  </div>
</template>


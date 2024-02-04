<script setup lang="ts">
import {ThumbDown, ThumbUp} from "@vicons/tabler";
import {NEllipsis, NIcon, NTag} from "naive-ui";
const {kda,name,hater,haterIndex,openDrawer} = defineProps<{
  kda: string | undefined,
  name: string,
  hater:boolean|undefined,
  haterIndex?:number|undefined,
  openDrawer?:(haterIndex:number) => void
}>()

const checkHater = (hater) => {
  if (hater===undefined){
    return 'default'
  }
  if (hater){
    return 'error'
  }else {
    return 'success'
  }
}
const handleOpenDrawer = (hater:boolean|undefined,haterIndex:number|undefined) => {
  if (openDrawer === undefined || hater===undefined){
    return
  }
  openDrawer(haterIndex as number)
}
</script>

<template>
  <n-tag
    v-if="kda === undefined"
    round size="small" class="w-full justify-center text-sm"
    :bordered="false" :type="checkHater(hater)" @click="handleOpenDrawer(hater,haterIndex)">
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
      :bordered="false" :disabled="hater===undefined?true:false"
      :type="checkHater(hater)" @click="handleOpenDrawer(hater,haterIndex)"
      style="cursor: default !important;">
      <n-ellipsis :tooltip="false" style="max-width: 130px">
        {{ name }}
      </n-ellipsis>
    </n-tag>
  </div>
</template>


<script setup lang="ts">
import { NSpace, NIcon } from "naive-ui";
import { SmartHome, Ghost, List, Notebook, Stack2 } from '@vicons/tabler';

const {curPos,navigateToPage} = defineProps<{
  curPos:number,
  navigateToPage:(page:string,index:number) => void}>()
const icons = [
  { icon: SmartHome, index: 0,route:'home' },
  { icon: List, index: 1,route:'rank' },
  { icon: Ghost, index: 2,route:'teammate' },
  { icon: Stack2, index: 3,route:'rune' },
  { icon: Notebook, index: 4,route:'record' },
]
const iconColor = true ? ['#18a058',''] :["#7fe7c4","#ffffff"]

</script>

<template>
  <div class="navDiv bg-white dark:bg-zinc-900 shadow">
    <n-space justify="space-between" class="mt-2 mx-2">
      <n-icon
        class="transition cursor-pointer"
        v-for="item in icons"
        :key="item.index"
        size="26"
        :color="curPos === item.index ? iconColor[0] : iconColor[1]"
        @click="navigateToPage(item.route,item.index)"
      >
        <component :is="item.icon"/>
      </n-icon>
    </n-space>
  </div>
</template>

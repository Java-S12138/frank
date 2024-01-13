<script setup lang="ts">
import { NSpace, NIcon } from "naive-ui";
import { SmartHome, Ghost, List, Notebook, Stack2 } from '@vicons/tabler';
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const curPos = ref(0)
const icons = [
  { icon: SmartHome, index: 0 },
  { icon: List, index: 1 },
  { icon: Ghost, index: 2 },
  { icon: Stack2, index: 3 },
  { icon: Notebook, index: 4 },
]
const iconColor = true ? ['#18a058',''] :["#7fe7c4","#ffffff"]

const navigateToPage = (page:string) => {
  router.push('rank')
}
</script>

<template>
  <div class="navDiv bg-white dark:bg-zinc-900 boxShadow">
    <n-space justify="space-between" class="mt-2 mx-2">
      <n-icon
        class="transition"
        v-for="item in icons"
        :key="item.index"
        size="26"
        :color="curPos === item.index ? iconColor[0] : iconColor[1]"
        @click="navigateToPage"
      >
        <component :is="item.icon"/>
      </n-icon>
    </n-space>
  </div>
</template>

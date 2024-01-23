<script setup lang="ts">
import {NButton} from "naive-ui"

const openWeb = () => {
  cube.utils.openUrlInDefaultBrowser('https://lolfrank.cn')
}
</script>

<template>
    <div class="flex gap-x-2 items-center">
      <img src="@/assets/icon/app-icon.png" class="h-10" draggable="false">
      <img src="@/assets/icon/Frank.png" draggable="false">
      <n-button @click="openWeb" size="small" secondary type="tertiary">
        lolfrank.cn
      </n-button>
    </div>
</template>


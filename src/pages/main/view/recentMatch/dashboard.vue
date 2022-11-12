<template>
  <header class="frankTitle" @mousedown="handldDrge()" >
    <n-space class="frankTitle"  >
      <img src="@/assets/icon/app-icon.png" draggable="false"  alt="" width="40">
      <img src="@/assets/icon/Frank.png" draggable="false" style="margin-top: 4px">
    </n-space>

  </header>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,
  NInput,NPagination,NSelect} from 'naive-ui'


const handldDrge = () => {
  cube.windows.current.dragMove()
}

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin: 12px;
}
.frankTitle {
  align-items: center;
  height: 40px;
}
</style>

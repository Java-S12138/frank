<template>
  <header v-mouse-drag="handldDrge" class="frankTitle">
    <n-space class="frankTitle">
      <img src="../../assets/icon/app-icon.png" draggable="false"  alt="" width="40" @click="handleMin">
      <img src="../../assets/icon/Frank.png" draggable="false"  style="margin-top: 4px">
    </n-space>
    <n-space class="rightCorner">
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button
            text
            @click="handleMin" color="black">
            <n-icon size="25">
              <chevrons-down-left/>
            </n-icon>
          </n-button>
        </template>
        最小化
      </n-popover>

      <n-popconfirm @positive-click="handleClose" :show-icon="false"
                    negative-text="取消" positive-text="确认">
        <template #trigger>
          <n-button text circle color="black">
            <n-icon size="24">
              <circle-x/>
            </n-icon>
          </n-button>
        </template>
        是否关闭当前页面
      </n-popconfirm>
    </n-space>
  </header>
</template>

<script setup>
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,NInput} from 'naive-ui'
import {ChevronsDownLeft,CircleX} from '@vicons/tabler'
import {ipcRenderer} from 'electron'
import {ref} from "vue";
document.title = 'Frank 战绩查询'

const handldDrge = (pos) => {
  ipcRenderer.send('move-query-match-window', {
    x: pos.x,
    y: pos.y,
  })
}

const handleMin = () => {
  ipcRenderer.send('query-match-min')
}

const handleClose = () => {
  ipcRenderer.send('query-match-close')
}

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
}

.rightCorner {
  padding-top: 8px;
  margin-right: 3px;
}

.frankTitle {
  align-items: center
}

</style>

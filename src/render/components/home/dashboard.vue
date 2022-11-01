<template>
  <header v-mouse-drag="handldDrge" class="frankTitle">
    <n-space class="frankTitle">
      <img src="../../assets/icon/app-icon.png" draggable="false" alt="" width="40" @click="handleMin" v-if="isConnectSuccess !=''">
      <img src="../../assets/icon/app-icon-bw.png" draggable="false"  alt="" width="40" @click="handleMin" v-else>
      <img src="../../assets/icon/Frank.png" draggable="false"  style="margin-top: 4px">
    </n-space>

    <n-space class="rightCorner">
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button
            text
            @click="handleMinimize" color="black">
            <n-icon size="25">
              <chevrons-down-right/>
            </n-icon>
          </n-button>
        </template>
        最小化
      </n-popover>
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button text circle color="black" @click="changePage">
            <n-icon size="24">
              <settings/>
            </n-icon>
          </n-button>
        </template>
        设置
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
        是否退出Frank?
      </n-popconfirm>
    </n-space>
  </header>
</template>

<script setup>
import {NIcon, NSpace, NButton, NPopover,NPopconfirm} from 'naive-ui'
import {ChevronsDownRight, Settings, CircleX} from '@vicons/tabler'
import {ipcRenderer} from 'electron'
import {ref} from "vue";
import {appConfig} from "@/utils/main/config";

const emits = defineEmits(['changePage'])
let isConnectSuccess = ref(appConfig.get('credentials.port'))

const changePage = () => {
  emits('changePage')
}

const handldDrge = (pos) => {
  ipcRenderer.send('move-main', {
    x: pos.x,
    y: pos.y,
  })
}

const handleMinimize = () => {
  ipcRenderer.send('mainwin-minimize')
}

const handleMin = () => {
  ipcRenderer.send('mainwin-min')
}

const handleClose = () => {
  ipcRenderer.send('mainwin-close')
}

ipcRenderer.once('client-connect-success', () => {
  isConnectSuccess.value = true
})

</script>

<style scoped>
header {
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-top: 10px;
  margin-right: 16px;
  margin-left: 16px;
  margin-bottom: 10px;
}

.rightCorner {
  padding-top: 8px;
  margin-right: 3px;
}

.frankTitle {
  align-items: center
}

</style>

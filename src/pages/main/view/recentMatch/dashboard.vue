<template>
  <header class="frankTitle">
    <n-space class="frankTitle">
      <img src="@/assets/icon/app-icon.png" draggable="false"  alt="" width="40">
      <img src="@/assets/icon/Frank.png" draggable="false" style="margin-top: 4px">
      <n-space style="margin-left: 23px">
        <div style="display: flex;margin-right: 8px">
          <p class="headerP">
            窗口快捷键 Shift + Tab</p>
        </div>
        <div style="display: flex">
          <p class="headerP">
            游戏内自动打开此窗口</p>
          <n-switch v-model:value="config.isGameInWindow" @click="changeAutoGameInWin"/>
        </div>
      </n-space>
    </n-space>
    <n-space style="margin-top: 15px;" justify="space-between">
      <n-button
        text
        @click="handleMin" color="black">
        <n-icon size="25" color="#9AA4AF">
          <chevrons-down-left/>
        </n-icon>
      </n-button>
    </n-space>
  </header>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton,NSwitch} from 'naive-ui'
import {ChevronsDownLeft} from '@vicons/tabler'
import {reactive} from "vue"

const config = reactive(JSON.parse(String(localStorage.getItem('config'))))

const handleMin = () => {
  cube.windows.hide(cube.windows.current.id())
}
const changeAutoGameInWin = () => {
  if (config['isGameInWindow'] !== true) {
    config['isGameInWindow'] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config['isGameInWindow'] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin: 10.5px 12px;
}
.frankTitle {
  align-items: center;
  height: 40px;
}
.headerP {
  padding-top: 1px;
  color: #9AA4AF;
  margin-right: 15px
}
</style>

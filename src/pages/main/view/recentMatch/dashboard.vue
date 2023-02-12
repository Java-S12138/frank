<template>
  <header class="frankTitle">
    <n-space class="frankTitle">
      <img src="@/assets/icon/app-icon.png" draggable="false" width="40">
      <img src="@/assets/icon/Frank.png" draggable="false">
      <n-space style="margin-left: 43px;height: 26px;" :size="[0,0]">
        <div style="display: flex">
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
    <n-space style="margin-top: 12px;width: 549px;" justify="space-between">
      <img src="@/assets/icon/site.png" draggable="false" style="margin-top: -3px">
      <n-button
        text
        @click="handleMin" color="black">
        <n-icon size="25" color="#666666">
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

const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))

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
  display: flex;
  color: #666666;
  height: 22px;
  background-color: #e3e3e3;
  font-size: 13px;
  padding: 0px 5px 0px 5px;
  border-radius: 2px;
  align-items: center;
  margin-right: 15px;
}
</style>

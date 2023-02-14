<template>
  <header class="frankTitle">
    <img src="@/assets/icon/siteLogo.png" draggable="false" >
    <n-space justify="space-between">
      <p class="headerP" @click="handleMin"
         style="margin-right: 3px;cursor: pointer">窗口显示 | 隐藏快捷键 Shift + Tab</p>
      <div style="display: flex">
        <p class="headerP" style="  margin-right: 13px;">
          游戏启动时自动打开此窗口</p>
        <n-switch v-model:value="config.isGameInWindow" @click="changeAutoGameInWin"/>
      </div>
    </n-space>
  </header>
</template>

<script setup lang="ts">
import {NSpace,NSwitch} from 'naive-ui'
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
}
</style>

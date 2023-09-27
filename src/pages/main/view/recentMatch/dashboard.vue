<template>
  <header class="frankTitle">
    <img src="@/assets/icon/siteLogo.png" draggable="false" >
    <n-space justify="space-between">
      <p v-if="!props.isIn" class="headerP winCountTheme" @click="handleClose"
         style="margin-right: 3px;cursor: pointer">关闭此窗口</p>
      <p class="headerP winCountTheme" @click="handleMin"
         style="margin-right: 3px;cursor: pointer">{{ getRandomString() }}</p>
      <div style="display: flex">
        <p class="headerP winCountTheme" style="  margin-right: 13px;">
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
const props = defineProps({
  isIn:{
    default:true,
    type:Boolean
  }
})

const handleMin = () => {
  cube.windows.hide(cube.windows.current.id())
}
const handleClose = () => {
  cube.windows.close(cube.windows.current.id())
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

const strings = [
  '窗口显示 | 隐藏快捷键 Shift + Tab',
  '点击下方战绩标签 | 即可查看此局详细数据',
  '下方序号相同的玩家 | 代表开黑的玩家'
]

function getRandomString() {
  const index = Math.floor(Math.random() * strings.length)
  return strings[index]
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
  height: 22px;
  font-size: 13px;
  padding: 0px 5px 0px 5px;
  border-radius: 2px;
  align-items: center;
}
</style>

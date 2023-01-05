<template>
  <div class="main">
    <n-result status="404" title="数据正在加载中..." description="如果长时间无法显示数据 请关闭此窗口" size="huge">
      <template #footer>
        <n-space vertical :size="[0,20]">
          <n-switch size="large" v-model:value="config.isGameInWindow" @click="changeAutoGameInWin">
            <template #checked>
              游戏内要自动显示此窗口
            </template>
            <template #unchecked>
              游戏内不自动显示此窗口
            </template>
          </n-switch>
          <n-button @click="closeWin">关闭此窗口</n-button>
        </n-space>
      </template>
    </n-result>
  </div>
</template>
<script setup lang="ts">
import {NResult,NButton,NSwitch,NSpace} from "naive-ui";
import {reactive} from "vue";
const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))
const changeAutoGameInWin = () => {
  if (config['isGameInWindow'] !== true) {
    config['isGameInWindow'] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config['isGameInWindow'] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}
const closeWin = () => {
  cube.windows.close(cube.windows.current.id())
}
</script>
<style scoped>
.main{
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

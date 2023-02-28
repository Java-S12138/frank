<template>
  <div class="main">
    <n-result v-if="props.isIn" status="404" title="数据正在加载中..." description="如果长时间无法显示数据 请关闭此窗口" size="huge">
      <template #footer>
        <n-space vertical :size="[0,20]">
          <n-switch  size="large" v-model:value="config.isGameInWindow" @click="changeAutoGameInWin">
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
    <n-result v-else status="404" title="如果游戏内无窗口显示" description="可使用此窗口查看对局详情 若长时间无数据 请关闭此窗口" size="huge">
      <template #footer>
        <n-space vertical :size="[0,20]">
          <n-button @click="closeWin">关闭此窗口</n-button>
        </n-space>
      </template>
    </n-result>
  </div>
</template>
<script setup lang="ts">
import {NResult,NButton,NSwitch,NSpace} from "naive-ui";
import {Ref, ref} from "vue";
const config:Ref = ref(JSON.parse(<string>(localStorage.getItem('config'))))
const props = defineProps({
  isIn:{
    default:true,
    type:Boolean
  }
})

const changeAutoGameInWin = () => {
  if (config.value['isGameInWindow'] !== true) {
    config.value['isGameInWindow'] = false
    localStorage.setItem('config',JSON.stringify(config.value))
  } else {
    config.value['isGameInWindow'] = true
    localStorage.setItem('config',JSON.stringify(config.value))
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

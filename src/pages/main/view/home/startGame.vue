<template>
  <n-card class="boxShadow" size="small">
    <div  class="spinnerDiv">
      <div class="spinner"></div>
    </div>
    <n-space vertical>
      <n-space justify="space-between">
        <n-select  v-model:value="serveValue" :options="options" style="width: 84px;"/>
        <n-button type="success" @click="startGame(serveValue)">启动游戏</n-button>
      </n-space>
      <n-tag  type="success" size="small" style="width: 241px;justify-content: center"
              :bordered="false">
        <p>进入英雄联盟大厅后⌛自动获取数据</p>
      </n-tag>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {NCard,NSpace, NTag, NSelect, useMessage, NButton} from 'naive-ui'
import {ref} from "vue"

const message = useMessage()
const serveValue = ref(54261)
const options = [
  {
    label: '国服',
    value: 54261
  },
  {
    label: '台服',
    value: 65131
  }
]

const startGame = (gameId:number) => {
  cube.utils.launchGame(gameId).then(() => {
    message.loading('英雄联盟客户端启动中...', {duration: 5000})
  })
}

</script>

<style scoped>
@import url(@/assets/css/homeLoader.css);
</style>

<template>
  <n-card class="boxShadow" size="small">
    <div  class="spinnerDiv">
      <div class="spinner"></div>
    </div>
    <n-space vertical>
      <n-space justify="space-between">
        <n-button type="success" @click="openGuideSite" secondary>使用手册</n-button>
        <n-dropdown trigger="click" :options="options" @select="startGame">
          <n-button type="success">开始游戏</n-button>
        </n-dropdown>
      </n-space>
      <n-tag  type="success" size="small" style="width: 241px;justify-content: center"
              :bordered="false">
        <p>进入英雄联盟大厅后⌛自动获取数据</p>
      </n-tag>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {NCard,NSpace, NTag, NDropdown, useMessage, NButton} from 'naive-ui'

const message = useMessage()
const options = [
  {
    label: '启动国服',
    key: 54261
  },
  {
    label: '启动台服',
    key: 65131
  },
  {
    label: '其它地区',
    key: 10086
  },
]

const startGame = (gameId:number) => {
  if (gameId===10086){
    message.warning('请先手动启动客户端 再打开Frank', {duration: 5000})
    return
  }
  cube.utils.launchGame(gameId).then(() => {
    message.loading('英雄联盟客户端启动中...', {duration: 5000})
  })
}
const openGuideSite = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank')
}

</script>

<style scoped>
@import url(@/assets/css/homeLoader.css);
</style>

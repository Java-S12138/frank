<template>
  <div>
    <n-space justify="center" style="margin-top: 5px">
      <n-tag :type="notice.type" :bordered="false">
        {{ notice.content }}
      </n-tag>
      <n-button v-if="notice.isButton" @click="toUrl" size="small" :type="notice.type">
        {{ notice.buttonContent }}
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NTag, NButton, NSpace} from 'naive-ui'

const notice = {
  type: 'success',
  content: '1.51.1221版本更新啦!',
  isButton: true,
  buttonContent: '点击查看',
  url: 'https://syjun.vip'
}

const toUrl = () => {
  cube.utils.openUrlInDefaultBrowser(notice.url)
}
</script>

<style scoped>

</style>

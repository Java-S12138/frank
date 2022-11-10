<template>
  <div>
    <n-space justify="center" style="margin-top: 6px">
      <n-tag :type="props.notice.type" :bordered="false">
        {{ props.notice.content }}
      </n-tag>
      <n-button v-if="props.notice.isButton" @click="toUrl" size="small" :type="props.notice.type">
        {{ props.notice.buttonContent }}
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NTag, NButton, NSpace} from 'naive-ui'

const props:any = defineProps({
  notice:{
    type:Object,
    defaule:{
      isShow:false,
      type: 'success',
      content: '',
      isButton: false,
      buttonContent: '',
      url: ''
    }
  }
})

const toUrl = () => {
  cube.utils.openUrlInDefaultBrowser(props.notice.url)
}
</script>

<style scoped>

</style>

<template>
    <n-drawer-content >
      <template #header>
        <n-space justify="space-between" style="width: 142%">
          <p style="font-size: 15px">不如拿来麻辣烫</p>
          <p style="font-size: 15px">2022-7-25</p>
        </n-space>
      </template>
      <template #footer>
        <n-space>
          <n-tag type="error" :bordered="false"
                 style="font-size: 15px;margin-right: 107px">摆烂</n-tag>
          <n-button type="info" size="small">修改</n-button>
          <n-button type="warning" size="small">删除</n-button>
        </n-space>
      </template>
      <n-input
        v-model:value="props.value"
        type="textarea"
        autosize
        placeholder="请输入拉黑原因"
        :bordered="false"
      />
    </n-drawer-content>
</template>

<script setup>
import {NSpace,NInput,NTag,NButton,NDrawerContent} from 'naive-ui'
const props = defineProps({
  value:{
    type:String,
    default:''
  }
})


</script>

<style scoped>

</style>

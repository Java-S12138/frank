<template>
  <n-drawer-content>
    <template #header>
      <n-space justify="space-between" style="width: 272px;align-items: center">
        <n-tag size="large" v-if="props.name!=''"  :bordered="false">{{props.name}}</n-tag>
        <n-input
          v-else
          style="width: 125px;"
          v-model:value="blacklistName"
          placeholder="输入召唤师昵称"
        />
        <n-tag size="large"  :bordered="false">{{currentDate}}</n-tag>
      </n-space>
    </template>
    <template #footer>
      <n-space style="width: 270px" justify="space-between">
        <n-space>
          <n-tag :bordered="false" type="success" style="margin-left: 5px">标签</n-tag>
          <n-select
            v-model:value="selectValue"
            :options="options"
            style="width: 123px;"
            size="small"
            tag
            filterable
          />

        </n-space>
        <n-button type="error" size="small" @click="confirmShielding">拉黑一下</n-button>
      </n-space>
    </template>
    <n-space vertical>
      <n-input
        v-model:value="blacklistContent"
        type="textarea"
        autosize
        placeholder="请输入拉黑原因"
      />


    </n-space>
  </n-drawer-content>
</template>

<script setup>
import {NSpace,NInput,NSelect,NTag,NButton,NDrawerContent,useMessage} from 'naive-ui'
import {ref,onBeforeMount} from "vue";
import {appConfig} from "@/utils/main/config";
const props = defineProps({
  name:{
    type:String,
    default:''
  }
})
const selectValue = ref('摆烂')
const options = [
  {
    label: "摆烂",
    value: '摆烂',
  },{
    label: '牛马',
    value: '牛马'
  },{
    label: "演员",
    value: '演员',
  },{
    label: "脏兵",
    value: '脏兵',
  },{
    label: "挂机",
    value: '挂机',
  }
]
const blacklistContent = ref('')
const blacklistName = ref('')
const message = useMessage()
const emits = defineEmits(['closeDrawer']);

// 判断当期召唤师是否存在于黑名单中
onBeforeMount(() => {
  if (props.name != ''){
    if (appConfig.has(`blacklist.${props.name}`)){
      blacklistContent.value = appConfig.get(`blacklist.${props.name}.content`)
      selectValue.value = appConfig.get(`blacklist.${props.name}.tag`)
    }
  }

})

const queryCurrenDate = () => {
  var myDate = new Date()
  return myDate.toLocaleDateString()
}
const currentDate = queryCurrenDate()

const confirmShielding = () => {
  const currentName = props.name != '' ? props.name : blacklistName.value
  if (currentName ===''){
    message.error('召唤师昵称不能为空 !')
    return
  }
  appConfig.set(`blacklist.${currentName}`,{
    date:currentDate,
    timestamp:Date.now(),
    content:blacklistContent.value,
    tag:selectValue.value,
  })
  emits('closeDrawer','closeDrawer') //向父组件发送消息关闭抽屉
  message.success(`${currentName} --- 拉黑成功 !`)
}
</script>

<style scoped>

</style>

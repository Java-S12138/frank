<script setup lang="ts">
import {computed, h, ref, VNodeChild} from "vue";
import {keywordsList} from "@/resources/champList";
import {NAutoComplete, NAvatar, NButton, SelectOption} from "naive-ui";

const {selectFunc} = defineProps<{
  selectFunc:(alias:string) => void
}>()

const inputValue = ref('')
// 渲染提示框
const renderLabel = (option: SelectOption): VNodeChild => [
  h('div', { style: 'display: flex; align-items: center;' }, [
    h(NAvatar, {
      style: 'margin-right: 8px;',
      size: 24,
      round: false,
      src: `https://game.gtimg.cn/images/lol/act/img/champion/${option.value}.png`
    }),
    option.label as string
  ])
]
// 生成输入框渲染提示选项
const autoOptions = computed(() => {
  if (inputValue.value==='' || inputValue.value===null){
    return
  }
  const keyword = inputValue.value.toLowerCase()
  const renderList = keywordsList.filter(item => item.keywords.toLowerCase().includes(keyword))

  if (renderList.length > 5 || renderList.length===0){
    return
  }

  return renderList.map((champ) => {
    return {
      value: champ.alias,
      label: champ.name
    }
  })
})

const handleButton = () => {
  if (autoOptions.value?.length){
    // @ts-ignore
    selectFunc(autoOptions.value[0].value)
  }else {
    selectFunc(inputValue.value)
  }
  inputValue.value = ''
}
</script>

<template>
  <n-auto-complete
    size="small"
    :clear-after-select="true"
    v-model:value="inputValue"
    @select="selectFunc"
    spellcheck="false"
    :options="<{lable:string,value:string}[]>autoOptions"
    :render-label="renderLabel"
    placeholder="请输入你想查询的英雄"
    style="width: 162px;"
  />
  <n-button size="small" secondary type="info" @click="handleButton()">搜索</n-button>
</template>

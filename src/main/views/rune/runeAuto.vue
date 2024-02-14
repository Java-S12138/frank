<script setup lang="ts">
import {NTag, NPopconfirm, NCard, NButton, NSpace,useMessage} from "naive-ui"
import {onMounted, Ref, ref} from "vue"
import {invokeLcu} from "@/lcu";

const {champ,champName} = defineProps<{champ:string,champName:string}>()

const message = useMessage()
const emits = defineEmits(['completeSetup'])
const clientRune = ref(true)
const runeData:Ref = ref(null)
const localAutoRune = localStorage.getItem('autoRune')
let autoRuneDict:any

onMounted(async () => {
  if (localAutoRune === null || localAutoRune==='{}'){
    initRuneData()
  }else {
    autoRuneDict = JSON.parse(localAutoRune)
    if (autoRuneDict[champ] === undefined){
      initRuneData()
      return
    }
    runeData.value = autoRuneDict[champ]
    clientRune.value = false
  }
})

const initRuneData = async () => {
  const currentRuneList = await invokeLcu('get','/lol-perks/v1/pages')
  const current = currentRuneList.find((i:any) => i.current)
  if (current !== undefined){
    runeData.value = {
      name:champName+ " lolfrank.cn",
      primaryStyleId:current.primaryStyleId,
      subStyleId:current.subStyleId,
      selectedPerkIds:current.selectedPerkIds
    }
  }else {
    runeData.value = null
  }
}

const writeAutoRune = () => {
  // todo
  /*if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('自动符文 需要订阅')
    return
  }*/
  if (champ ===''){
    return
  }
  if (localAutoRune === null || localAutoRune==='{}'){
    const autoRuneDict = {
      [champ]:runeData.value
    }
    localStorage.setItem('autoRune',JSON.stringify(autoRuneDict))
    completeSetup()
  }else {
    if (autoRuneDict[champ] ===undefined){
      autoRuneDict[champ] = runeData.value
      localStorage.setItem('autoRune',JSON.stringify(autoRuneDict))
      completeSetup()
    }else {
      message.warning('英雄符文已存在 请先清除')
    }
  }
}

const removeAutoRune = () => {
  delete autoRuneDict[champ]
  localStorage.setItem('autoRune',JSON.stringify(autoRuneDict))
  clientRune.value = true
  emits('completeSetup','disAuto')
  initRuneData()
}

const completeSetup = () => {
  emits('completeSetup','auto')
  message.success('自动配置符文 设置成功')
}
const getImgUrl = (imgId: any) => {
  return new URL(`/src/assets/runes/${imgId}.png`, import.meta.url).href
}

const openWeb = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/introduction#Lmsmu')
}
</script>

<template>
  <n-card :bordered="false" content-style="padding:12px 21px" class="divCard">
    <n-button secondary :bordered="false" type="info" class="mb-3 w-full justify-center">
      功能介绍：选择此英雄时, 自动配置符文
    </n-button>
    <n-space justify="space-between">
      <div class="runeDiv runeDivDash"  v-if="runeData!==null">
        <n-space style="width: 86px;padding: 5px 8px" align="stretch" justify="space-between">
          <n-space vertical align="center" :size=[0,0]>
            <img :src="getImgUrl(runeData.selectedPerkIds[0])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[1])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[2])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[3])"  class="runImg">
          </n-space>
          <n-space vertical align="center" :size=[0,0]>
            <img :src="getImgUrl(runeData.selectedPerkIds[4])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[5])"  class="runImg">
            <div class="runSondary">
              <img :src="getImgUrl(runeData.selectedPerkIds[6])"  class="runImgseSondaryReal">
              <img :src="getImgUrl(runeData.selectedPerkIds[7])"  class="runImgseSondaryReal">
              <img :src="getImgUrl(runeData.selectedPerkIds[8])"  class="runImgseSondaryReal">
            </div>
          </n-space>
        </n-space>
      </div>

      <div class="runeDiv runeDivDash">
        <n-space vertical align="center" :size="[0,12]" style="padding-top: 4px">
          <n-tag :bordered="false" >左侧显示数据</n-tag>
          <n-tag :bordered="false" type="error" v-if="clientRune">召唤师符文页</n-tag>
          <n-tag :bordered="false" type="info" v-else>本地英雄符文</n-tag>
          <n-tag :disabled="true" :bordered="false" >点击下方按钮</n-tag>
          <n-tag :disabled="true" :bordered="false" @click="openWeb">查看使用详情</n-tag>
        </n-space>
      </div>
    </n-space>
    <n-space justify="space-between">
      <n-button v-if="clientRune" type="error" secondary style="width: 120px;">暂无符文数据</n-button>
      <n-popconfirm
        v-else
        @positive-click="removeAutoRune"
        :show-icon="false"
        positive-text="确定"
        negative-text="取消"
        placement="bottom-start"
      >
        <template #trigger>
          <n-button secondary type="info" style="width: 120px;">清除符文数据</n-button>
        </template>
        清除当前 英雄符文数据<br>重新获取 召唤师符文页
      </n-popconfirm>

      <n-popconfirm
        @positive-click="writeAutoRune"
        :show-icon="false"
        positive-text="确定"
        negative-text="取消"
        placement="bottom-end"
      >
        <template #trigger>
          <n-button secondary type="success" style="width: 120px;">新增自动符文</n-button>
        </template>
        选取当前 召唤师符文页<br>写入本地 自动符文数据
      </n-popconfirm>
    </n-space>
  </n-card>
</template>
<style scoped>
.divCard {
  height: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.runSondary {
  display: flex;
  flex-direction: column;
  margin-bottom: 2.8px;
}
.runeDiv {
  height: 154px;
  width: 102px;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
}

.runImg {
  width: 30px;
  height: 30px;
}

.runImgseSondaryReal {
  width: 25px;
  height: 25px;
  margin-bottom: -3px;
}
</style>

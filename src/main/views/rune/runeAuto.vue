<script setup lang="ts">
import {NPopconfirm, NCard, NButton, NSpace,useMessage} from "naive-ui"
import {onMounted, Ref, ref} from "vue"
import {invokeLcu} from "@/lcu";
import {open} from "@tauri-apps/plugin-shell";
import {writeAutoRune} from "@/main/views/rune/runes.ts";

const {champ,champName,openTips} = defineProps<{champ:string,champName:string,openTips:() => void}>()

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
  open('https://www.yuque.com/java-s/frank/introduction#Lmsmu')
}
</script>

<template>
  <n-card :bordered="false" content-style="padding:12px 21px" class="divCard">
    <n-button secondary :bordered="false" type="info" class="mb-3 w-full justify-center">
      ↓ 当前英雄的自动符文数据如下
    </n-button>
    <n-space justify="space-between">
      <div class="runeDiv runeDivDash"  v-if="runeData!==null">
        <n-space style="width: 86px;padding: 5px 8px" align="stretch" justify="space-between">
          <n-space vertical align="center" :size=[0,12]>
            <img :src="getImgUrl(runeData.selectedPerkIds[0])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[1])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[2])"  class="runImg">
            <img :src="getImgUrl(runeData.selectedPerkIds[3])"  class="runImg">
          </n-space>
          <n-space vertical align="center" :size=[0,12]>
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

      <div class="runeDiv runeDivDash flex justify-center">
        <n-space class="h-full" justify="space-between"  vertical>
          <n-popconfirm
            @positive-click="removeAutoRune"
            :show-icon="false"
            positive-text="确定"
            negative-text="取消"
            placement="bottom-start"
          >
            <template #trigger>
              <n-button secondary size="small" type="error">删除符文数据</n-button>
            </template>
            是否清除当前 英雄符文数据
          </n-popconfirm>

          <n-button
            @click="writeAutoRune(champ,champName,message)"
            secondary size="small" type="success" >更新自动符文</n-button>

          <n-button
            @click="openTips"
            secondary size="small" type="default">查看弹窗提示</n-button>
          <n-button
            @click="openWeb"
            secondary size="small" type="tertiary">功能使用介绍</n-button>
        </n-space>
      </div>
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
  height: 78px;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 2.8px;
}
.runeDiv {
  height: 187px;
  width: 102px;
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

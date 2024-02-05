<script setup lang="ts">
import {
  NSpace, NTag,useMessage, NScrollbar
} from 'naive-ui'
import {applyRunePage, applyBlockPage} from "@/lcu/aboutRune";
import {onMounted} from "vue";
import {useRuneStore} from "@/main/store/useRune";
import {Rune} from "@/main/views/rune/runeTypes";
import {mapNameFromUrl} from "@/resources/champList";
import {handleRunesWrite} from "@/main/views/rune/runes";

const storeRune = useRuneStore()
const message = useMessage()
const {runeList} = defineProps<{runeList:Rune[]}>()

// 应用符文&装备
const applyRune = async (data: any) => {
  if (localStorage.getItem('isSubscribe') === 'f') {
    message.warning('一键符文，需要订阅 请手动配置', {duration: 5000})
    return
  }

  const tempData = JSON.parse(JSON.stringify(data))
  tempData.name = mapNameFromUrl[data.alias].name + " lolfrank.cn"
  const isAutoWriteBlock = JSON.parse(<string>(localStorage.getItem('configSetting'))).autoWriteBlock
  const blockList = JSON.parse(JSON.stringify(storeRune.blockDataList))

  handleRunesWrite(tempData,isAutoWriteBlock,blockList).then((writeRes) => {
    if (writeRes===1){
      message.success('符文数据配置成功')
    }else if (writeRes===2){
      message.success('符文&装备 配置成功')
    }else {
      message.error('符文数据配置失败')
    }
  })
}
// 获取图片地址
const getImgUrl = (imgId: any) => {
  return new URL(`/src/assets/runes/${imgId}.png`, import.meta.url).href
}
// 获取位置信息
const getPosition = (pos: string) => {
  switch (pos) {
    case 'middle':
      return '中单';
    case 'top':
      return '上单';
    case 'support':
      return '辅助';
    case 'jungle':
      return '打野';
    case 'bottom':
      return '射手';
    case 'aram':
      return '极地';
    case 'mid':
      return '中单';
  }
}

</script>

<template>
  <n-scrollbar style="height: 442px;padding-right: 12px;">
    <div class="flex flex-col">
      <n-space justify="space-between" :size="[0,29]">
        <div v-for="rune in runeList">
          <div class="runeDivDash dark:border-gray-700"
               style="width: 100px; padding: 8px 10px 9px">
            <n-space :size=[0,0] justify="space-between" class="px-1.5">
              <n-space vertical align="center" :size=[0,10]>
                <img :src="getImgUrl(rune.selectedPerkIds[0])" class="runImg">
                <img :src="getImgUrl(rune.selectedPerkIds[1])" class="runImg">
                <img :src="getImgUrl(rune.selectedPerkIds[2])" class="runImg">
                <img :src="getImgUrl(rune.selectedPerkIds[3])" class="runImg">
              </n-space>
              <n-space vertical align="center" :size=[0,10]>
                <img :src="getImgUrl(rune.selectedPerkIds[4])" class="runImg">
                <img :src="getImgUrl(rune.selectedPerkIds[5])" class="runImg">
                <div class="flex flex-col">
                  <img :src="getImgUrl(rune.selectedPerkIds[6])" class="runImgSondary">
                  <img :src="getImgUrl(rune.selectedPerkIds[7])" class="runImgSondary">
                  <img :src="getImgUrl(rune.selectedPerkIds[8])" class="runImgSondary">
                </div>
              </n-space>
            </n-space>

            <n-space class="mt-1" justify="space-between">
              <n-tag :bordered="false" type="info">
                {{ getPosition(rune.position) }}
              </n-tag>
              <n-tag :bordered="false" type="success" style="cursor:pointer"
                     @click="applyRune(rune)">
                应用
              </n-tag>
            </n-space>
          </div>
        </div>
      </n-space>
    </div>
  </n-scrollbar>
</template>

<style scoped>
.runImg {
  width: 30px;
  height: 30px;
  display: block;
}

.runImgSondary {
  width: 25px;
  height: 25px;
}
</style>

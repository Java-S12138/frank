<template>
  <n-scrollbar style="max-height: 477px;padding-right: 10px">
    <n-grid :cols="2" x-gap="15" style="margin-top: 4px">
      <n-gi v-for="rune in props.runeList">
        <div class="runeDiv">
          <n-space :size=[-5,0] align="stretch" justify="space-between">
            <n-space vertical align="center" :size=[1,-5]>
              <img :src="getImgUrl(rune.selectedPerkIds[0])" alt="" class="runImg">
              <img :src="getImgUrl(rune.selectedPerkIds[1])" alt="" class="runImg">
              <img :src="getImgUrl(rune.selectedPerkIds[2])" alt="" class="runImg">
              <img :src="getImgUrl(rune.selectedPerkIds[3])" alt="" class="runImg">
              <n-tag :bordered="false" type="error" size="medium" style="margin-top: 6px">
                {{ getPosition(rune.position) }}
              </n-tag>
            </n-space>
            <n-space vertical align="center" :size=[1,-5]>
              <img :src="getImgUrl(rune.selectedPerkIds[4])" alt="" class="runImg">
              <img :src="getImgUrl(rune.selectedPerkIds[5])" alt="" class="runImg">
              <div class="runSondary">
                <img :src="getImgUrl(rune.selectedPerkIds[6])" alt="" class="runImgseSondary">
                <img :src="getImgUrl(rune.selectedPerkIds[7])" alt="" class="runImgseSondary">
                <img :src="getImgUrl(rune.selectedPerkIds[8])" alt="" class="runImgseSondary">
              </div>
              <div style="margin-top: 12px">
                <n-tag :bordered="false" type="success" style="cursor:pointer"
                       size="medium" @click="applyRune(rune)">
                  应用
                </n-tag>
              </div>
            </n-space>
          </n-space>
        </div>
      </n-gi>
    </n-grid>
    <div class="tipBottom">
      <n-space align="center" size="small">
        <p>{{ storeRune.currentChampTitle }}</p>
        <p @click="openDrawer" class="tipTag">自动符文</p>
      </n-space>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import {
  NSpace, NTag, NGrid, NGi, useMessage, NScrollbar
} from 'naive-ui'
import runeStore from "../../../store/runeStore";
import {mapNameFromUrl} from "../../../resources/champList";
import {applyRunePage, applyBlockPage} from "../../../lcu/runeLcu";
import {onMounted, PropType} from "vue";
import {Rune} from "../../../interface/runeTypes";

const storeRune = runeStore()
const message = useMessage()


onMounted(() => {
  if (!storeRune.isAppleAutoRune){
    storeRune.isAppleAutoRune = true
    autoWriteRune()
  }
})

const props = defineProps({
  runeList: {
    default: [],
    type: Array as PropType<Rune[]>
  }
})
const emits = defineEmits(['autoRuneActive'])

// 应用符文&装备
const applyRune = async (data: any) => {
  if (localStorage.getItem('isSubscribe') === 'f') {
    message.warning('一键符文 需要订阅 请手动配置', {duration: 5000})
    return
  }
  const tempData = JSON.parse(JSON.stringify(data))
  tempData.name = mapNameFromUrl[data.alias].name + " lolfrank.cn"
  const isAutoWriteBlock = JSON.parse(<string>(localStorage.getItem('config'))).autoWriteBlock
  applyRunePage(tempData).then((isApplySuccess) => {
    if (isApplySuccess) {
      if (isAutoWriteBlock) {
        const block = storeRune.blockDataList.find((i) => i.ps === data.position)
        if (block === undefined) {
          message.success('符文配置成功')
          return
        }
        applyBlockPage(JSON.parse(JSON.stringify(block.buildItems))).then((v) => {
          if (v) {
            message.success('符文&装备 配置成功')
          } else {
            message.success('符文配置成功')
          }
        })
      } else {
        message.success('符文配置成功')
      }
    } else {
      message.error('符文配置失败')
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
const openDrawer = () => {
  emits('autoRuneActive')
}
// 自动配置符文
const autoWriteRune = () => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    return
  }
  const localRuneStr = localStorage.getItem('autoRune')
  if (localRuneStr === null || localRuneStr === '{}'){
    return
  }
  const runeData = JSON.parse(localRuneStr)[storeRune.currentChampAlias]
  if (runeData !== undefined){
    applyRunePage(runeData).then((isApplySuccess) => {
      if (isApplySuccess){
        message.success('自动配置符文成功')
      }
    })
  }
}
</script>

<style scoped>
.runImg {
  width: 30px;
  height: 30px;
}

.runImgseSondary {
  width: 25px;
  height: 25px;
  margin-bottom: -3px;
}

.runSondary {
  display: flex;
  flex-direction: column;
  margin-bottom: 2.8px;
}

.runeDiv {
  width: 102px;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 8px;
  border: 1px dashed #dfdfdf;
}

.tipBottom {
  margin-top: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 254px;
  border-radius: 4px;
  height: 36px;
  border: 1px dashed #dfdfdf;
  color: #666666;
}

.tipBottom p {
  padding-top: 3px;
  color: rgb(31, 34, 37);
}

.tipTag {
  cursor: pointer;
}
.tipTag:hover{
  color: #18a058;
}
</style>

<template>
  <n-scrollbar style="max-height: 475px;padding-right: 10px">
    <n-grid :cols="2" x-gap="15" style="margin-top: 4px">
      <n-gi v-for="rune in storeRune.runeDataList">
        <div class="runeDiv">
          <n-space :size=[-5,0] align="stretch" justify="space-between">
            <n-space vertical align="center"  :size=[1,-5]>
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
      <p>{{ storeRune.currentChampTitle }}</p>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import {
  NCard, NAvatar, NSpace, NTag, NGrid, NGi, NIcon,
  NBadge, NButton, useMessage,NDrawer, NDrawerContent,NScrollbar
} from 'naive-ui'
import runeStore from "../../../store/runeStore";
import {mapNameFromUrl} from "../../../resources/champList";
import {applyRunePage} from "../../../lcu/runeLcu";

const storeRune = runeStore()
const message = useMessage()

// 应用符文
const applyRune = (data:any) => {
  const tempData = JSON.parse(JSON.stringify(data))
  tempData.name = mapNameFromUrl[data.alias].name + " lolfrank.cn"
  applyRunePage(tempData).then((isApplySuccess) => {
    if (isApplySuccess){
      message.success('符文配置成功')
    }else {
      message.error('符文配置失败')
    }
  })
}
// 获取图片地址
const getImgUrl = (imgId:any) => {
  return  new URL(`/src/assets/runes/${imgId}.png`, import.meta.url).href
}
// 获取位置信息
const getPosition = (pos:string) => {
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
  border:1px dashed #dfdfdf;
}
.tipBottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 254px;
  border-radius: 4px;
  height: 36px;
  border:1px dashed #dfdfdf;
  color: #666666;
}
.tipBottom p {
  padding-top: 2px
}
</style>

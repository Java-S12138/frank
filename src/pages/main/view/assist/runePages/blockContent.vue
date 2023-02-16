<template>
  <n-scrollbar style="max-height: 475px;padding-right: 10px">
    <n-grid :cols="2" x-gap="15" style="margin-top: 4px">
      <n-gi v-for="blockItems in storeRune.blockDataList">
        <div class="blockMain">
          <div v-for="block in blockItems.buildItems.blocks">
            <n-space :size=[8,0] style="height: 28.5px;">
              <img class="itemImg" draggable="false" v-for="img in block.items"
                   :src="'https://game.gtimg.cn/images/lol/act/img/item/'+img.id+'.png'">
            </n-space>
          </div>
          <n-space justify="space-between">
            <n-tag :bordered="false" type="error" size="medium">
              {{ blockItems.position }}
            </n-tag>
            <n-tag :bordered="false" type="success" style="cursor:pointer"
                   size="medium" @click="applyBlock(blockItems.buildItems)">
              应用
            </n-tag>
          </n-space>
        </div>
      </n-gi>
    </n-grid>
    <div class="tipBottom">
      <p>应用符文时自动应用装备</p>
      <n-switch v-model:value="active" size="small"  @click="changeSetting" />
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import {
  NCard, NAvatar, NSpace, NTag, NGrid, NGi, NIcon,NSwitch,
  NBadge, NButton, useMessage,NDrawer, NDrawerContent,NScrollbar
} from 'naive-ui'
import runeStore from "../../../store/runeStore";
import {ref} from "vue";
import {applyRunePage,applyBlockPage} from "../../../lcu/runeLcu";

const storeRune = runeStore()
const active = ref(JSON.parse(<string>(localStorage.getItem('config'))).autoWriteBlock)
const message = useMessage()
const changeSetting = () => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  config['autoWriteBlock'] = active.value
  localStorage.setItem('config',JSON.stringify(config))
}

const applyBlock = (block:any) => {
  applyBlockPage(JSON.parse(JSON.stringify(block))).then((v) => {
    if (v){
      message.success('装备配置成功')
    }else {
      message.error('装备配置失败')
    }
  })
}
</script>

<style scoped>
.blockMain {
  width: 102px;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 8px;
  border:1px dashed #dfdfdf;
  display: flex;
  flex-direction: column;
  gap: 8px 0px;
}
.itemImg {
  width: 28.5px;
  height: 28.5px;
  border-radius: 3px;
}
.tipBottom {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  height: 36px;
  border:1px dashed #dfdfdf;
  color: #666666;
}
.tipBottom p {
  padding-top: 3px;
  margin-right: 12px;
}
</style>

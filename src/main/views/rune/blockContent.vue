<script setup lang="ts">
import {NSpace, NTag, NGrid, NGi, useMessage,NScrollbar} from 'naive-ui'
import {useRuneStore} from "@/main/store/useRune";

const storeRune = useRuneStore()
const message = useMessage()

const applyBlock = () => {
  message.warning('只能看看，游戏内不会应用')
}

</script>


<template>
  <n-scrollbar style="height: 442px;padding-right: 12px;">
    <n-grid :cols="2" x-gap="15" style="margin-top: 4px">
      <n-gi v-for="blockItems in storeRune.blockDataList">
        <div class="blockMain runeDivDash dark:border-gray-700">
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
                   size="medium" @click="applyBlock()">
              应用
            </n-tag>
          </n-space>
        </div>
      </n-gi>
    </n-grid>
  </n-scrollbar>
</template>

<style scoped>
.blockMain {
  width: 102px;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 8px;
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
  color: #666666;
  margin-bottom: 15px;
}
.tipBottom p {
  padding-top: 3px;
  margin-right: 12px;
}
.removeItem {
  margin-top: 1px;
  padding-top: 2px;
  width: 32px;
  background-color: rgba(24, 160, 88, 0.18);
  color: #18a058;
  box-sizing: border-box;
  font-size: 12px;
  padding-left: 4px;
  border-radius: 4px;
  cursor: pointer;
}
</style>

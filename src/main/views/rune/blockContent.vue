<script setup lang="ts">
import {NSpace, NTag, NGrid, NGi,NSwitch, useMessage, NPopconfirm,NScrollbar
} from 'naive-ui'
import {ref} from "vue";
import {invokeLcu} from "@/lcu";
import {applyBlockPage} from "@/lcu/aboutRune";
import {useRuneStore} from "@/main/store/useRune";

const storeRune = useRuneStore()
const active = ref(JSON.parse(<string>(localStorage.getItem('config'))).autoWriteBlock)
const message = useMessage()
const changeSetting = () => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  config['autoWriteBlock'] = active.value
  localStorage.setItem('config',JSON.stringify(config))
}

const applyBlock = (block:any) => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('装备配置 需要订阅服务',{duration: 5000})
    return
  }
  applyBlockPage(JSON.parse(JSON.stringify(block))).then((v) => {
    if (v){
      message.success('装备配置成功！')
    }else {
      message.error('装备配置失败！')
    }
  })
}
const removeItem = async () => {
  const blockPath = (await invokeLcu('get','/data-store/v1/install-dir')).
  replace('LeagueClient','Game')+"/Config/Global/Recommended/frank.json"
  const isExist = await cube.io.fileExists(blockPath)
  if (isExist){
    cube.io.writeFileContents(blockPath, JSON.stringify(''))
      .then((res) => message.success('删除装备数据成功'))
      .catch((err) => message.error('删除装备数据失败'))
  }else {
    message.warning('当前还没使用Frank应用装备哦~')
  }
}
</script>


<template>
  <n-scrollbar style="max-height: 475px;padding-right: 10px">
    <n-grid :cols="2" x-gap="15" style="margin-top: 4px">
      <n-gi v-for="blockItems in storeRune.blockDataList">
        <div class="blockMain runeDivDash">
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
    <div class="tipBottom runeDivDash">
      <p>应用符文时自动应用装备</p>
      <n-switch v-model:value="active" size="small"  @click="changeSetting" />
    </div>
    <div class="tipBottom runeDivDash">
      <p>删除游戏内现有配装方案</p>
      <n-popconfirm
        @positive-click="removeItem"
        :show-icon="false"
        positive-text="确定"
        negative-text="取消"
        placement="top-end"
      >
        <template #trigger>
          <span class="removeItem">删除</span>
        </template>
        是否删除Frank的方案 o.O?
      </n-popconfirm>
    </div>
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

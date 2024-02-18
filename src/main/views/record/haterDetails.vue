<script setup lang="ts">
import {
  NDrawerContent, NPopover, NTag, NDivider,
  NButton, NInput, NSpace, NEllipsis, NPopconfirm, useMessage
} from "naive-ui"
import {HaterItem} from "./blackListTypes";
import {deleteBlacklist, deleteHater, findBlacklistByHId, reviseHaterContent} from "@/main/utils/request";
import {throttle} from "./utils";
import {ref} from "vue";

const {hContent, hInfo, closeDrawer} = defineProps<{
  hContent: HaterItem,
  hInfo: { name: string, sumId: string },
  isEdit:boolean,
  closeDrawer?: () => void
}>()

const message = useMessage()
const contentVal = ref(hContent.content)

// 格式化数据库时间格式
const formatDate = (dateStr: string) => {
  return dateStr.split('T')[0]
}
// 修改内容
const reviseContent = throttle(async (oldContnet: HaterItem,isChangeTag:boolean) => {
  if (isChangeTag){
    changeTag(oldContnet)
  }
  oldContnet.content = contentVal.value
  const newContnet: HaterItem = JSON.parse(JSON.stringify(oldContnet))
  const res = await reviseHaterContent({
    url: '/blacklist/updateBlacklist',
    data: newContnet,
    method: 'PUT'
  })

  if (res) {
    message.success('修改内容成功')
  } else {
    message.error('修改内容失败')
  }
}, 3000)
// 删除此数据
const deleteContent = async (oldContnet: HaterItem) => {
  const res = await deleteBlacklist({
    url: '/blacklist/deleteBlacklist',
    data: JSON.parse(JSON.stringify(oldContnet)),
    method: 'DELETE'
  })

  if (res) {
    message.success('删除内容成功')
    await isHavaItem(oldContnet.sumId,oldContnet.hId)
  } else {
    message.error('删除内容失败')
  }
  closeDrawer()
}
// 判断当前召唤师删除的Hater是否还有剩余内容
const isHavaItem = async (sumId: string, hId: number) => {
  // 根据Hater的召唤师 查询当前Hater的黑名单数据
  const res = await findBlacklistByHId({
    url: `/blacklist/getBlacklistList?sumId=${sumId}&hId=${hId}`,
    method: 'GET'
  })
  if (res === null) {
    return false
  }
  if (res.list.length === 0) {
    deleteHater({
      url: '/hater/deleteHater',
      method: 'DELETE',
      data: {ID: hId}
    })
  }
  return true
}

const searchMatch = (summonerId:string,matchId:string) => {
  if (localStorage.getItem('subscribe') === null){
    message.warning('对局详细数据，需要订阅服务')
    return
  }
  localStorage.setItem('queSumMatch', summonerId+'-'+matchId)
  cube.windows.obtainDeclaredWindow('queryMatch')
}
const changeTag = (oldContnet: HaterItem) => {
  if (oldContnet.isShow){
    oldContnet.tag = '愉快'
    oldContnet.isShow = false
  }else {
    oldContnet.tag = '红温'
    oldContnet.isShow = true
  }
}
</script>

<template>
  <n-drawer-content>
    <div class="flex justify-between">
      <n-popover trigger="hover" :show-arrow="false" placement="top-start">
        <template #trigger>
          <n-tag @click="searchMatch(hContent.sumId,hContent.matchId)" size="large" style="cursor: pointer">
            <n-ellipsis :tooltip="false" style="max-width: 170px">
              {{ hInfo.name }}
            </n-ellipsis>
          </n-tag>
        </template>
        <text>点击查看此玩家战绩</text>
      </n-popover>
      <n-tag :bordered="false" size="large" :disabled="true">
        {{ formatDate(hContent.UpdatedAt) }}
      </n-tag>
    </div>
    <n-divider style="margin: 16px 0;"/>
    <n-input
      v-if="isEdit"
      v-model:value="contentVal"
      type="textarea" spellcheck="false"
      autosize :show-count="true"
      maxlength="200"
      placeholder="请输入拉黑原因"
      style="height: 120px;"
    />
    <n-input
      v-else :value="contentVal"
      type="textarea" spellcheck="false" autosize
      maxlength="200" style="height: 120px;"
    />

    <n-divider dashed style="margin: 16px 0;"/>
    <div v-if="isEdit"  class="flex justify-between">
      <n-button secondary size="small"
                @click="reviseContent(hContent,true)"
                :bordered="false"
                :type="hContent.isShow?'error':'success'">
        {{ hContent.tag }}
      </n-button>
      <n-space>
        <n-button
          size="small" type="info"
          @click="reviseContent(hContent,false)">
          修改
        </n-button>
        <n-popconfirm
          :show-icon="false"
          @positive-click="deleteContent(hContent)"
        >
          <template #trigger>
            <n-button
              size="small" type="error">
              删除
            </n-button>
          </template>
          删除当前召唤师数据
        </n-popconfirm>

      </n-space>
    </div>
    <div v-else class="flex justify-between">
      <n-tag :bordered="false"
                :type="hContent.isShow?'error':'success'">
        {{ hContent.tag }}
      </n-tag>
      <n-tag :bordered="false" :type="hContent.isShow?'error':'success'" :disabled="true">
        <n-ellipsis :tooltip="false" style="max-width: 150px">
          {{hContent.playerSumName}}
        </n-ellipsis>
      </n-tag>
    </div>
    <text class="absolute text-xs text-gray-400" style="bottom: 53px;left: 76px">
      点击玩家昵称查询此局详细数据
    </text>
  </n-drawer-content>
</template>



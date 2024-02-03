<script setup lang="ts">
import {
  NDrawerContent, NPopover, NTag, NDivider,
  NButton, NInput, NSpace, NEllipsis, NPopconfirm, useMessage
} from "naive-ui"
import {HaterItem} from "./blackListTypes";
import {deleteBlacklist, deleteHater, findBlacklistByHId, reviseHaterContent} from "@/main/utils/request";
import {throttle} from "./utils";

const {hContent, hInfo, closeDrawer} = defineProps<{
  hContent: HaterItem,
  hInfo: { name: string, sumId: string },
  closeDrawer: () => void
}>()

const message = useMessage()

// 格式化数据库时间格式
const formatDate = (dateStr: string) => {
  return dateStr.split('T')[0]
}
// 修改内容
const reviseContent = throttle(async (oldContnet: HaterItem) => {
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
</script>

<template>
  <n-drawer-content>
    <div class="flex justify-between">
      <n-popover trigger="hover" :show-arrow="false" placement="top-start">
        <template #trigger>
          <n-tag size="large" style="cursor: pointer">
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
      v-model:value="hContent.content"
      type="textarea" spellcheck="false"
      autosize show-count
      maxlength="200"
      placeholder="请输入拉黑原因"
      style="height: 120px;"
    />

    <n-divider dashed style="margin: 16px 0;"/>
    <div class="flex justify-between">
      <n-button secondary size="small"
                :bordered="false"
                :type="hContent.isShow?'error':'success'">
        {{ hContent.tag }}
      </n-button>
      <n-space>
        <n-button
          size="small" type="info"
          @click="reviseContent(hContent)">
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
          是否将当前召唤师移除名单
        </n-popconfirm>

      </n-space>
    </div>
  </n-drawer-content>
</template>



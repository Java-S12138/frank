<script setup lang="ts">
import {NList, NListItem, NButton, NEllipsis, NDrawer} from "naive-ui"
import {Hater, HaterItem} from "./blackListTypes";
import {Ref, ref} from "vue";
import HaterDetails from "./haterDetails.vue";

const {haterList,localSumId,refreshList} = defineProps<{
  haterList: Hater[],
  localSumId:number,
  refreshList:() => void
}>()

const showDetails = ref(false)
const curHaterDetails:Ref<HaterItem|null> = ref(null)
const curHaterInfo:Ref<{name:string,sumId:string}|null> = ref(null)

const openDetailsDrawer = (haterInfo: HaterItem,name:string,sumId:string) => {
  curHaterDetails.value = haterInfo
  curHaterInfo.value = {name,sumId}
  showDetails.value = true
}
const closeDetailsDrawer = () => {
  showDetails.value = false
  clearDrawer()
  refreshList()
}
const clearDrawer = () => {
  curHaterDetails.value = null
  curHaterInfo.value = null
}

// 格式化数据库时间格式
const formatDate = (dateStr: string) => {
  return dateStr.split('T')[0]
}
// 获取召唤师头像
</script>

<template>
  <n-list>
    <div v-for="hater in haterList">
      <div v-for="haterInfo in hater.blacklist">
        <n-list-item
          v-if="haterInfo.playerSumId===String(localSumId)">
          <div
            class="flex justify-between items-center">
            <n-ellipsis :tooltip="false" style="max-width: 130px">
              <text>{{ hater.nickName }}</text>
            </n-ellipsis>
            <div class="flex gap-x-3 items-center">
              <text class="text-gray-400">{{ formatDate(haterInfo.UpdatedAt) }}</text>
              <n-button
                @click="openDetailsDrawer(haterInfo,hater.nickName,hater.sumId)"
                size="small" secondary
                :type="haterInfo.isShow?'error':'success'"
                :focusable="false">
                {{ haterInfo.tag }}
              </n-button>
            </div>
          </div>
        </n-list-item>
      </div>
    </div>
  </n-list>

  <n-drawer
    v-model:show="showDetails" class="rounded-t-xl"
    @after-leave="clearDrawer"
    :auto-focus="false" height="264" placement="bottom">
    <hater-details
      v-if="curHaterDetails && curHaterInfo"
      :close-drawer="closeDetailsDrawer"
      :h-content="curHaterDetails"
      :h-info="curHaterInfo"
      :is-edit="true"
    />
  </n-drawer>
</template>

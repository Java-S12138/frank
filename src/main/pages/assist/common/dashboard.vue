<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover, NPopconfirm, NDropdown, NDrawer, NDrawerContent} from 'naive-ui'
import {CircleMinus, Settings, CircleX} from '@vicons/tabler'
import {onMounted, ref} from "vue";
import {DashboardProps} from "./types";
import Setting from "@/main/pages/assist/common/setting.vue";
import ChampDetail from "@/main/pages/assist/views/rank/champDetail.vue";

onMounted(() => {
  if (isSubscribe==='t'){
    const remainSub = localStorage.getItem('remainSub')
    if (remainSub !== '' && remainSub !==null){
      subInfo.value = `${remainSub}天后到期`
      isShowSub.value = true
    }
  }
})


const isSubscribe = localStorage.getItem('isSubscribe')
const subInfo = ref('订阅服务')
const isShowSub = ref(false)
const isShowDrawer = ref(false)
const subscribes = [
  {
    label: '订阅须知',
    key: 1
  },
  {
    label: '支持一下',
    key: 2
  },
]

// todo 设置窗口置顶
cube.windows.setTopmost(cube.windows.current.id(),true)

const dragMove = () => {
  cube.windows.current.dragMove()
}

const handleMin = () => {
  cube.windows.minimize(cube.windows.current.id())
}

const handleClose = async () => {
  cube.extensions.terminate()
}

const handleSub = (key:number) => {
  if (key===1){
    cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/proposal')
  }else if (key===2){
    cube.profile.subscriptions.inapp.subscribe('1627551195412164610')
  }
}


</script>

<template>
  <header
    class="flex justify-between items-center h-8">
    <div class="flex items-center" @mousedown="dragMove()">
      <img src="../../../../assets/icon/app-icon.png" class="h-8" draggable="false">
      <img src="../../../../assets/icon/Frank.png" draggable="false" class="pt-1 pl-2 h-6">
    </div>

    <n-dropdown v-if="isShowSub" trigger="hover"
                :options="subscribes" @select="handleSub">
      <n-button type="warning" size="small">
          {{subInfo}}
      </n-button>
    </n-dropdown>

    <n-space class="pt-3" :size=[6,0]>
      <n-popover :show-arrow="false">
        <template #trigger>
          <n-button @click="handleMin" text>
            <n-icon size="20">
              <circle-minus/>
            </n-icon>
          </n-button>
        </template>
        最小化
      </n-popover>
      <n-popover :show-arrow="false">
        <template #trigger>
          <n-button text circle @click="isShowDrawer=true">
            <n-icon size="20">
              <settings/>
            </n-icon>
          </n-button>
        </template>
        设置
      </n-popover>
      <n-popconfirm @positive-click="handleClose" :show-icon="false">
        <template #trigger>
          <n-button text circle class="ml-0.5">
            <n-icon size="20">
              <circle-x/>
            </n-icon>
          </n-button>
        </template>
        是否退出Frank?
      </n-popconfirm>
    </n-space>
  </header>

  <n-drawer
    class="rounded-t-xl"
    v-model:show="isShowDrawer"
    :placement="'bottom'"
    :auto-focus="false"
    height="425"
  >
    <setting/>
  </n-drawer>
</template>

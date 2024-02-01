<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopconfirm, NDropdown, NDrawer} from 'naive-ui'
import {CircleMinus, Settings, CircleX} from '@vicons/tabler'
import {onMounted, ref} from "vue";
import Setting from "@/main/common/setting.vue";

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
  // @ts-ignore
  cube.windows.current.dragMove()
}

const handleMin = () => {
  // @ts-ignore
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
  <header class="flex justify-between items-center h-8 mb-2 relative">
    <div @mousedown="dragMove()" class="dragDiv"></div>
    <div class="flex items-center">
      <img src="../../assets/icon/app-icon.png" class="h-8" draggable="false">
      <img src="../../assets/icon/Frank.png" draggable="false" class="pt-1 pl-2 h-6">
    </div>
    <n-dropdown v-if="isShowSub" trigger="hover"
                :options="subscribes" @select="handleSub">
      <n-button type="warning" size="small">
          {{subInfo}}
      </n-button>
    </n-dropdown>
    <div class="flex mt-0.5 gap-x-2">
      <n-button :focusable="false" @click="handleMin" text>
        <n-icon size="20">
          <circle-minus/>
        </n-icon>
      </n-button>
      <n-button :focusable="false" text circle @click="isShowDrawer=true">
        <n-icon size="20">
          <settings/>
        </n-icon>
      </n-button>
      <n-popconfirm
        @positive-click="handleClose" :show-icon="false">
        <template #trigger>
          <n-button text circle>
            <n-icon size="20">
              <circle-x/>
            </n-icon>
          </n-button>
        </template>
        是否退出 Frank?
      </n-popconfirm>
    </div>
  </header>

  <n-drawer
    class="rounded-t-xl"
    v-model:show="isShowDrawer"
    :placement="'bottom'"
    :auto-focus="false"
    height="432"
  >
    <setting/>
  </n-drawer>
</template>

<template>
  <header  @mousedown="dragMove()" class="frankTitle">
    <n-space class="frankTitle">
      <img src="@/assets/icon/app-icon.png" draggable="false" alt=""
           width="40"  @click="handleMin" v-if="true">
      <img src="@/assets/icon/app-icon-bw.png" draggable="false"  alt="" width="40"  v-else>
      <img src="@/assets/icon/Frank.png" draggable="false"  style="margin-top: 4px">
    </n-space>
    <n-dropdown v-if="isShowSub"
      trigger="click" :options="subscribes" @select="handleSub">
      <n-button type="warning" size="large" style="margin-left: 35px" text>{{subInfo}}✨</n-button>
    </n-dropdown>
    <n-space class="rightCorner">
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button
            @click="handleMinimize"
            text
            :color="buttonColor">
            <n-icon size="25">
              <chevrons-down-right/>
            </n-icon>
          </n-button>
        </template>
        最小化
      </n-popover>
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button text circle :color="buttonColor" @click="changePage">
            <n-icon size="24">
              <settings/>
            </n-icon>
          </n-button>
        </template>
        设置
      </n-popover>
      <n-popconfirm @positive-click="handleClose"  :show-icon="false"
                    negative-text="取消" positive-text="确认">
        <template #trigger>
          <n-button text circle :color="buttonColor">
            <n-icon size="24">
              <circle-x/>
            </n-icon>
          </n-button>
        </template>
        是否退出Frank?
      </n-popconfirm>
    </n-space>

  </header>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,NDropdown} from 'naive-ui'
import {ChevronsDownRight, Settings, CircleX} from '@vicons/tabler'
import {onMounted, ref} from "vue";

const emits = defineEmits(['changePage'])
const isSubscribe = localStorage.getItem('isSubscribe')
const theme = localStorage.getItem('theme')
const buttonColor = ref('black')
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
const subInfo = ref('订阅服务')
const isShowSub = ref(isSubscribe==='f'?true:false)

onMounted(() => {
  if (isSubscribe==='t'){
    const remainSub = localStorage.getItem('remainSub')
    if (remainSub !== '' && remainSub !==null){
      subInfo.value = `${remainSub}天后到期`
      isShowSub.value = true
    }
  }

  if(theme === 'dark') {
    buttonColor.value = '#666666'
  }

})

const changePage = () => {
  emits('changePage')
}

const dragMove = () => {
  cube.windows.current.dragMove()
}

const handleMin = () => {
  cube.windows.minimize(cube.windows.current.id())
}
const handleMinimize =  () => {
  cube.windows.hide(cube.windows.current.id())
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

<style scoped>
header {
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-top: 10px;
  margin-right: 16px;
  margin-left: 16px;
  margin-bottom: 10px;
}

.rightCorner {
  padding-top: 8px;
  margin-right: 3px;
  align-items: center;
}

.frankTitle {
  align-items: center
}

</style>

<template>
  <div>
    <n-card v-if="isSubscribe ==='t'" class="mainCard boxShadow" content-style="padding-top:5px;padding-left:30px">
      <GameDetails/>
      <div class="suspension">
        <n-space :size="[2,0]">
          <n-button
            text
            @click="handleMin" class="textButtonColor">
            <n-icon size="25">
              <ChevronsDownLeft/>
            </n-icon>
          </n-button>
          <n-popover :show-arrow="false" trigger="hover" :delay="1000">
            <template #trigger>
              <n-button text circle color="black" @click="backPageSencond">
                <n-icon size="24"  class="textButtonColor">
                  <ArrowBackUp/>
                </n-icon>
              </n-button>
            </template>
            返回上一级页面
          </n-popover>
        </n-space>
      </div>
    </n-card>

    <n-card v-else class="mainCard boxShadow" content-style="padding-right:0px;padding-top:110px">
      <n-result size="large" status="404" title="召唤师详细对局信息"
                description="需要订阅服务 订阅说明请在主页查看">
        <template #footer>
          <n-space justify="center">
            <n-button @click="backPageSencond">返回上页</n-button>
            <n-button @click="openSubscribePage">支持一下</n-button>
          </n-space>
        </template>
      </n-result>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import GameDetails from "../components/gameDetails.vue";
import {
  NCard, NSpace, NIcon, NButton, NPopover,NResult
} from 'naive-ui'
import {ChevronsDownLeft, ArrowBackUp} from '@vicons/tabler'
import {matchStore} from "../../store";
import {storeToRefs} from "pinia";
const isSubscribe =  localStorage.getItem('isSubscribe')
const props:any = defineProps({
  lastPage: {
    type: Number
  }
})
const store = matchStore()
const {pageCount} = storeToRefs(store)
const backPageSencond = () => {
  if (props.lastPage===1){
    pageCount.value = 1
  }else {
    pageCount.value = 2
  }
}
const handleMin = async () => {
 cube.windows.minimize((await cube.windows.getCurrentWindow()).id)
}
const openSubscribePage = () => {
  cube.profile.subscriptions.inapp.subscribe('1627551195412164610')
}
</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  height: 556px;
  width: 720px;
}
.suspension {
  position: absolute;
  top: 10px;
  right: 8px;
}
</style>

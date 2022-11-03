<template>
  <div>
    <n-card class="mainCard boxShadow" content-style="padding-top:5px;padding-left:30px">
      <GameDetails/>
    </n-card>
    <div class="suspension">
      <n-space :size="[2,0]">
        <n-button
          text
          @click="handleMin" color="black">
          <n-icon size="25">
            <ChevronsDownLeft/>
          </n-icon>
        </n-button>
        <n-popover :show-arrow="false" trigger="hover" :delay="1000">
          <template #trigger>
            <n-button text circle color="black" @click="backPageSencond">
              <n-icon size="24">
                <ArrowBackUp/>
              </n-icon>
            </n-button>
          </template>
          返回上一级页面
        </n-popover>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameDetails from "../components/gameDetails.vue";
import {
  NCard, NSpace, NIcon, NButton, NPopover
} from 'naive-ui'
import {ChevronsDownLeft, ArrowBackUp} from '@vicons/tabler'
import {matchStore} from "../../store";
import {storeToRefs} from "pinia";

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
  right: 16px;
}
</style>

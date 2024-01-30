<script setup lang="ts">
import {NButtonGroup, NButton, NIcon, NSpace, useMessage} from "naive-ui";
import {CircleMinus, CircleX, Settings} from "@vicons/tabler";

const {showType,changeShowType} = defineProps<{showType:boolean,changeShowType:() => void}>()

const message = useMessage()

const openWeb = () => {
  cube.utils.openUrlInDefaultBrowser('https://lolfrank.cn')
}
const handleMin = () => {
  // @ts-ignore
  cube.windows.minimize(cube.windows.current.id())
}
const handleClose = async () => {
  // @ts-ignore
  cube.windows.close(cube.windows.current.id())
}
const handleSet = () => {
  message.info('无效按钮，或许起到了造型上的作用')
}
const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}
</script>

<template>
  <header class="flex relative">
    <div @mousedown="dragMove()" class="dragDiv"></div>
    <div class="flex gap-x-3.5 items-center">
      <img src="@/assets/icon/siteLogo.png" class="h-10" draggable="false">
      <n-button-group>
        <n-button @click="changeShowType" :focusable="false"
                  :type="showType?'success':'tertiary'">
          最近战绩
        </n-button>
        <n-button @click="changeShowType"  :focusable="false"
                  :type="!showType?'success':'tertiary'">
          数据分析
        </n-button>
      </n-button-group>
    </div>
    <div class="flex-grow flex items-center justify-end">
      <n-space style="margin-left: 21px;" class="pt-2" :size=[8,0]>
        <n-button @click="handleMin" text>
          <n-icon size="20">
            <circle-minus/>
          </n-icon>
        </n-button>
        <n-button text circle @click="handleSet">
          <n-icon size="20">
            <settings/>
          </n-icon>
        </n-button>
        <n-button text circle @click="handleClose">
          <n-icon size="20">
            <circle-x/>
          </n-icon>
        </n-button>
      </n-space>
    </div>
  </header>
</template>

<script setup lang="ts">
import {NSwitch, NCheckbox, NTag, NIcon, NButton, NButtonGroup, NPopconfirm,NDivider} from 'naive-ui'
import {ThumbUp,ThumbDown,Bulb,CircleMinus,CircleX} from "@vicons/tabler";
import {reactive, ref} from "vue"

const config = reactive(JSON.parse(<string>(localStorage.getItem('configSetting'))))
const isModalOpen = ref(false)
const isTips = ref(false)


const props = defineProps({
  isIn:{
    default:true,
  }
})

const handleMin = () => {
  //@ts-ignore
  cube.windows.hide(cube.windows.current.id())
}
const handleClose = () => {
  //@ts-ignore
  cube.windows.close(cube.windows.current.id())
}

const closeModalOutside = (event) => {
  // Check if the clicked element is outside the modal
  if (!event.target.closest('.bg-white')) {
    isModalOpen.value = false
  }
}

const strings = [
  '窗口显示 | 隐藏快捷键 Shift + Tab',
  '点击下方战绩标签 | 即可查看此局详细数据',
  '下方序号相同的玩家 | 代表开黑的玩家'
]

</script>

<template>
  <header class="flex w-full h-10">
    <div class="flex w-1/2 gap-x-4 ">
      <img src="@/assets/icon/siteLogo.png" class="mr-4" draggable="false" >
      <div class="flex flex-col gap-y-0.5">
        <text class="text-gray-400 text-xs">友方胜利次数</text>
        <n-tag :bordered="false" type="success"
               style="justify-content: center;width: 72px">
          <template #icon>
            <n-icon :size="15" :component="ThumbUp" />
          </template>
          23/50</n-tag>
      </div>
      <div class="flex flex-col gap-y-0.5">
        <text class="text-gray-400 text-xs">敌方胜利次数</text>
        <n-tag :bordered="false" type="error"
               style="justify-content: center;width: 72px">
          <template #icon>
            <n-icon :size="15" :component="ThumbDown" />
          </template>
          14/50</n-tag>
      </div>
    </div>

    <div class="flex w-1/2 justify-end gap-x-8">
      <n-tag class="h-10" style="cursor: default !important;"
             :bordered="false" type="default" :disabled="true">
        显示•隐藏 Shift + Tab</n-tag>
        <n-button-group size="large" >
          <n-button :focusable="false"  @click="isModalOpen = true" style="padding: 12px;" type="default">
            <template #icon>
              <N-icon :size="20" :component="Bulb"/>
            </template>
          </n-button>
          <n-button @click="handleMin"  style="padding: 12px;" type="default">
            <template #icon>
              <N-icon :size="20" :component="CircleMinus"/>
            </template>
          </n-button>
          <n-popconfirm
            @positive-click="handleClose" :show-icon="false">
            <template #trigger>
              <n-button  style="padding: 12px;" type="default">
                <template #icon>
                  <N-icon :size="20" :component="CircleX"/>
                </template>
              </n-button>
            </template>
            关闭此窗口 o.O?
          </n-popconfirm>

        </n-button-group>
    </div>
  </header>

  <!-- Modal -->
  <div v-if="isModalOpen" @click="closeModalOutside"
       class="fixed inset-0 bg-neutral-950 bg-opacity-40 flex items-center justify-center">
    <div class="bg-white px-8 py-4 rounded shadow-md">
      <!-- Modal content goes here -->
      <text class="text-xl">Tips</text>
      <p>1：召唤师右边序号相同的玩家，代表开黑玩家。</p>
      <p>2：点击下方战绩标签，即可查看此局详细数据。</p>

      <n-divider style="margin: 0 0" />

      <p class="flex gap-x-3 text-gray-400">
        游戏启动时，自动打开此窗口
        <n-switch :default-value="true"/>
      </p>
      <p class="my-0">
        <n-checkbox  v-model:checked="isTips">
          <text class="text-gray-400">不再自动弹出</text>
        </n-checkbox>
      </p>
    </div>
  </div>
</template>

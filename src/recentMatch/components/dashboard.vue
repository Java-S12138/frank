<script setup lang="ts">
import {NCheckbox, NTag, NIcon, NButton, NButtonGroup, NPopconfirm, NDivider} from 'naive-ui'
import {ThumbUp, ThumbDown, Bulb, CircleMinus, CircleX} from "@vicons/tabler";
import {onMounted, reactive, ref} from "vue"
import {ConfigSettingTypes} from "@/background/types";
import {getCurrentWindow} from "@tauri-apps/api/window";

const {winCount,isFriCount} = defineProps<{
  winCount:
    { friend: [number, number], enemy: [number, number] },
  isFriCount: boolean
}>()
const config:ConfigSettingTypes = reactive(JSON.parse(<string>(localStorage.getItem('configSetting'))))

const isModalOpen = ref(false)
const opacityVal = ref(config.inWinOpacity)

onMounted(() => {
  if (!config.isGameInTips){
    isModalOpen.value = true
  }
  window.addEventListener('keydown', handleKeyDown);

})
const handleMin = async () => {
  await getCurrentWindow().hide()
}

const handleKeyDown = (event) => {
  if (event.key === 'Tab'  && event.shiftKey) {
    handleMin()
  }
}
const handleClose = async () => {
  await getCurrentWindow().close()
}

const closeModalOutside = (event) => {
  // Check if the clicked element is outside the modal
  if (!event.target.closest('.bg-white')) {
    isModalOpen.value = false
  }
}

const changeConfig = () => {
  localStorage.setItem('configSetting',JSON.stringify(config))
}
</script>

<template>
  <header class="flex w-full h-10 relative">
    <div data-tauri-drag-region class="dragDiv"></div>
    <div class="flex w-1/2 gap-x-4">
      <img src="@/assets/icon/siteLogo.png" draggable="false">
      <div class="flex">
        <div class="flex flex-col gap-y-0.5 mr-4">
          <text class="text-gray-400 text-xs">友方胜利次数</text>
          <n-tag :bordered="false"
                 :type="isFriCount?'success':'error'"
                 style="justify-content: center;width: 72px">
            <template #icon>
              <n-icon :size="15"
                      :component="isFriCount?ThumbUp:ThumbDown"/>
            </template>
            {{ winCount.friend[0] }}/{{ winCount.friend[1] }}
          </n-tag>
        </div>
        <div class="flex flex-col gap-y-0.5">
          <text class="text-gray-400 text-xs">敌方胜利次数</text>
          <n-tag :bordered="false"
                 :type="!isFriCount?'success':'error'"
                 style="justify-content: center;width: 72px">
            <template #icon>
              <n-icon :size="15"
                      :component="!isFriCount?ThumbUp:ThumbDown"/>
            </template>
            {{ winCount.enemy[0] }}/{{ winCount.enemy[1] }}
          </n-tag>
        </div>
      </div>
  </div>

    <div class="flex w-1/2 justify-end gap-x-8">
      <n-tag class="h-10" style="cursor: default !important;"
             :bordered="false" type="default" :disabled="true">
        显示•隐藏&nbsp;&nbsp;&nbsp;&nbsp;Shift + Tab
      </n-tag>
      <n-button-group size="large">
        <n-button :focusable="false" @click="isModalOpen = true" style="padding: 12px;" type="default">
          <template #icon>
            <N-icon :size="20" :component="Bulb"/>
          </template>
        </n-button>
        <n-button
          @click="handleMin" style="padding: 12px;" type="default">
          <template #icon>
            <N-icon :size="20" :component="CircleMinus"/>
          </template>
        </n-button>
        <n-popconfirm
          @positive-click="handleClose" :show-icon="false">
          <template #trigger>
            <n-button style="padding: 12px;" type="default">
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
       class="fixed inset-0 bg-neutral-950 bg-opacity-40
       flex items-center justify-center z-50">
    <div class="bg-white text-neutral-900 px-6 py-4 rounded shadow-md dark:bg-neutral-900 dark:text-neutral-200">
      <!-- Modal content goes here -->
      <text class="text-xl">Tips</text>
      <p class="my-1 text-red-500">0：在游戏中显示，请将游戏窗口模式设置成【无边框】</p>
      <p class="my-1">1：Score：英雄熟练度分数, 右上角：英雄熟练度等级</p>
      <p class="my-1">2：段位下方的标签颜色相同时，代表：【开黑玩家】</p>
      <p class="my-1">3：游戏模式为单双 / 灵活排位时，只显示排位数据</p>
      <p class="my-1">4：标签含义 【S : 小代】【A : 绝活】【B : 熟练】</p>
      <p class="my-1">5：点击下方战绩标签，即可查看此局详细数据</p>
      <p class="my-1">6：点击英雄头像，可查看此英雄的技能信息</p>

      <n-divider style="margin: 22px 0 20px 0"/>

      <div class="mt-2 flex items-center justify-between">
        <p class="m-0">
          <n-checkbox v-model:checked="config.isGameInTips" @update:checked="changeConfig">
            <text class="text-gray-400">不再自动弹出</text>
          </n-checkbox>
        </p>
      </div>
    </div>
  </div>
</template>

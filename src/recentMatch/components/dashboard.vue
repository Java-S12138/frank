<script setup lang="ts">
import {NSwitch, NCheckbox, NTag, NIcon, NButton, NButtonGroup, NPopconfirm, NDivider} from 'naive-ui'
import {ThumbUp, ThumbDown, Bulb, CircleMinus, CircleX} from "@vicons/tabler";
import {onMounted, reactive, ref} from "vue"
import {ConfigSettingTypes} from "@/background/utils/backgroundTypes";

const {winCount,isFriCount} = defineProps<{
  winCount:
    { friend: [number, number], enemy: [number, number] },
  isFriCount: boolean
}>()
const subscribe = localStorage.getItem('subscribe')
const config:ConfigSettingTypes = reactive(JSON.parse(<string>(localStorage.getItem('configSetting'))))

const isModalOpen = ref(false)

onMounted(() => {
  if (!config.isGameInTips){
    isModalOpen.value = true
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
const dragMove = () => {
  // @ts-ignore
  cube.windows.current.dragMove()
}
const changeConfig = () => {
  localStorage.setItem('configSetting',JSON.stringify(config))
}
</script>

<template>
  <header class="flex w-full h-10 relative">
    <div @mousedown="dragMove()" class="dragDiv"></div>
    <div class="flex w-1/2 gap-x-4">
      <img src="@/assets/icon/siteLogo.png" draggable="false">
      <div class="flex" v-if="subscribe">
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
      <div v-else>
        <n-tag :bordered="false"  class="h-10" type="warning">
          订阅服务，享受完整的软件体验。感激您的理解和支持！
        </n-tag>
      </div>
    </div>

    <div class="flex w-1/2 justify-end gap-x-8">
      <n-tag class="h-10" style="cursor: default !important;"
             :bordered="false" type="default" :disabled="true">
        显示•隐藏 Shift + Tab
      </n-tag>
      <n-button-group size="large">
        <n-button :focusable="false" @click="isModalOpen = true" style="padding: 12px;" type="default">
          <template #icon>
            <N-icon :size="20" :component="Bulb"/>
          </template>
        </n-button>
        <n-button @click="handleMin" style="padding: 12px;" type="default">
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
       flex items-center justify-center z-50 rounded-lg">
    <div class="bg-white text-neutral-900 px-6 py-4 rounded shadow-md dark:bg-neutral-900 dark:text-neutral-200">
      <!-- Modal content goes here -->
      <text class="text-xl">Tips</text>
      <p class="my-1">1：[ 订阅 ] 游戏模式为单双 / 灵活排位时，只显示排位数据。</p>
      <p class="my-1">2：[ 订阅 ] 召唤师昵称序号相同的玩家代表，开黑玩家。</p>
      <p class="my-1">3：[ 订阅 ] 英雄熟练度分析 S : 小代 A : 绝活 B : 熟练。</p>
      <p class="my-1">4：点击下方战绩标签，即可查看此局详细数据。</p>
      <p class="my-1">5：普通用户，仅显示最近5场玩家战绩数据。</p>

      <n-divider style="margin: 22px 0 20px 0"/>

      <div class="flex items-center justify-between">
        <p class="m-0">
          <n-checkbox v-model:checked="config.isGameInTips" @update:checked="changeConfig">
            <text class="text-gray-400">不再自动弹出</text>
          </n-checkbox>
        </p>
        <text class="text-gray-400 ml-3">游戏启动时，自动打开此窗口</text>
        <n-switch
          v-model:value="config.isGameInWindow"
          @update:value="changeConfig"
          style="margin-bottom: 3px;"
        />
      </div>
    </div>
  </div>
</template>

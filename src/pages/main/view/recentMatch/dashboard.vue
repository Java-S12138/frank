<template>
  <header class="frankTitle" @mousedown="handldDrge()" >
    <n-space class="frankTitle">
      <img src="@/assets/icon/app-icon.png" draggable="false"  alt="" width="40">
      <img src="@/assets/icon/Frank.png" draggable="false" style="margin-top: 4px">
    </n-space>
    <n-space style="margin-top: 15px">
      <div style="display: flex">
        <p class="headerP">
          窗口快捷键 Shift+Tab</p>
      </div>
      <div style="display: flex">
        <p class="headerP">
          游戏内自动打开此窗口</p>
        <n-switch/>
      </div>

      <div style="display: flex">
        <p class="headerP">
          显示英雄头像</p>
        <n-switch v-model:value="active" @click="changeActive"/>
      </div>

      <n-button
        text
        @click="handleMin" color="black">
        <n-icon size="25" color="#9AA4AF">
          <chevrons-down-left/>
        </n-icon>
      </n-button>
    </n-space>
  </header>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton,NSwitch} from 'naive-ui'
import {ChevronsDownLeft} from '@vicons/tabler'
import {ref} from "vue"

const emits = defineEmits(['changeChampImg'])
const active = ref(false)

const changeActive = () => {
  emits('changeChampImg',active.value)
}

const handldDrge = () => {
  cube.windows.current.dragMove()
}
const handleMin = () => {

}

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin: 12px;
}
.frankTitle {
  align-items: center;
  height: 40px;
}
.headerP {
  padding-top: 1px;
  color: #9AA4AF;
  margin-right: 10.4px
}
</style>

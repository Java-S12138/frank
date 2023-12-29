<script setup lang="ts">
import {Ref, ref} from "vue";
import {NDrawerContent,NCard, NSpace, NTag, NButton, NSelect, NSwitch, NSlider,NPopover,NRadio,NTreeSelect} from 'naive-ui'
import {ConfigTypes} from "@/background/utils/config";

const config:Ref<ConfigTypes> = ref(JSON.parse(localStorage.getItem('config') as string))

const saveConfig = () => {
  localStorage.setItem('config',JSON.stringify(config.value))
}

const handleThemeChange = () => {
  if (config.value.theme !== 'dark') {
    document.documentElement.classList.add('dark')
    config.value.theme = 'dark'
    saveConfig()
    location.reload()
  } else {
    document.documentElement.classList.remove('dark')
    config.value.theme = 'light'
    saveConfig()
    location.reload()
  }
}
</script>

<template>
  <n-drawer-content>
    <n-space vertical>
      <n-space align="center">
        <n-tag :bordered="false">主题样式</n-tag>
        <n-radio
          :checked="config.theme === 'light'"
          value="light"
          name="basic-demo"
          @click="handleThemeChange"
        >
          浅色
        </n-radio>
        <n-radio
          :checked="config.theme === 'dark'"
          value="dark"
          name="basic-demo"
          @click="handleThemeChange"
        >
          深色
        </n-radio>
      </n-space>
    </n-space>
  </n-drawer-content>
</template>

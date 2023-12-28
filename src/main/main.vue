<script setup lang="ts">
import {NMessageProvider, NConfigProvider, zhCN, darkTheme} from 'naive-ui'
import {themeOverrides} from "./utils/theme";

const theme: string = JSON.parse(localStorage.getItem('config') as string).theme

if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :theme-overrides="themeOverrides"
    :theme="theme === 'dark' ? darkTheme :null"
  >
    <n-message-provider :placement="'bottom'">
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>


<script setup lang="ts">
import {NConfigProvider, zhCN, darkTheme} from 'naive-ui'
import {themeOverrides} from "../main/utils/theme";
import RecentMatch from "./recentMatch.vue";

const theme = localStorage.getItem('theme') || 'light'

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
    <recent-match/>
  </n-config-provider>
</template>


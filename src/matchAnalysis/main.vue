<script setup lang="ts">
import {NConfigProvider, zhCN, darkTheme, NMessageProvider} from 'naive-ui'
import {themeOverrides} from "../main/utils/theme";
import MatchAnalysis from "./matchAnalysis.vue";

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
    <n-message-provider :placement="'bottom'">
      <match-analysis/>
    </n-message-provider>
  </n-config-provider>
</template>


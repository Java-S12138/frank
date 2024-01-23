<script setup lang="ts">
import {NMessageProvider, NConfigProvider, zhCN, darkTheme,NDialogProvider,NGrid,NGi} from 'naive-ui'
import {themeOverrides} from "../main/utils/theme";
import QueryMatch from "./queryMatch.vue"

const theme = localStorage.getItem('theme')  || 'light'

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
    <n-dialog-provider>
      <n-message-provider :placement="'bottom'">
        <QueryMatch/>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>


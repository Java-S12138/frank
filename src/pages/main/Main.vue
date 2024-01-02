<script setup lang="ts">
import {NMessageProvider,darkTheme,NConfigProvider,NDialogProvider} from 'naive-ui'
const theme = localStorage.getItem('theme')
</script>

<template>
    <n-config-provider :theme="theme === 'dark' ? darkTheme :null">
        <n-message-provider :placement="'bottom'">
          <n-dialog-provider>
            <router-view></router-view>
          </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>


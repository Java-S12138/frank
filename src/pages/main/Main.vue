<script setup lang="ts">
import {NMessageProvider,darkTheme,NConfigProvider} from 'naive-ui'
const theme = localStorage.getItem('theme')
</script>

<template>
    <n-config-provider :theme="theme === 'dark' ? darkTheme :null">
        <n-message-provider :placement="'bottom'">
            <router-view></router-view>
        </n-message-provider>
    </n-config-provider>
</template>


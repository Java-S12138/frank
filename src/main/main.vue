<script setup lang="ts">
import {NMessageProvider,NConfigProvider,zhCN} from 'naive-ui'
import {themeOverrides} from "./utils/theme";
</script>

<template>
    <n-config-provider :locale="zhCN" :theme-overrides="themeOverrides">
        <n-message-provider :placement="'bottom'">
            <router-view ></router-view>
        </n-message-provider>
    </n-config-provider>
</template>


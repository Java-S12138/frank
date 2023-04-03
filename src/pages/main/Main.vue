<script setup lang="ts">
import {NMessageProvider,darkTheme,NConfigProvider} from 'naive-ui'
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-message-provider :placement="'bottom'">
            <router-view></router-view>
        </n-message-provider>
    </n-config-provider>
</template>

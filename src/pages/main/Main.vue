<script setup lang="ts">
import {NMessageProvider} from 'naive-ui'
// cube.windows.obtainDeclaredWindow('background')
</script>

<template>
  <n-message-provider :placement="'bottom'">
    <router-view></router-view>
  </n-message-provider>
</template>

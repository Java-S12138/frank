<script setup lang="ts">
import {NMessageProvider} from 'naive-ui'
</script>

<template>
  <n-message-provider :placement="'bottom'">
    <router-view></router-view>
  </n-message-provider>
</template>

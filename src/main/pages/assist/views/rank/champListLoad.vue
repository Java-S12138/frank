<script setup lang="ts">

import {NSkeleton, NSpace,NListItem} from "naive-ui";
</script>

<template>
  <n-list-item v-for="i in [0,1,2,3,4,5]">
    <n-space>
      <n-skeleton height="48px" width="48px" :sharp="false" />
      <n-space class="h-full" vertical justify="space-between">
        <n-skeleton height="16px" width="101px" :sharp="false" />
        <n-skeleton height="16px" width="218px" :sharp="false" />
      </n-space>
    </n-space>
  </n-list-item>
</template>

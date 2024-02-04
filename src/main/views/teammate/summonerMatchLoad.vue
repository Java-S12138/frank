<script setup lang="ts">

import {NLayout, NLayoutContent, NLayoutSider, NSkeleton, NSpace} from "naive-ui";
</script>

<template>
  <n-space vertical :size="[0,15]" style="margin-top: 3px">
    <n-layout class="dark:bg-[#2C2C32]" v-for="match in [0,1,2,3,4,5]" style="height: 50px" has-sider>
      <n-layout-sider width="50"  style="margin-right: 8px;">
        <div>
          <n-skeleton height="50px" width="50px" :sharp="false" />
        </div>
      </n-layout-sider>
      <n-layout class="dark:bg-[#2C2C32]">
        <n-layout-content class="dark:bg-[#2C2C32]">
          <div class="flex justify-between">
            <n-skeleton v-for="i in [0,1,2,3,4,5,6]" class="imgItem" :sharp="false" />
          </div>
        </n-layout-content class="dark:bg-[#2C2C32]">
        <n-layout-content style="margin-top: 7px;">
          <div class="flex justify-between">
            <n-skeleton style="width: 100%;height: 18px" />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-space>
</template>

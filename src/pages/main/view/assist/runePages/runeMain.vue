<template>
  <n-card class="boxShadow" size="small"
          content-style="padding-top:2px" style="height: 548px;">
    <n-tabs type="line" animated justify-content="space-between">
      <n-tab-pane name="tab1" tab="韩服符文">
        <rune-content/>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="配装方案">
        <block-content/>
      </n-tab-pane>
      <n-tab-pane name="tab3" tab="国服符文">
        七里香
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import {NTabs, NTabPane,NCard} from "naive-ui"
import RuneContent from "./runeContent.vue";
import BlockContent from "./blockContent.vue";
</script>

<style scoped>

</style>

<template>
  <n-card class="boxShadow" size="small">
    <n-space justify="center" vertical>
      <p style="color: #9aa4af;">当前友方队伍数据为空</p>
      <p style="color: #9aa4af;">请在选择英雄阶段使用</p>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {NCard, NSpace,useMessage,} from 'naive-ui'

</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}
</style>

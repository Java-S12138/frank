<template>
  <div class="mainDiv">
    <dashboard/>
    <div class="matchs">
      <match></match>
      <match></match>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "./dashboard.vue"
import Match from "./match.vue"

</script>

<style scoped>
.matchs {
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-between;
  margin: 0px 12px 12px 12px;
}
</style>

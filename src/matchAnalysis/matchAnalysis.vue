<script setup lang="ts">
import Dashboard from "./components/dashboard.vue";
import AnalysisMain from "./components/analysisMain.vue";
import {ref} from "vue";

const isShowMatch = ref(true)

const changeShowType = () => {
  isShowMatch.value = !isShowMatch.value
}

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :show-type="isShowMatch" :change-show-type="changeShowType"/>
    <analysis-main :show-type="isShowMatch"/>
  </div>
</template>

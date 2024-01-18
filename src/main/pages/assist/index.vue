<script setup lang="ts">
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import Dashboard from "./common/dashboard.vue"
import Navigation from "./common/navigation.vue";


onMounted(() => {
  useRouter().replace('/teammate')
})


</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard/>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <navigation/>
  </div>
</template>

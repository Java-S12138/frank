<script setup lang="ts">
import Dashboard from "./common/dashboard.vue"
import {ref} from "vue";
import SummonerInfo from "./views/home/summonerInfo.vue";
import Navigation from "./common/navigation.vue";
import {NSpace, NDrawer} from "naive-ui"
import Setting from "./common/setting.vue";

const isShowDrawer = ref(false)
const curDraContent = ref('setting')

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :open-setting-drawer="() => isShowDrawer = true"/>
    <router-view></router-view>
    <navigation/>
  </div>
  <n-drawer
    class="rounded-t-xl"
    v-model:show="isShowDrawer"
    :placement="'bottom'"
    :auto-focus="false"
    :height="412"
  >
    <setting v-if="curDraContent === 'setting'" />
  </n-drawer>
</template>

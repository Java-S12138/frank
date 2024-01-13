<script setup lang="ts">
import {NDrawer} from "naive-ui"
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import Setting from "./common/setting.vue";
import Dashboard from "./common/dashboard.vue"
import Navigation from "./common/navigation.vue";

onMounted(() => {
  useRouter().replace('/home')
})

const isShowDrawer = ref(false)
const curDraContent = ref('setting')

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :open-setting-drawer="() => isShowDrawer = true"/>
    <router-view class="fade-in" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
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

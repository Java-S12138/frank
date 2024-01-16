<script setup lang="ts">
import {NDrawer} from "naive-ui"
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import Setting from "./common/setting.vue";
import Dashboard from "./common/dashboard.vue"
import Navigation from "./common/navigation.vue";
import ChampDetail from "@/main/pages/assist/views/rank/champDetail.vue";
import {useCommonStore} from "@/main/store/useCommon";
import {useRankStore} from "@/main/store/useRank";

onMounted(() => {
  useRouter().replace('/home')
})

const commonStore = useCommonStore()
const rankStore = useRankStore()

const openSetDrawer = () => {
  commonStore.changeContent('setting')
  commonStore.showDrawer()
}

const handleDrawerLeave = () => {
  if (commonStore.curDraContent==='restraintList'){
    rankStore.clearStore()
  }
}

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :open-setting-drawer="openSetDrawer"/>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <navigation/>
  </div>
  <n-drawer
    class="rounded-t-xl"
    v-model:show="commonStore.isShowDrawer"
    :placement="'bottom'"
    :auto-focus="true"
    :height="commonStore.drawerHeight"
    @after-leave="handleDrawerLeave"
  >
    <setting v-if="commonStore.curDraContent === 'setting'" />
    <champ-detail v-else-if="commonStore.curDraContent === 'restraintList'"/>
  </n-drawer>
</template>

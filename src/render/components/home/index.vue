<template>
  <dashboard></dashboard>
  <div>
      <app-main v-if="pageCount==1" class="slide-in-left "></app-main>
      <fbottom v-if="pageCount==1" class="slide-in-left "></fbottom>
      <setting v-else-if="pageCount==2"  class="slide-in-right "></setting>

  </div>
</template>

<script>
import Dashboard from './dashboard.vue'
import Setting from './setting.vue'
import appMain from './appMain.vue'
import {NButton} from 'naive-ui'
import {useStore} from '../../store'
import {storeToRefs} from 'pinia'
import Fbottom from "@/render/components/home/fbottom";

export default {
  name: "index",
  components: {Fbottom, Dashboard, Setting, appMain, NButton},
  setup() {
    // 使用pinia 管理切换页面的参数
    const store = useStore()
    const {pageCount,echartsData} = storeToRefs(store)
    echartsData.value = {name:[],data:[],kdaHistory:[],horse:[]}
    const transPage = () => {
      store.pageIncrease()
    }
    return {
      store, pageCount, transPage
    }
  }
}
</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
</style>

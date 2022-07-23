<template>
  <dashboard></dashboard>
  <div>
    <app-main v-if="pageCount==1" class="slide-in-left "></app-main>
    <fbottom v-if="pageCount==1" class="slide-in-left "></fbottom>
    <setting v-else-if="pageCount==2" class="slide-in-right "></setting>
  </div>
</template>

<script setup>
import Dashboard from './dashboard.vue'
import Setting from './setting.vue'
import AppMain from './appMain.vue'
import {useStore} from '../../store'
import {storeToRefs} from 'pinia'
import Fbottom from "@/render/components/home/fbottom";

// 使用pinia 管理切换页面的参数
const store = useStore()
let {pageCount, echartsData} = storeToRefs(store)

</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
</style>

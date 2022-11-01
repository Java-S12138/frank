<template>
  <dashboard @changePage="() => { pageCount =  pageCount === 1 ? 2 : 1}"/>
  <div>
    <app-main v-if="pageCount===1" class="slide-in-left "/>
    <fbottom v-if="pageCount===1" class="slide-in-left "/>
    <setting v-else-if="pageCount===2" class="slide-in-right" @changePage="() => { pageCount = 1}"/>
  </div>
</template>

<script setup>
import Dashboard from './dashboard.vue'
import Setting from './setting.vue'
import AppMain from './appMain.vue'
import Fbottom from "@/render/components/home/fbottom"
import {ref} from "vue";

document.title = 'Frank'
const pageCount = ref(1)

</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
</style>

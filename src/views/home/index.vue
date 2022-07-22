<template>
    <dashboard></dashboard>
    <div>
        <app-main v-if="pageCount==1" class="slide-in-left "></app-main>
        <fbottom v-if="pageCount==1" class="slide-in-left "></fbottom>
        <setting v-else-if="pageCount==2"  class="slide-in-right "></setting>
    </div>
</template>

<script setup lang="ts">
import Dashboard from './dashboard.vue'
import AppMain from './appMain.vue'
import Fbottom from './fbottom.vue'
import Setting from './setting.vue'
import {storeToRefs} from 'pinia'
import {useStore} from '../../store';

// 使用pinia 管理切换页面的参数
const store = useStore()
const {pageCount} = storeToRefs(store)


</script>

<style>
@import url(../../assets/css/animationCommon.css);


</style>
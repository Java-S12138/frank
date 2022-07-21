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

.boxShadow {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
    0 3px 6px 0 rgba(0, 0, 0, 0.06),
    0 5px 12px 4px rgba(0, 0, 0, 0.04);
}
</style>
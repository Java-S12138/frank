<script setup lang="ts">
import {NMessageProvider} from 'naive-ui'
import Home from './views/home/index.vue'
</script>

<template>
    <n-message-provider :placement="'bottom'">
        <router-view></router-view>
    </n-message-provider>
</template>

<style>
@font-face {
    font-family: "FZBenMoYueYiTiS";
    src: url("./assets/fonts/FZBenMoYueYiTiS.ttf");
}
* {
    margin: 0;
    padding: 0;
    font-family: FZBenMoYueYiTiS, Avenir, Helvetica, Arial, sans-serif;
}
html {
    background: #f5f5f5;
}
::-webkit-scrollbar {
    width: 0;
}
</style>

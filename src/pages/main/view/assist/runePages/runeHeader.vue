<template>
  <n-card class="boxShadow" size="small">
    <n-space justify="space-between" align="center">
      <n-badge :value="storeRune.isAutoRune" color="#ff6666">
        <n-avatar
          round
          :bordered="false"
          :size="50"
          :src="storeRune.currentChampImgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display: block"
          @click="storeRune.restraintActive = true"
        />
      </n-badge>
      <div class="skillDiv"
        v-for="skill in storeRune.skillsList">
        <n-avatar
          round
          :bordered="false"
          :size="40"
          :src='skill[0]'
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display: block"
        />
        <strong class="skillText">{{skill[1]}}</strong>
      </div>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {NCard, NAvatar, NSpace, NBadge} from 'naive-ui'
import runeStore from "../../../store/runeStore";
const storeRune = runeStore()

</script>

<style scoped>
.skillDiv {
  position: relative;
}
.skillText {
  width: 14px;
  height: 14px;
  padding: 2px;
  position: absolute;
  top: 19px;
  left: 19px;
  background: rgba(32, 45, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  white-space: nowrap;
  color: #1fde79;
  font-size: 10px;
}
</style>

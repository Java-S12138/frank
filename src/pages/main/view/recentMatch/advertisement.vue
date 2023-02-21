<template>
  <n-carousel
    autoplay
    :interval="3000"
    effect="fade"
    show-arrow
    style="width: 100%; height: 500px"
  >
    <img
      class="carousel-img"
      src="../../../../assets/icon/testImg.png"
    >
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
    >
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
    >
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
    >
  </n-carousel>
  <n-space style="height: 50px;" justify="space-around" align="center">
    <n-tag type="warning" size="large">点击左侧可关闭轮播图</n-tag>
    <n-tag type="warning" size="large">解锁全部功能&去除广告 ￥9.9/月</n-tag>
    <n-tag type="warning" size="large">商务合作 V: lol_frank</n-tag>
  </n-space>
</template>

<script setup lang="ts">
import {NCarousel,NSpace,NTag} from 'naive-ui'
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
</style>

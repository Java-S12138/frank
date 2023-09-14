<template>
  <n-carousel
    autoplay
    effect="fade"
    show-arrow
    style="width: 100%; height: 500px"
  >
    <img
      class="carousel-img"
      v-for="img in imgList"
      :src="img"
    >
  </n-carousel>
  <n-space style="height: 50px;" justify="center" align="center">
    <n-tag type="warning" style="width:662px;justify-content: center"
           size="large">点击左侧可关闭轮播图 | 解锁全部功能&去除广告 ￥9.9/月 | 问题反馈 V: java_s@qq.com</n-tag>
  </n-space>
</template>

<script setup lang="ts">
import {NCarousel,NSpace,NTag} from 'naive-ui'
import {request} from "../../utils/request";
import {ref} from "vue";

const imgList = ref()
request({
  url:'https://frank-1304009809.cos.ap-chongqing.myqcloud.com/frank%2FfrankAd.json'
}).then(value => {
  if (value.status===200){
    imgList.value = value.data.imgList
  }
})
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
</style>

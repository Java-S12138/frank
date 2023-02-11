<template>
  <Dashboard @changePage="() => { pageCount =  pageCount === 1 ? 2 : 1}"/>
  <div>
    <summoner-info v-if="pageCount===1" class="slide-in-left "/>
    <fbottom v-if="pageCount===1" class="slide-in-left "
             :notice="notice" :page="page" @changePage="changePage"/>
    <setting v-else-if="pageCount===2"
             class="slide-in-right" @changePage="() => { pageCount = 1}"/>
  </div>
</template>

<script setup lang="ts" >
import Dashboard from './dashboard.vue'
import SummonerInfo from './summonerInfo.vue'
import Fbottom from './fbottom.vue'
import Setting from './setting.vue'
import {onMounted, ref} from 'vue'
import {request} from "../../utils/request";

const pageCount = ref(1)
const notice = ref({})
const page = ref(1)

onMounted(() => {
  cube.windows.getWindowByName('main').then(async (win) => {
    if (win.show){
      const timestamp = new Date().getTime()
      const res = await request.get(`https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice.json?date=${timestamp}`)
      if (res.status === 200 && res.data.isShow) {
        notice.value = res.data
        page.value = 2
      }
    }
  })
})

const changePage = () => {
  page.value = page.value === 2 ? 1 : 2
}

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);
</style>

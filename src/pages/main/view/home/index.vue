<template>
  <Dashboard @changePage="() => { pageCount =  pageCount === 1 ? 2 : 1}"/>
  <div>
    <summoner-info :init-setup="initSetup" v-if="pageCount===1" class="slide-in-left "/>
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
import {useDialog} from "naive-ui"

const pageCount = ref(1)
const notice = ref({})
const page = ref(1)
const initSetup = ref([false])
const dialog = useDialog()

onMounted(() => {
  cube.windows.getWindowByName('main').then(async (win) => {
    if (win.show){
      const timestamp = new Date().getTime()
      const res = await request.get(`https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice.json?date=${timestamp}`)
      if (res.status === 200 && res.data.isShow) {
        notice.value = res.data
        page.value = 2
      }
      // @ts-ignore
      if (res?.data?.version !== _VERSION && res?.data?.isUpdate){
        // @ts-ignore
        handleUpdate(res.data.version,_VERSION)
      }
    }
  })

  cube.profile.getCurrentUser().catch(() => {
    dialog.error({
      title: '温馨提示',
      closable:false,
      maskClosable:false,
      content: "Cube账号未登录 ψ(._. )>  如果您是订阅用户,将会导致无法正常使用订阅功能。请登录Cube账号后，重启Frank。",
      positiveText: '关闭软件',
      style:'width:360px',
      onPositiveClick: () => {
        cube.extensions.terminate()
      }
    })
  })
})

const changePage = () => {
  page.value = page.value === 2 ? 1 : 2
}

const handleUpdate = (cur:string,old:string) => {
  dialog.success({
    title: '版本更新',
    closable:false,
    maskClosable:false,
    content: `当前版本 ${old} — 最新版本 ${cur} ——— 为了提供更好的体验；请手动重启 Frank`,
    positiveText: '关闭软件',
    style:'width:360px',
    onPositiveClick: () => {
      cube.extensions.terminate()
    }
  })
}

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);
</style>

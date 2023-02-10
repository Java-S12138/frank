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
import {invokeLcu} from "../../lcu";

const pageCount = ref(1)
const notice = ref({})
const page = ref(1)

// onMounted(() => {
//   cube.windows.getWindowByName('main').then(async (win) => {
//     if (win.show){
//       const timestamp = new Date().getTime()
//       const res = await request.get(`https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice.json?date=${timestamp}`)
//       if (res.status === 200 && res.data.isShow) {
//         notice.value = res.data
//         page.value = 2
//       }
//     }
//   })
// })

const changePage = () => {
  page.value = page.value === 2 ? 1 : 2
}

const test =async () => {
  const clientPath = (await invokeLcu('get','/data-store/v1/install-dir')).replace('LeagueClient','Game')+'\\Logs\\GameLogs'
  console.log(clientPath)
  const logDir = await cube.io.readdir(clientPath)
  const logPath = (logDir[logDir.length-1]).name
  const logFilePath = (await cube.io.readdir(`${clientPath}/${logPath}`))[2].name
  const file = await cube.io.readFileContents(`${clientPath}/${logPath}/${logFilePath}`)
  const code = file.split(/[\n]+/).slice(0,51)
  const playerInfos = []

  mainfor:
  for (const string of code) {
    if (string.indexOf('Champion')!==-1){
      playerInfos.push(string)
      if (playerInfos.length===10){
        break mainfor
      }
    }
  }
  console.log(playerInfos)
}
test()

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);
</style>

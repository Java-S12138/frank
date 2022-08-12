<template>
  <header class="frankTitle">
    <n-space class="frankTitle" v-mouse-drag="handldDrge" >
      <img src="../../assets/icon/app-icon.png" draggable="false"  alt="" width="40" @click="handleMin">
      <img src="../../assets/icon/Frank.png" draggable="false"  style="margin-top: 4px">
      <n-space class="rightCorner">
        <n-popover :show-arrow="false" trigger="hover" :delay="1000">
          <template #trigger>
            <n-button
              text
              @click="handleMin" color="black">
              <n-icon size="25">
                <chevrons-down-left/>
              </n-icon>
            </n-button>
          </template>
          最小化
        </n-popover>

        <n-popconfirm @positive-click="handleClose" :show-icon="false"
                      negative-text="取消" positive-text="确认">
          <template #trigger>
            <n-button text circle color="black">
              <n-icon size="24">
                <circle-x/>
              </n-icon>
            </n-button>
          </template>
          是否关闭当前页面
        </n-popconfirm>
      </n-space>
    </n-space>
    <n-space style="margin-top: -8px">
      <n-space style="margin-right: 64px">
        <n-input style="width: 153px;" size="small" v-model:value="searchName" @keydown.enter="searchSummonerInfo" placeholder="仅支持当前大区玩家"/>
        <n-button type="success" size="small" @click="searchSummonerInfo" >搜索</n-button>
      </n-space>
      <n-pagination :on-update-page="changePage(page)"
        v-model:page="page" :page-count="20" :page-slot="7" />
    </n-space>
  </header>
</template>

<script setup>
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,
  NInput,NPagination,useMessage} from 'naive-ui'
import {ChevronsDownLeft,CircleX} from '@vicons/tabler'
import {ipcRenderer} from 'electron'
import {ref} from "vue";
import {appConfig} from "@/utils/main/config";
import {createHttp2Request, createHttpSession} from "@/utils/league-connect";
import {returnSummonerData} from "@/utils/render/queryMatchLcu";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";

const store = queryStore()
const {querySummonerId,summoner,begIndex,endIndex,page} = storeToRefs(store)
const message = useMessage()
const searchName = ref(null)
let isSearch = false

const searchSummonerInfo = async () => {
  if (searchName.value === null){
    message.error('召唤师昵称不能为空')
    return
  }
  const nickname = encodeURI(searchName.value)
  const credentials = appConfig.get('credentials')
  const session = await createHttpSession(credentials)

  const res = (await createHttp2Request({
    method:"GET",
    url:`/lol-summoner/v1/summoners/?name=${nickname}`
  },session,credentials)).json()
  session.close()
  if (res.httpStatus === 404){
    message.error('当前召唤师不存在')
    return
  }else{
    summoner.value = await returnSummonerData(credentials,res.summonerId)
    querySummonerId.value = summoner.value.summonerInfo.summonerId
    searchName.value = null
    page.value = 1
    isSearch = true
    return
  }
}

const changePage = (page) => {
  if (isSearch){
    isSearch = false
  }else {
    endIndex.value = (page)*8
    begIndex.value =(page-1)*8
  }
}

const handldDrge = (pos) => {
  ipcRenderer.send('move-query-match-window', {
    x: pos.x,
    y: pos.y,
  })
}

const handleMin = () => {
  ipcRenderer.send('query-match-min')
}

const handleClose = () => {
  ipcRenderer.send('query-match-close')
}

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin: 12px;
}

.rightCorner {
  padding-top: 8px;
  margin-left: 45px;
}

.frankTitle {
  align-items: center
}

</style>

<template>
  <header class="frankTitle" v-mouse-drag="handldDrge">
    <n-space class="frankTitle"  >
      <img src="../../assets/icon/app-icon.png" draggable="false"  alt="" width="40" @click="refresh">
      <n-button style="margin: 0px 5.5px 0px 5.5px"  v-if="summoner.summonerInfo.name !== localSummoner"
                type="primary"  secondary size="small" :bordered="false"
                @click="searchSummonerInfo(e,localSummoner)" >我就是我</n-button>
      <img src="../../assets/icon/Frank.png" draggable="false" v-else  style="margin-top: 4px">
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

        <n-popconfirm @positive-click="backHome" :show-icon="false"
                      negative-text="取消" positive-text="确认">
          <template #trigger>
            <n-button text circle color="black" style="margin-right: 2px">
              <n-icon size="24">
                <smart-home/>
              </n-icon>
            </n-button>
          </template>
          是否回到软件主页
        </n-popconfirm>

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
    <n-space class="rightSpace">
      <n-space style="margin-right: 10px" :size="[23]">
        <n-input style="width: 153px;" size="small" v-model:value="searchName" @keydown.enter="searchSummonerInfo" placeholder="仅支持当前大区玩家"/>
        <n-select v-model:value="currentMode"  :disabled="searchName.length !==0"
                  :options="options" size="small" :show-arrow="true" />
        <n-button type="success" size="small" @click="searchSummonerInfo" >搜索</n-button>
        <n-button type="success" secondary size="small" @click="showChart =!showChart" >
          <p v-if="!showChart">详细数据</p>
          <p v-else="showChart">数据图表</p>
        </n-button>
      </n-space>
      <n-pagination style="font-family: Arial"
        :on-update-page="changePage(page)"
        v-model:page="page" :page-count="20" :page-slot="9" />


    </n-space>

  </header>
</template>

<script setup>
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,
  NInput,NPagination,useMessage,NSelect} from 'naive-ui'
import {ChevronsDownLeft,CircleX,SmartHome} from '@vicons/tabler'
import {ipcRenderer} from 'electron'
import {ref} from "vue";
import {appConfig} from "@/utils/main/config";
import {createHttp2Request, createHttpSession} from "@/utils/league-connect";
import {returnSummonerData} from "@/utils/render/queryMatchLcu";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";

const store = queryStore()
const {querySummonerId,summoner,begIndex,endIndex,
  page,currentMode,showChart,localSummoner} = storeToRefs(store)
const message = useMessage()
const searchName = ref('')
const options = [
  {
    label: '全部模式',
    value: '全部模式'
  },
  {
    label: '单双排位',
    value: '单双排位'
  },
  {
    label: '灵活排位',
    value: '灵活排位'
  },
  {
    label: '极地乱斗',
    value: '极地乱斗'
  },
  {
    label: '匹配模式',
    value: '匹配模式'
  },
  {
    label: '其它模式',
    value: '其它模式'
  },
]

const searchSummonerInfo = async (event,local) => {
  if (searchName.value === '' && local === undefined){
    message.error('召唤师昵称不能为空')
    return
  }
  const nickname = local !== undefined ? encodeURI(local) :encodeURI(searchName.value)
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
    searchName.value = ''
    currentMode.value= '全部模式'
    return
  }
}


const changePage = (page) => {
  endIndex.value = (page)*8
  begIndex.value =(page-1)*8
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
const backHome = () => {
  ipcRenderer.send('query-match-back-home')
}
const refresh = () => {
  location.reload()
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
  margin-left: 8px;
}

.frankTitle {
  align-items: center
}
.rightSpace {
  margin-top: -8px;align-items: center
}

</style>

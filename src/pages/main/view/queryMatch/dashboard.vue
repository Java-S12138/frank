<template>
  <header class="frankTitle" @mousedown="handldDrge()" >
    <n-space class="frankTitle"  >
      <img src="@/assets/icon/app-icon.png" draggable="false"  alt="" width="40" @click="refresh">
      <n-button style="margin: 0px 5.5px 0px 5.5px"  v-if="summoner.summonerInfo.name !== localSummoner"
                type="primary"  secondary size="small" :bordered="false"
                @click="searchSummonerInfo(e,localSummoner)" >我就是我</n-button>
      <img src="@/assets/icon/Frank.png" draggable="false" v-else  style="margin-top: 4px;margin-left: 3px">
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
      <n-space style="margin-right: 10px" :size="[23,0]">
        <n-input style="width: 147.5px;" size="small" v-model:value="searchName" @keydown.enter="searchSummonerInfo" placeholder="仅支持当前大区玩家"/>
        <n-select v-model:value="currentMode"  :disabled="searchName.length !==0"
                  :options="options" size="small" :show-arrow="true" style="width: 100px;" />
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

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,
  NInput,NPagination,useMessage,NSelect} from 'naive-ui'
import {ChevronsDownLeft,CircleX,SmartHome} from '@vicons/tabler'
import {ref} from "vue";
// @ts-ignore
import {queryStore} from "@/pages/main/store";
import {storeToRefs} from "pinia";
import {lcuSummonerInfo} from "../../lcu/types/homeLcuTypes";
import {returnSummonerData} from "../../lcu/queryMatchLcu";
import {invokeLcu} from "../../lcu";

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

const searchSummonerInfo = async (event:any,local:any) => {
  if (searchName.value === '' && local === undefined){
    message.error('召唤师昵称不能为空')
    return
  }
  const nickname = local !== undefined ? local :searchName.value
  const res:lcuSummonerInfo = await invokeLcu('get',`/lol-summoner/v1/summoners`,[nickname])

  if (res.httpStatus === 404){
    message.error('当前召唤师不存在')
    return
  }else{
    summoner.value = await returnSummonerData(res.summonerId)
    querySummonerId.value = summoner.value.summonerInfo.currentId
    searchName.value = ''
    currentMode.value= '全部模式'
    return
  }
}


const changePage = (page:number) => {
  endIndex.value = (page)*8
  begIndex.value =(page-1)*8
}

const handldDrge = () => {
  cube.windows.current.dragMove()
}

const handleMin = () => {
  cube.windows.minimize(cube.windows.current.id())
}

const handleClose = () => {
  cube.windows.close(cube.windows.current.id())
}
const backHome = async () => {
  cube.windows.close(cube.windows.current.id())
  const mainInfo = await cube.windows.getWindowByName('main')
  cube.windows.show(mainInfo.id)
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
  margin-left: 5px;
}

.frankTitle {
  align-items: center
}


</style>

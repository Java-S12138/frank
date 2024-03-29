<script setup lang="ts">
import {
  NCard, NAvatar, NSpace, NSelect,
  NList, NListItem, NScrollbar, useMessage, NDropdown, NButton, NDrawer
} from 'naive-ui'
import './assistCommon.css'
import {onDeactivated, onMounted, Ref, ref} from "vue";
import {
  rankOptions,
  cnOptions,
  positionOptions,
  krOptions,
  queryCNServe,
  queryKRServe,
  getPostion, getLacalDateStr
} from "./utils";
import {ConfigRank} from "@/background/utils/backgroundTypes";
import {ChampInfo} from "./rankTypes";
import {aliasToId, champDict} from "@/resources/champList";
import ChampDetail from "@/main/views/rank/champDetail.vue";
import ChampListLoad from "@/main/views/rank/champListLoad.vue";
import SearchChamp from "@/main/common/searchChamp.vue";

onMounted(() => {
  queryChampRankData()
})

const configRank:ConfigRank = JSON.parse((localStorage.getItem('configRank')) as string)

const isShowDrawer = ref(false)
const tier = ref(configRank.tier)
const lane = ref(configRank.lane)
const is101 = ref(configRank.is101)
const isCheck = ref(1)
const champSliceList:Ref<ChampInfo[]> = ref([])
const currentChampDrawer:Ref<{champId:number,selectedList:string[]}> = ref({
  champId: 0,
  selectedList: [] as string[]
})

const message = useMessage()

const handleTierSelect = (key: number) => {
  champSliceList.value = []
  tier.value = key
  configRank.tier = key
  localStorage.setItem('configRank', JSON.stringify(configRank))
  queryChampRankData()
}
const handlePosSelect = (pos:string) => {
  champSliceList.value = []
  isCheck.value = 1
  configRank.lane = pos
  localStorage.setItem('configRank',JSON.stringify(configRank))
  lane.value = pos
   queryChampRankData().then((value) => {
     switch (pos) {
         case pos = 'top':
           message.success('上单数据更新成功')
           break;
         case pos = 'jungle':
           message.success('打野数据更新成功')
           break;
         case pos = 'mid':
           message.success('中单数据更新成功')
           break;
         case pos = 'bottom':
           message.success('下路数据更新成功')
           break;
         case pos = 'support':
           message.success('辅助数据更新成功')
           break;
       }
   })
}

// 根据不同的参数进行 快速排序
const quickSort = (factor:any) => {
  champSliceList.value.sort((x:any, y:any) => {
    return factor == 'sortId' ? parseFloat(x[factor]) - parseFloat(y[factor]) : parseFloat(y[factor]) - parseFloat(x[factor])
  })
}
const getComprehensiveRankData = () => {
  isCheck.value = 1
  quickSort('sortId')
}
// 根据胜率数据改变排行
const getWinRankData = () => {
  isCheck.value = 2
  quickSort('win')
}
// 根据出场率改变排行
const getAppearanceRankData = () => {
  isCheck.value = 3
  quickSort('appearance')
}
// 根据禁用率改变排行
const getBanRankData = () => {
  isCheck.value = 4
  quickSort('ban')
}
// ghostButtons列表
const ghostButtons = [
  { label: '综合', value: 1, action: getComprehensiveRankData},
  { label: '胜率', value: 2, action: getWinRankData},
  { label: '禁用', value: 4, action: getBanRankData},
  { label: '登场', value: 3, action: getAppearanceRankData},
]

// 获取不同服务器的数据
const queryChampRankData = async () => {
  if (is101.value){
    const champInfo = await queryCNServe(configRank,tier.value, lane.value, getLacalDateStr(),1)
    if (champInfo){
      champSliceList.value = champInfo
    }
  }else {
    const laneKr = getPostion(lane.value)
    const champInfo = await queryKRServe(configRank,tier.value,laneKr,localStorage.getItem('rankVers') as string)
    if (champInfo){
      champSliceList.value = champInfo
    }else {
      message.warning('韩服数据异常 已切换为国服数据')
      handleRankSelect()
    }
  }
}
// 改变不同服务器的数据排行
const handleRankSelect = () => {
  isCheck.value = 1
  is101.value = !is101.value
  tier.value = is101.value ? 200 : 2
  champSliceList.value = []
  queryChampRankData().then(() => {
    if (is101.value){
      message.success('国服数据获取成功')
    }else {
      message.success('韩服数据获取成功')
    }
  })
  configRank.tier = tier.value
  configRank.is101 = is101.value
  localStorage.setItem('configRank',JSON.stringify(configRank))
}

//搜索英雄数据
const searchChampData = (alias:string) => {
  if (alias===''){
    message.warning('输入框不能为空')
    return
  }

  const resultChamp:ChampInfo|undefined = champSliceList.value.filter(item => item.champId === aliasToId[alias])[0]
  if (resultChamp){
    initDesDrawer(true,resultChamp.champId,resultChamp.imgUrl,resultChamp.tLevel)
  }else {
    message.warning('当前英雄在此位置不存在')
  }
}

// 初始化或者清空抽屉数据 打开英雄详细数据抽屉窗口
const initDesDrawer = (isInit:boolean,champId?:number,imgUrl?:string,level?:string) => {
  if (isInit){
    isShowDrawer.value = true
    // @ts-ignore
    const selectedList:string[] = [imgUrl, champDict[champId].label +'•' + champDict[champId].title, level,String(champId)]
    // @ts-ignore
    currentChampDrawer.value ={
      champId: champId,selectedList: selectedList,
    }
  }else {
    currentChampDrawer.value = {
      champId: 0, selectedList: []
    }
  }
}

onDeactivated(() => {
  isShowDrawer.value = false
  initDesDrawer(false)
})
</script>

<template>
  <div class="mainContent">
    <n-card size="small" class="shadow" content-style="padding-bottom: 0;">
      <n-space justify="space-between">
        <n-dropdown :show-arrow="false" trigger="hover"
                    :options="rankOptions" @select="handleRankSelect">
          <n-button secondary type="info">{{ is101?'国服排位英雄数据':'韩服排位英雄数据' }}</n-button>
        </n-dropdown>
        <n-select v-model:value="tier"
                  :show-checkmark="false"
                  :options="is101 ? cnOptions : krOptions"
                  @update:value="handleTierSelect"/>
      </n-space>

      <n-space class="mt-2 mb-2.5" justify="space-between">
        <n-button
          v-for="(button, index) in ghostButtons"
          :key="index"
          :bordered="false"
          :type="isCheck === button.value ? 'info':'tertiary' "
          size="small"
          secondary
          @click="button.action"
        >
          {{ button.label }}
        </n-button>
      </n-space>
    </n-card>
    <n-card class="shadow " size="small" style="margin-top: 18px;" content-style="padding:0 12px 10px 12px;">
      <n-list>
        <template #header>
          <div class="h-7 flex gap-x-5">
            <search-champ :select-func="searchChampData"/>
            <n-dropdown trigger="hover" placement="left-start"
                        :options="positionOptions" @select="handlePosSelect">
              <div class="absolute right-2" style="top: 8px" :class="lane"></div>
            </n-dropdown>
          </div>
        </template>
        <n-scrollbar style="max-height: 432px;padding-right: 13px">
          <n-list-item v-if="champSliceList.length!==0" v-for="chapm in champSliceList">
            <div class="flex gap-x-3" >
              <div class="flex items-center justify-center h-12 w-12 rounded bg-blue-100 cursor-pointer dark:bg-[#70c0e850]">
                <n-avatar
                  @click="initDesDrawer(true,chapm.champId,chapm.imgUrl,chapm.tLevel)"
                  :bordered="false"
                  :size="40"
                  lazy
                  :src=chapm.imgUrl
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                />
              </div>
              <div class="flex-grow">
                <div style="height: 48px"
                     class="flex flex-col gap-y-2.5">
                  <text class="text-sm">{{ chapm.name }}</text>
                  <div class="flex justify-between items-end relative">
                    <text
                      :class="isCheck===2?'text-blue-400':''"
                      class="text-gray-400 text-xs" >胜率 {{ chapm.win }}</text>
                    <text
                      :class="isCheck===4?'text-blue-400':''"
                      class="text-gray-400 text-xs absolute left-20">禁用 {{ chapm.ban }}</text>
                    <text
                      :class="isCheck===3?'text-blue-400':''"
                      class="text-gray-400 text-xs">登场 {{ chapm.appearance }}</text>
                  </div>
                </div>
              </div>
              <div class="absolute right-0 top-3" :class="'imgT'+chapm.tLevel"></div>
            </div>
          </n-list-item>
          <champ-list-load v-else/>
        </n-scrollbar>
      </n-list>
    </n-card>
    <n-drawer
      class="rounded-t-xl" v-model:show="isShowDrawer"
      placement="bottom" :auto-focus="true" height="444"
      @after-leave="initDesDrawer(false)"
    >
      <champ-detail
        :champ-id="currentChampDrawer.champId"
        :is101 = "is101"
        :lane = "lane"
        :tier = "tier"
        :selected-list = "currentChampDrawer.selectedList"
      />
    </n-drawer>
  </div>
</template>


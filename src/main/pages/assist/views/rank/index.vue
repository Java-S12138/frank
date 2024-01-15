<script setup lang="ts">
import {
  NCard, NAvatar, NAutoComplete, NSpace, NTag, NDrawer, NDrawerContent, NSelect,
  NList, NListItem, NScrollbar, useMessage, NDropdown, NTabPane, NButton, NIcon,SelectOption
} from 'naive-ui'
import './assistCommon.css'
import {computed, onMounted, Ref, ref,h, VNodeChild } from "vue";
import {rankOptions, cnOptions, positionOptions,krOptions,queryCNServe,queryKRServe} from "./utils";
import {ConfigRank} from "@/background/utils/configTypes";
import {ChampInfo} from "./rankTypes";
import {keywordsList} from "@/resources/champList";

onMounted(() => {
  queryChampRankData()
})

const configRank:ConfigRank = JSON.parse((localStorage.getItem('configRank')) as string)

const tier = ref(configRank.tier)
const lane = ref(configRank.lane)
const is101 = ref(configRank.is101)
const isCheck = ref(1)
const inputValue = ref('')
const champSliceList:Ref<ChampInfo[]> = ref([])
const message = useMessage()

const handleTierSelect = (key: number) => {
  tier.value = key
  configRank.tier = key
  localStorage.setItem('configRank', JSON.stringify(configRank))
  queryChampRankData()
}
const handlePosSelect = (pos:string) => {
  isCheck.value = 1
  configRank.lane = pos
  localStorage.setItem('config',JSON.stringify(configRank))
  lane.value = pos
  queryChampRankData()
  switch (pos) {
    case pos = 'top':
      message.success('上单数据更新成功');
      break;
    case pos = 'jungle':
      message.success('打野数据更新成功');
      break;
    case pos = 'mid':
      message.success('中单数据更新成功')
      break;
    case pos = 'bottom':
      message.success('下路数据更新成功');
      break;
    case pos = 'support':
      message.success('辅助数据更新成功');
      break;
  }
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

const ghostButtons = [
  { label: '综合', value: 1, action: getComprehensiveRankData, size: 'small' },
  { label: '胜率', value: 2, action: getWinRankData, size: 'small' },
  { label: '登场率', value: 3, action: getAppearanceRankData, size: 'small' },
  { label: '禁用率', value: 4, action: getBanRankData, size: 'small' },
]

// 获取当前日期
const getLacalDateStr = () => {
  let currentDate = new Date()
  let dateList = currentDate.toLocaleDateString().split('/')
  dateList[1] = dateList[1].length == 1 ? '0' + dateList[1] : dateList[1]
  dateList[2] = dateList[2].length == 1 ? '0' + dateList[2] : dateList[2]
  return parseInt(dateList.join('')) - 1
}

// 获取不同服务器的数据
const queryChampRankData = async () => {
  if (is101.value){
    const champInfo = await queryCNServe(configRank,tier.value, lane.value, getLacalDateStr(),1)
    if (champInfo){
      champSliceList.value = champInfo
    }
  }else {
    let laneKr = ''
    switch (lane.value) {
      case lane.value = 'top':
        laneKr = '0';
        break;
      case lane.value = 'jungle':
        laneKr = '1';
        break;
      case lane.value = 'mid':
        laneKr = '2';
        break;
      case lane.value = 'bottom':
        laneKr = '3';
        break;
      case lane.value = 'support':
        laneKr = '4';
        break;
    }
    const champInfo = await queryKRServe(configRank,tier.value,laneKr)
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
  queryChampRankData()
  configRank.tier = tier.value
  configRank.is101 = is101.value
  localStorage.setItem('configRank',JSON.stringify(configRank))
}

// 渲染提示框
const renderLabel = (option: SelectOption): VNodeChild => [
  h('div', { style: 'display: flex; align-items: center;' }, [
    h(NAvatar, {
      style: 'margin-right: 8px;',
      size: 24,
      round: false,
      src: `https://game.gtimg.cn/images/lol/act/img/champion/${option.value}.png`
    }),
    option.label as string
  ])
]

// 生成输入框渲染提示选项
const autoOptions = computed(() => {
  if (inputValue.value==='' || inputValue.value===null){
    return
  }
  const keyword = inputValue.value.toLowerCase()
  const renderList = keywordsList.filter(item => item.keywords.toLowerCase().includes(keyword))

  if (renderList.length > 5 || renderList.length===0){
    return
  }

  return renderList.map((champ) => {
    return {
      value: champ.alias,
      label: champ.name
    }
  })
})

//搜索英雄数据
const searchChampData = (alias:string) => {
  if (alias===''){
    message.warning('输入框不能为空')
  }
  message.success(alias)
}

</script>

<template>
  <n-card size="small" class="mt-4 shadow" content-style="padding-bottom: 0;">
    <n-space justify="space-between">
      <n-dropdown :show-arrow="true" trigger="hover" :options="rankOptions" @select="handleRankSelect">
        <n-button secondary type="info">{{ is101?'国服排位英雄数据':'韩服排位英雄数据' }}</n-button>
      </n-dropdown>
      <n-select v-model:value="tier"
                :show-checkmark="false"
                :options="is101 ? cnOptions : krOptions"
                @update:value="handleTierSelect"/>
    </n-space>

    <n-space class="my-1" justify="space-between">
      <n-button
        v-for="(button, index) in ghostButtons"
        :key="index"
        :bordered="false"
        :ghost="true"
        :type="isCheck === button.value ? 'info' : 'default'"
        size="small"
        class="px-0"
        @click="button.action"
      >
        {{ button.label }}
      </n-button>
    </n-space>
  </n-card>

  <n-card class="shadow " size="small" style="margin-top: 17px;" content-style="padding-top: 0;">
    <n-list>
      <template #header>
          <div class="h-7 flex gap-x-5">
            <n-auto-complete
              size="small"
              :clear-after-select="true"
              v-model:value="inputValue"
              @select="searchChampData"
              :options="autoOptions"
              placeholder="请输入英雄昵称"
              :render-label="renderLabel"
              style="width: 162px;"
            >
            </n-auto-complete>
            <n-button size="small" secondary type="info" @click="searchChampData(inputValue)">搜索</n-button>
            <n-dropdown trigger="hover" placement="left-start"
                        :options="positionOptions" @select="handlePosSelect">
            <div class="absolute right-2" style="top: 8px" :class="lane"></div>
            </n-dropdown>
          </div>
      </template>
      <n-scrollbar style="max-height: 431.5px;padding-right: 13px">
        <n-list-item v-for="chapm in champSliceList">
          <div class="flex gap-x-3" >
            <div class="flex items-center justify-center h-12 w-12 rounded bg-blue-100 cursor-pointer">
              <n-avatar
                :bordered="false"
                :size="40"
                lazy
                :src=chapm.imgUrl
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              />
            </div>
            <div class="flex-grow">
              <n-space vertical :size=[0,2]>
                <text>{{ chapm.name }}</text>
                <n-space justify="space-between">
                  <div style="width: 65px;">
                    <text class="text-gray-400 text-xs">胜率 {{ chapm.win }}</text>
                  </div>
                  <div style="width: 65px;">
                    <text class="text-gray-400 text-xs">禁用 {{ chapm.ban }}</text>
                  </div>
                  <text class="text-gray-400 text-xs">登场 {{ chapm.appearance }}</text>
                </n-space>
              </n-space>
            </div>
            <div class="absolute right-0 top-3" :class="'imgT'+chapm.tLevel"></div>
          </div>
        </n-list-item>
      </n-scrollbar>
    </n-list>
  </n-card>
</template>


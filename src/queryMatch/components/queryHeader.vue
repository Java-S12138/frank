<script setup lang="ts">
import {NButton, NInput, NSelect, NPagination, useMessage, NIcon, NSpace, MessageReactive} from "naive-ui"
import {ref, watch} from "vue";
import {CircleMinus, CircleX, Settings} from "@vicons/tabler";
import {querySummonerInfo} from "@/lcu/aboutSummoner";
import useMatchStore from "@/queryMatch/store";

const matchStore = useMatchStore()
const inputVal = ref('')
const selectVal = ref(0)
const pageVal = ref(1)
const message = useMessage()

watch(() => matchStore.summonerId, () => {
  clearVal()
})

const options = [
  {
    label: "全部模式",
    value: 0,
  },
  {
    label: "单双排位",
    value: 420,
  },
  {
    label: '灵活排位',
    value: 440
  },
  {
    label: '匹配模式',
    value: 430
  },
  {
    label: '极地乱斗',
    value: 450
  },
  {
    label: '斗魂竞技',
    value: 1700
  },
]

const changeMatchMode = async (queueId: number) => {
  if (matchStore.sumInfo !== null) {
    const curMod = options.find(i => i.value === selectVal.value)?.label
    const mes: MessageReactive = message.loading(`${curMod} 加载中...`)
    await matchStore.getSpecialMatchList(queueId,matchStore.sumInfo.info.puuid)
    mes.destroy()
  } else {
    matchStore.getSpecialMatchList(queueId)
  }
  pageVal.value = 1
}

const searchSum = async () => {
  if (inputVal.value === '') {
    message.warning('召唤师昵称不能为空')
    return
  }
  const sumInfo = await querySummonerInfo(undefined, inputVal.value)
  if (sumInfo === null) {
    message.error('当前召唤师不存在，[ 跨区服务器需要加上编号 ] xxx#12138')
    clearVal()
    return
  }

  if (sumInfo.privacy !== 'PUBLIC') {
    message.error('当前召唤师战绩为隐藏状态')
    clearVal()
    return
  }
  matchStore.init(sumInfo.currentId)
  clearVal()
}
const clearVal = () => {
  inputVal.value = ''
  selectVal.value = 0
  pageVal.value = 1
}
const openWeb = () => {
  cube.utils.openUrlInDefaultBrowser('https://lolfrank.cn')
}
const handleMin = () => {
  // @ts-ignore
  cube.windows.minimize(cube.windows.current.id())
}
const handleClose = async () => {
  // @ts-ignore
  cube.windows.close(cube.windows.current.id())
}
const handleSet = () => {
  message.info('无效按钮，或许起到了造型上的作用')
}
const backSelf = () => {
  matchStore.init()
  clearVal()
}
const pageChange = (page: number) => {
  if (selectVal.value === 0) {
    matchStore.getMatchList(page)
  } else {
    matchStore.fromSpecialToMatchList(page)
  }
}
</script>

<template>
  <header class="flex">
    <div class="flex gap-x-2 items-center mr-3">
      <img src="@/assets/icon/app-icon.png" class="h-10" draggable="false">
      <img src="@/assets/icon/Frank.png" draggable="false">
      <n-button
        v-if="matchStore.summonerId===matchStore.localSumId"
        @click="openWeb"
        size="small" style="margin-left: 30px;color: #666666;width: 90.41px"
        secondary type="tertiary">
        lolfrank.cn
      </n-button>
      <n-button
        v-else
        @click="backSelf"
        size="small" style="margin-left: 30px;width: 90.41px"
        secondary type="info">
        Back Self
      </n-button>
    </div>
    <div class="flex-grow flex items-center gap-x-3">
      <n-input v-model:value="inputVal" type="text" spellcheck="false" style="width: 141px;font-size: 13.5px"
               size="small" placeholder="仅支持同服务器玩家"/>
      <n-button size="small" :bordered="false" @click="searchSum"
                type="success" style="width: 46px;padding: 0 9px">
        查询
      </n-button>
      <n-select size="small" v-model:value="selectVal"
                :disabled="inputVal!==''"
                @update:value="changeMatchMode"
                :options="options" style="width: 100px;margin-left: 28px;"/>
      <n-pagination v-model:page="pageVal"
                    @update-page="pageChange"
                    :page-slot="10"
                    :page-count="20"/>

      <n-space style="margin-left: 21px;" class="pt-2" :size=[8,0]>
        <n-button @click="handleMin" text>
          <n-icon size="20">
            <circle-minus/>
          </n-icon>
        </n-button>
        <n-button text circle @click="handleSet">
          <n-icon size="20">
            <settings/>
          </n-icon>
        </n-button>
        <n-button text circle @click="handleClose">
          <n-icon size="20">
            <circle-x/>
          </n-icon>
        </n-button>
      </n-space>
    </div>
  </header>
</template>


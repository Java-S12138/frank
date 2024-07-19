<script setup lang="ts">
import {NButton, NInput, NSelect, NPagination,NAlert,NModal,NCard,
  useMessage, NIcon, NSpace, MessageReactive} from "naive-ui"
import {ref, watch} from "vue";
import {CircleMinus, CircleX, Settings} from "@vicons/tabler";
// import {querySummonerInfo} from "@/lcu/aboutSummoner";
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
const showModal = ref(false)
const subscribe = localStorage.getItem('subscribe')

const changeMatchMode = async (queueId: number) => {
  if (matchStore.sumInfo !== null) {
    const curMod = options.find(i => i.value === selectVal.value)?.label
    const mes: MessageReactive = message.loading(`${curMod} 加载中...`,
      {duration:6666})
    matchStore.getSpecialMatchList(queueId,matchStore.sumInfo.info.puuid).then(() => mes.destroy())

  } else {
    matchStore.getSpecialMatchList(queueId)
  }
  pageVal.value = 1
}

const searchSum = async () => {
  showModal.value = !showModal.value
/*  if (inputVal.value === '') {
    message.warning('召唤师昵称不能为空')
    return
  }
  const sumInfo = await querySummonerInfo(undefined, inputVal.value)
  if (sumInfo === null) {
    message.error('当前召唤师不存在，[ 需要加上编号，#号前后无空格 ] xxx#12138')
    clearVal()
    return
  }

  if (sumInfo.privacy !== 'PUBLIC' && !subscribe) {
    message.error('Sorry，不支持查询隐藏战绩玩家')
    clearVal()
    return
  }
  matchStore.init(sumInfo.currentId)
  clearVal()*/
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
const refreshPage = () => {
  matchStore.init()
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
<!--      <n-input v-model:value="inputVal" type="text" spellcheck="false" style="width: 141px;font-size: 13.5px"
               size="small" placeholder="仅显示我的战绩数据"/>-->
      <n-button size="small" secondary type="tertiary" :bordered="false" @click="searchSum"
                style="width: 141px;color: #666666;font-size: 13.5px">
        仅显示玩家战绩数据
      </n-button>
      <n-button size="small" :bordered="false" @click="refreshPage"
                type="success" style="width: 46px;padding: 0 9px">
        刷新
      </n-button>
      <n-select size="small" v-model:value="selectVal"
                :disabled="inputVal!==''"
                @update:value="changeMatchMode"
                :options="options" style="width: 100px;margin-left: 28px;"/>
      <n-pagination v-model:page="pageVal"
                    @update-page="pageChange"
                    :page-slot="10"
                    :page-count="subscribe?30:10"/>

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
    <n-modal v-model:show="showModal" transform-origin="center">
      <n-card
        style="width: 540px;border-radius: 8px"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
      >
        <n-alert title="查询战绩已禁用" type="error">
          尊敬的用户：<br><br>
          根据英雄联盟官方要求，将于2024年7月17日起停止提供战绩查询功能。
          对此给您带来的不便，深表歉意，感谢您一直对Frank的支持与理解。<br><br>
          Frank开发者敬上
        </n-alert>
      </n-card>

    </n-modal>
  </header>

</template>


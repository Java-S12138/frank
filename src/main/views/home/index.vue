<script setup lang="ts">
import {
  NCard,
  NAvatar,
  NProgress,
  NSpace,
  NTag,
  NDivider,
  NList,
  NListItem,
  NButton,
  NEllipsis,
  NResult,
  NSkeleton,
  NStep,
  NIcon, NSteps
} from 'naive-ui'
import {getCurrentSummonerAllInfo} from "./getHomeData";
import {onActivated, onMounted, reactive, Ref, ref} from "vue";
import {SummonerData} from "@/lcu/types/SummonerTypes";
import StartGame from "./startGame.vue";
import {GameInfo, sumInfoTypes} from "@/background/utils/backgroundTypes";
import {TencentRsoPlatformId} from "@/resources/areaList";
import {useRecordStore} from "@/main/store/useRecord";
import MatchAnalysis from "@/main/views/teammate/matchAnalysis.vue";
import {RencentDataAnalysisTypes} from "@/main/views/teammate/teammateTypes";
import {findTopChamp} from "@/main/views/teammate/utils";
import {Bulb, Crown, Planet} from "@vicons/tabler";
import {queryMatchHistory} from "@/lcu/aboutMatch";
import BaseMatch from "@/queryMatch/utils/baseMatch";

const summonerData: SummonerData = reactive({
  summonerInfo: null,
  rankList: null,
  champLevel: null,
})
let recordStore: any = useRecordStore()

const baseMatch = new BaseMatch()
const analysisData: Ref<RencentDataAnalysisTypes | null> = ref(null)
const isLodaing: Ref<boolean|null> = ref(true)

onMounted(() => {
  init(true).then(async (value) => {
    if (!value) {
      const lolCient = (await cube.games.launchers.getRunningLaunchers())
        .find(((i: any) => i.classId === 10902))

      if (lolCient === undefined) {
        onClientLaunch()
      } else {
        let timer = 0
        const maxAttempts = 3
        const launchInterval = setInterval(async () => {
          timer++
          const isInit = await init(true)
          if (isInit || timer === maxAttempts) {
            clearInterval(launchInterval)
          }
        }, 1500)
      }
    }
  })
})

onActivated(() => {
  if (summonerData.summonerInfo !== null) {
    init(false)
  }
})

const init = async (isFirst: boolean) => {
  const summonerAllInfo = await getCurrentSummonerAllInfo()
  if (summonerAllInfo === null) {
    return false
  }
  if (isFirst) {
    writeSumInfo(summonerAllInfo)
  }

  summonerData.summonerInfo = summonerAllInfo.summonerInfo
  summonerData.rankList = summonerAllInfo.rankList as string[]
  getAnalysis(summonerData.summonerInfo.puuid)
  return true
}
// 获取战绩分析数据
const getAnalysis = async (puuid: string) => {
// 如果 analysisData 为空，直接获取分析数据
  if (analysisData.value === null) {
    const rawMatch: any = await baseMatch.dealMatchHistory(puuid, 0, 19)
    analysisData.value = findTopChamp(rawMatch)
    isLodaing.value = null
    return
  }

  // 获取最近的一场比赛
  const recentMatch = await queryMatchHistory(puuid, 0, 0)
  const recentGameId = recentMatch?.[0]?.gameId || null

  // 如果最近比赛的 ID 与当前分析数据中的 ID 一致，退出函数
  if (analysisData.value?.oneGameId === recentGameId) {
    return
  }

  // 否则，重新获取分析数据
  const rawMatch: any = await baseMatch.dealMatchHistory(puuid, 0, 19)
  analysisData.value = findTopChamp(rawMatch)
  isLodaing.value = null
}

const writeSumInfo = (sInfo) => {
  cube.games.launchers.events.getInfo(10902).then((info: GameInfo) => {
    const area = TencentRsoPlatformId[<string>info.summoner_info?.platform_id] || <string>info.summoner_info?.platform_id
    // 设置召唤师信息
    const sumInfo: sumInfoTypes = {
      name: sInfo.summonerInfo.name,
      summonerId: sInfo.summonerInfo.currentId,
      platformId: area
    }
    localStorage.setItem('sumInfo', JSON.stringify(sumInfo))
    recordStore.init();
    recordStore = null
  })
}

const onClientLaunch = () => {
  const closeMessageOn = cube.windows.message.on('received', async (id) => {
    if (id === 'initHome') {
      let timer = 0
      const interval = setInterval(async () => {
        timer += 1
        if (summonerData.summonerInfo === null) {
          init(true)
        } else {
          clearInterval(interval)
          closeMessageOn()
        }
        if (timer === 8) {
          clearInterval(interval)
          closeMessageOn()
        }
      }, 3000)
    }
  })
}

const openWin = () => {
  cube.windows.obtainDeclaredWindow('queryMatch')
}

</script>

<template>
  <div class="mainContent" v-if="summonerData.summonerInfo">
    <n-card size="small" class="shadow" content-style="padding-bottom: 0;">
      <!--    头像 昵称 等级-->
      <div class="h-14 flex gap-x-2">
        <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                  :src="summonerData.summonerInfo.imgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <n-space class="flex-grow" :size="[0,0]"
                 justify="space-between" vertical>
          <div class="flex justify-between">
            <!--昵称-->
            <n-tag type="success"
                   style="width: 130px;justify-content: center"
                   :bordered="false" round>
              <n-ellipsis style="max-width: 110px" :tooltip="false">
                {{ summonerData.summonerInfo.name }}
              </n-ellipsis>
            </n-tag>
            <n-button class="px-2" :bordered="false"
                      @click="openWin"
                      type="success" size="small" round>
              查询战绩
            </n-button>
          </div>
          <div class="flex justify-between gap-x-3">
            <n-tag type="warning" size="small" round :bordered="false">
              {{ summonerData.summonerInfo.lv }}
            </n-tag>
            <div class="flex-grow "
                 style="background-color: rgba(240, 160, 32, 0.15);
               padding: 0 7px; color: #f0a020; font-size: 12px;
               border-radius: 12px">
              <div class="flex justify-between items-center">
                <n-progress
                  type="line"
                  :show-indicator="false"
                  :percentage="summonerData.summonerInfo.xp"
                  status="warning"
                  processing
                  style="width:100px;margin-top: 1.2px;"
                  :height="10"
                />
                <div style="padding-top: 2px;">{{ summonerData.summonerInfo.xp }} %</div>
              </div>
            </div>

          </div>
        </n-space>
      </div>
      <!--    头像 昵称 等级-->

      <n-divider dashed style="margin: 14px 0 2px 0"/>

      <!--段位 荣誉等级-->
      <n-list>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32 justify-center" type="success" :bordered="false" :round="false">
              单双 {{ summonerData.rankList[0] }}
            </n-tag>
            <n-tag class="w-32 justify-center" type="success" :bordered="false" :round="false">
              灵活 {{ summonerData.rankList[1] }}
            </n-tag>
          </n-space>
        </n-list-item>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32 justify-center" type="warning" :bordered="false" :round="false">
              云顶 {{ summonerData.rankList[2] }}
            </n-tag>
            <n-tag class="w-32 justify-center" type="warning" :bordered="false" :round="false">
              {{ summonerData.rankList[3] }}
            </n-tag>
          </n-space>
        </n-list-item>
      </n-list>
      <!--段位 荣誉等级-->
    </n-card>
    <n-card size="small" content-style="padding-top:10px"
            class="shadow" style="height: 402px;">
      <!--      战绩分析加载页面-->
      <div class="pl-0.5" v-if="isLodaing">
        <n-steps size="small" vertical>
          <n-step
            style="margin: 4px 0"
            title="近期使用英雄">
            <template #icon>
              <n-icon>
                <Crown/>
              </n-icon>
            </template>
            <n-space justify="space-between">
              <n-space vertical :size="[0,2.5]" v-for="i in 3">
                <n-skeleton height="55px" width="55px" :sharp="false"/>
                <n-tag :bordered="false" size="small" class="text-sm"
                       style="width: 55px;justify-content: center">
                </n-tag>
              </n-space>
            </n-space>
          </n-step>
          <n-step
            style="margin: 0"
            title="近期活跃程度">
            <template #icon>
              <n-icon>
                <Planet/>
              </n-icon>
            </template>
            <n-space justify="space-between">
              <n-space vertical v-for="i in 6">
                <n-skeleton height="55px" circle/>
                <n-tag :bordered="false" round
                       style="width: 55px;padding: 0 12px">
                  <text class="absolute" style="top: 7px;right: 5px"></text>
                </n-tag>
              </n-space>
            </n-space>
          </n-step>
          <n-step
            status="wait"
            title="节选最近 20场对局分析">
            <template #icon>
              <n-icon>
                <Bulb/>
              </n-icon>
            </template>
          </n-step>
        </n-steps>
      </div>
      <!--      战绩分析加载页面-->
      <match-analysis
        v-else-if="analysisData && !isLodaing"
        :analysis-data="analysisData"
        :page-type="0"
        :is-home="true"
      />
      <n-result
        class="mt-20"
        v-else status="404" title="404 资源不存在" description="数据获取失败，或者战绩数量太少">
      </n-result>
    </n-card>
  </div>
  <div class="mainContent" v-else>
    <start-game/>
  </div>
</template>

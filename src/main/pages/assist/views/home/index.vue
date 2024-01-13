<script setup lang="ts">
import {
  NCard, NAvatar, NProgress, NSpace, NTag, NDrawer, NDrawerContent, NDivider,
  NList, NListItem, NScrollbar, useMessage, NTabs, NTabPane, NRate, NIcon
} from 'naive-ui'
import {getCurrentSummonerAllInfo} from "@/main/utils/getHomeData";
import {onMounted, reactive, ref, Ref} from "vue";
import {SummonerData} from "@/lcu/types/SummonerTypes";

const summonerData:SummonerData = reactive({
  summonerInfo: null,
  rankList: null,
  honorData: null,
  champLevel: null,
  statstones: null
})

onMounted(async () => {
  const summonerAllInfo = await getCurrentSummonerAllInfo()
  Object.keys(summonerData).forEach((key) => {
    summonerData[key as keyof typeof summonerData] = summonerAllInfo?.[key as keyof typeof summonerAllInfo] ?? null
  })
  console.log(summonerData)
})

</script>

<template>
  <n-card v-if = summonerData.summonerInfo size="small" class="mt-4 boxShadow">
    <div class="h-14 flex gap-x-2">
      <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/5430.png"
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <n-space class="flex-grow" :size="[0,0]"
               justify="space-between" vertical>
        <div class="flex justify-between">
          <!--昵称-->
          <n-tag type="success" :bordered="false" :round="true">
            {{summonerData.summonerInfo.name}}
          </n-tag>
          <n-tag class="cursor-pointer" type="success" :bordered="false" :round="true">
            <p>查询战绩</p>
          </n-tag>
        </div>
        <div class="flex justify-between gap-x-5">
          <n-tag type="warning" size="small" round :bordered="false">
            Lv2
          </n-tag>
          <n-tag class="flex-grow" type="warning" size="small" :bordered="false" :round="true">
            <n-space justify="space-between">
              <n-progress
                type="line"
                :show-indicator="false"
                :percentage="12"
                status="warning"
                processing
                style="width:100px;margin-top: 1.2px;"
                :height="10"
              />
              <div>99 %</div>
            </n-space>
          </n-tag>
        </div>
      </n-space>
    </div>

    <n-divider/>

    <div>
      123
    </div>
  </n-card>
</template>

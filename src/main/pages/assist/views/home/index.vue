<script setup lang="ts">
import {
  NCard, NAvatar, NProgress, NSpace, NTag, NDrawer, NDrawerContent, NDivider,
  NList, NListItem, NScrollbar, useMessage, NTabs, NTabPane, NRate, NIcon
} from 'naive-ui'
import {getCurrentSummonerAllInfo} from "@/main/utils/getHomeData";
import {onMounted, reactive, ref, Ref} from "vue";
import {SummonerData} from "@/lcu/types/SummonerTypes";
import versionInfo from "./versionInfo.vue";

const summonerData:SummonerData = reactive({
  summonerInfo: null,
  rankList: null,
  honorData: null,
  champLevel: null,
  statstones: null
})

const listData:Ref<{label:string,value:string}[]> = ref([])

onMounted(async () => {
  const summonerAllInfo = await getCurrentSummonerAllInfo()
  Object.keys(summonerData).forEach((key) => {
    summonerData[key as keyof typeof summonerData] = summonerAllInfo?.[key as keyof typeof summonerAllInfo] ?? null
  })

  const honorStr = summonerData.honorData ? summonerData.honorData[0] + summonerData.honorData[1] :''
  listData.value = [
    { label: `单双 ${summonerData.rankList?.[0]}`, value: `灵活 ${summonerData.rankList?.[1]}` },
    { label: `云顶 ${summonerData.rankList?.[2]}`, value: honorStr }
  ]
})

</script>

<template>
  <n-card v-if = summonerData.summonerInfo size="small" class="mt-4 shadow">
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
          <n-tag type="success" :bordered="false" :round="true">
            {{summonerData.summonerInfo.name}}
          </n-tag>
          <n-tag class="cursor-pointer" type="success" :bordered="false" :round="true">
            查询战绩
          </n-tag>
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

    <n-divider dashed style="margin: 24px 0 12px 0"/>

    <!--段位 荣誉等级-->
    <n-list v-if="listData.length!==0">
      <n-list-item v-for="(item, index) in listData" :key="index">
        <n-space justify="space-between">
          <n-tag class="w-32 justify-center" :type="index ===0 ? 'success':'warning'" :bordered="false" :round="false">
            {{ item.label }}
          </n-tag>
          <n-tag class="w-32 justify-center" :type="index ===0 ? 'success':'warning'" :bordered="false" :round="false">
            {{ item.value }}
          </n-tag>
        </n-space>
      </n-list-item>
    </n-list>
    <!--段位 荣誉等级-->
  </n-card>

  <version-info/>
</template>

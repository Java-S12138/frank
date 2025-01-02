<script setup lang="ts">
import {
  NAvatar,
  NCard,
  NProgress,
  NSpace,
  NTag,
  NList,
  NListItem,
  NEllipsis,
  NStep,
  NIcon,
  NSteps,
  NSkeleton
} from "naive-ui"
import {summonerInfo} from "@/lcu/types/SummonerTypes";
import MatchAnalysis from "@/main/views/teammate/matchAnalysis.vue";
import useMatchStore from "@/queryMatch/store";
import {Crown, Planet} from "@vicons/tabler";

const {sumInfo} = defineProps<{
  sumInfo:{ info:summonerInfo, rank:string[] }
}>()

const matchStore = useMatchStore()

const rankRender = [
  {title:'单双排位',value:sumInfo.rank[0]},
  {title:'灵活排位',value:sumInfo.rank[1]},
  {title:'云顶排位',value:sumInfo.rank[2]}
]
</script>

<template>
  <div class="flex flex-col" style="width: 254px;">
    <n-card size="small" class="shadow" content-style="padding-bottom:0">
      <!--    头像 昵称 等级-->
      <div class="h-14 flex gap-x-2">
        <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                  :src="sumInfo.info.imgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <n-space class="flex-grow" :size="[0,0]"
                 justify="space-between" vertical>
          <div class="flex justify-between">
            <!--昵称-->
            <n-tag class="w-full justify-center" style="width: 164px;" type="success" :bordered="false" round>
              <n-ellipsis style="max-width: 140px">
                {{ sumInfo.info.name }}
              </n-ellipsis>
            </n-tag>
          </div>

          <div class="flex justify-between gap-x-3">
            <div class="flex-grow"
                 style="background-color: rgba(240, 160, 32, 0.15);
               padding: 0 7px; color: #f0a020; font-size: 12px;
               border-radius: 12px">
              <div class="flex justify-between items-center gap-x-2">
                <n-progress
                  type="line"
                  :show-indicator="false"
                  :percentage="sumInfo.info.xp"
                  status="warning"
                  processing

                  :height="10"
                />
                <div style="padding-top: 1px;">
                  <n-ellipsis style="max-width: 40px">
                    {{ sumInfo.info.lv }}
                  </n-ellipsis>
                </div>
              </div>
            </div>
          </div>
        </n-space>
      </div>
      <!--    头像 昵称 等级-->

      <!--    排位数据-->
      <n-list style="margin-top: 21px;">
        <n-list-item v-for="rank in rankRender">
          <div class="flex justify-between">
            <n-tag style="width: 76px;justify-content: center;" type="success" :bordered="false" :round="false" >
              {{ rank.title }}
            </n-tag>

            <n-tag style="width: 76px;justify-content: center;" type="warning" :bordered="false" :round="false">
              {{ rank.value }}
            </n-tag>
          </div>
        </n-list-item>
      </n-list>
      <!--    排位数据-->
    </n-card>
    <n-card size="small" class="mt-3 shadow" content-style="padding-top:10px" style="height: 337px">
      <!--      战绩分析加载页面-->
      <div class="pl-0.5" v-if="matchStore.matchLoading">
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
                <n-skeleton height="45px" width="45px" :sharp="false"/>
                <n-tag :bordered="false" size="small" class="text-sm"
                       style="width: 45px;justify-content: center">
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
            <n-space class="pt-1" :size="[12,16]" justify="space-between">
              <n-space :size="[0,3]" vertical v-for="i in 6">
                <n-skeleton height="45px" circle/>
                <n-tag :bordered="false" round
                       style="width: 45px;height:22px;padding: 0 12px">
                  <text class="absolute" style="top: 7px;right: 5px"></text>
                </n-tag>
              </n-space>
            </n-space>
          </n-step>
        </n-steps>
      </div>
      <!--      战绩分析加载页面-->
      <match-analysis
        v-if="matchStore.analysisData && !matchStore.matchLoading"
        :analysis-data="matchStore.analysisData"
        :pageType="1"
      />
    </n-card>
  </div>
</template>



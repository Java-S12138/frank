<script setup lang="ts">
import {NCard, NAvatar, NTag, NEllipsis} from "naive-ui"
import {RecentSumInfo} from "@/recentMatch/utils/queryTypes";

const {sumList,queueId} = defineProps<{ sumList: RecentSumInfo[], queueId:number}>()


</script>

<template>
  <n-card size="small" class="mt-4 shadow" style="width: 615px;" content-style="padding:8px">
    <div class="flex gap-x-2">
      <div
        v-for="summoner in sumList"
        class="flex flex-col gap-y-2" style="width: 113px;">
        <!--    头像-->
        <div class="flex justify-between relative">
          <n-avatar
            :size="55"
            :src="summoner.championUrl"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          />
          <n-tag type="info" :bordered="false"
                 style="width: 50px; height: 55px;justify-content: center">
            <!--            如果是单双或者组排-->
            <div v-if="queueId===440||queueId===420" class="flex justify-center flex-col gap-y-4">
              <text :class="queueId===420?'':'text-blue-300'">{{ summoner.rankPoint[0] }}</text>
              <text :class="queueId===440?'':'text-blue-300'">{{ summoner.rankPoint[1] }}</text>
            </div>
            <div class="flex justify-center flex-col gap-y-4" v-else>
              <text>{{ summoner.rankPoint[0] }}</text>
              <text>{{ summoner.rankPoint[1] }}</text>
            </div>
          </n-tag>
          <div v-if="summoner.summonerState!=='Z'"
               class="absolute text-xs bg-red-500 text-neutral-50 rounded-sm box-border"
               style="bottom: 0;left: 39px;width: 16px;height: 16px;text-align: center">
            {{ summoner.summonerState }}
          </div>
        </div>

        <n-tag size="small" :bordered="false" type="info"
               style="height: 30px;width: 100%;
               justify-content: center;margin: 4px 0;">
          <n-ellipsis :tooltip="false" style="max-width: 85px;">
            {{ summoner.summonerName }}
          </n-ellipsis>
          <div class="absolute text-xs bg-blue-500 text-neutral-50 rounded-full"
               style="bottom: 22px;right: 0;width: 16px;height: 16px;text-align: center">
            {{ summoner.teamParticipantId }}
          </div>
        </n-tag>

        <!--      战绩-->
        <div class="flex flex-col gap-y-2">
          <div v-for="match in summoner.matchList" class="flex w-full gap-x-2">
            <n-avatar
              :size="30"
              :src="match.champImg"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            />
            <n-tag :type="match.isWin?'success':'error'" :bordered="false"
                   style="width: 80px;height: 30px;justify-content: center;">
              {{ match.kill }}-{{match.deaths}}-{{match.assists}}
            </n-tag>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

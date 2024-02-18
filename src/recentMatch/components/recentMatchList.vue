<script setup lang="ts">
import {NCard, NAvatar, NTag, NEllipsis,NResult} from "naive-ui"
import {RecentSumInfo} from "@/recentMatch/utils/queryTypes";

const {sumList,queueId,isFri} = defineProps<{ sumList: RecentSumInfo[], queueId:number,isFri:boolean}>()
const emits = defineEmits(['showDetail'])
const showDetail = (gameId:number,summonerId:number,isFri:boolean) => {
  emits('showDetail',gameId,summonerId,isFri)
}
const teamColors = ['#2080f0','#f0a020','#18a058','#d03050','#9333ea']
const subscribe = localStorage.getItem('subscribe')

</script>

<template>
  <n-card size="small" class="shadow" style="width: 615px;height: 499px;margin-top: 6px;" content-style="padding:8px">
    <div class="flex gap-x-2" v-if="sumList.length!==0">
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
          <div v-if="summoner.summonerState !=='Z'"
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
          <div
            v-if="subscribe"
            class="absolute text-xs text-neutral-50 rounded-full"
            style="bottom: 22px;right: 0;width: 16px;height: 16px;text-align: center"
            :style="'background-color:'+teamColors[(summoner.teamParticipantId -1)%5]">
            {{ summoner.teamParticipantId }}
          </div>
        </n-tag>

        <!--      战绩-->
        <div class="flex flex-col gap-y-2">
          <div v-for="match in subscribe?summoner.matchList:summoner.matchList.slice(5)"
               @click="showDetail(match.gameId,summoner.summonerId,isFri)"
               class="flex w-full gap-x-2">
            <n-avatar
              :size="30"
              :src="match.champImg"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            />
            <n-tag :type="match.isWin?'success':'error'" :bordered="false"
                   style="width: 80px;height: 30px;justify-content: center;">
              {{ match.kills }}-{{match.deaths}}-{{match.assists}}
            </n-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-full  justify-center items-center" v-else>
      <n-result status="418" title="数据加载中" description="一切尽在不言中">
      </n-result>
    </div>
  </n-card>
</template>

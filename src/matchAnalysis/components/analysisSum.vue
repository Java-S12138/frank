<script setup lang="ts">
import {NAvatar, NEllipsis, NProgress, NTag} from "naive-ui";
import {SummonerAnaInfo} from "@/matchAnalysis/utils/MatchAnalysisTypes";
import {champDict} from "@/resources/champList";
import {posRate} from "@/resources/otherList";

const {
  name,
  summonerId,
  imgUrl,
  rankList,
  matchList,
  isThumbUp,
  matchAnalysis,
  showType,
  queueId,
  openDetailDrawer
} = defineProps<SummonerAnaInfo>()

// 找出最近使用最多英雄角色
const roles = matchAnalysis.roleCountMap
const usedRole = Object.keys(roles).reduce((a, b) => roles[a] > roles[b] ? a : b)

const colorGreen = {
  color: 'rgba(24,160,88,0.4)',
  bgColor: 'rgba(24,160,88,0.1)'
}
const colorBlue = {
  color: '#2080F0',
  bgColor: 'rgba(32,128,240,0.2)'
}


const getImg = (champId: number) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`
}
const getPercent = (num: number, total: number) => {
  return Math.round((num / total) * 100)
}

const hanleTag = (showId: number) => {
  return (queueId === 420 || queueId === 440) ? (queueId !== showId) : false
}

</script>

<template>
  <div class="flex flex-col gap-y-2" style="width: 160px;">
    <div class="flex gap-x-2">
      <n-avatar
        :size="50"
        round
        :src="imgUrl"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <div
        class="flex flex-grow flex-col justify-between">
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="info" :disabled="hanleTag(420)">{{ rankList[0] }}
        </n-tag>
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="info" :disabled="hanleTag(440)">{{ rankList[1] }}
        </n-tag>
      </div>

    </div>
    <n-tag
      round class="w-full justify-center text-sm"
      :bordered="false" :type="isThumbUp?'success':'error'">
      <n-ellipsis :tooltip="false" style="max-width: 130px">
        {{ name }}
      </n-ellipsis>
    </n-tag>

    <div class="flex flex-col gap-y-2 mt-2">
      <!--    最近战绩列表-->
      <div v-if="showType"
           v-for="match in matchList"
           @click="openDetailDrawer(match.gameId,Number(summonerId))"
           class="flex items-center gap-x-2">
        <n-avatar
          :size="32"
          :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+match.champImgUrl"
          src="https://game.gtimg.cn/images/lol/act/img/champion/Taliyah.png"
        />
        <n-tag :bordered="false" style="height: 32px;cursor:default !important;"
               :disabled="true" size="small">
          {{ match.gameModel }}
        </n-tag>
        <n-tag
          class="justify-center flex-grow h-8"
          :bordered="false" :type="match.isWin?'success':'error'"
        >
          {{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
        </n-tag>
      </div>
      <!--    数据分析列表-->
      <div v-else>
        <div class="flex justify-between">
          <div class="flex flex-col gap-y-2"
               v-for="champ in matchAnalysis.top3Champions">
            <n-avatar
              :size="48"
              :src="getImg(champ.champId)"
            />
            <n-tag :bordered="false" size="small" class="text-sm"
                   style="width: 48px;justify-content: center">
              {{ champ.count }}/{{ matchAnalysis.totalChampions }}
            </n-tag>
          </div>
        </div>
        <div class="mt-4 flex flex-row gap-y-3 flex-wrap justify-between">
          <div class="flex gap-y-2 flex-col" v-for="(pos,index) in posRate">
            <n-progress
              style="width: 55px;font-size: 14px"
              type="circle"
              :stroke-width="10"
              :percentage="getPercent(matchAnalysis.roleCountMap[pos.key],matchAnalysis.totalChampions)"
              :color="pos.key!==usedRole ? colorGreen.color:colorBlue.color"
              :rail-color="pos.key!==usedRole ? colorGreen.bgColor:colorBlue.bgColor"
            />
            <n-tag :bordered="false" round
                   style="width: 55px;padding: 0 12px">
              <template #avatar>
                <n-avatar
                  style="background-color:#ffffff00;"
                  :src="pos.imgUrl"
                />
              </template>
              <text class="absolute" style="top: 7px;right: 5px">{{ pos.name }}</text>
            </n-tag>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {NAvatar, NSpace, NTag, NSteps, NStep, NIcon, NProgress, NResult} from "naive-ui";
import {Crown,Planet,Bulb} from "@vicons/tabler"
import {RencentDataAnalysisTypes} from "./teammateTypes";
import {champDict} from "@/resources/champList";
import {posRate} from "@/resources/otherList";

const {analysisData} = defineProps<{analysisData:RencentDataAnalysisTypes}>()
// 找出最近使用最多英雄角色
const roles = analysisData.roleCountMap
const usedRole = Object.keys(roles).reduce((a, b) => roles[a] > roles[b] ? a : b)

const colorGreen = {
  color:'#18A058',
  bgColor:'rgba(24,160,88,0.2)'
}
const colorBlue = {
  color:'#2080F0',
  bgColor:'rgba(32,128,240,0.2)'
}


const getImg = (champId:number) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`
}

const getPercent = (num:number,total:number) => {
  return Math.round((num/total)*100)
}


</script>

<template>
  <div class="pl-0.5">
    <n-steps  size="small" vertical>
      <n-step
        style="margin: 4px 0"
        title="近期使用英雄">
        <template #icon>
          <n-icon>
            <Crown/>
          </n-icon>
        </template>
        <n-space justify="space-between">
          <n-space vertical v-for="champ in analysisData.top3Champions">
            <n-avatar
              style="display: block"
              :size="55"
              :src="getImg(champ.champId)"
            />
            <n-tag :bordered="false" size="small" class="text-sm"
                   style="width: 55px;justify-content: center">
              {{ champ.count }}/{{analysisData.totalChampions}}
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
          <n-space vertical v-for="(pos,index) in posRate">
            <n-progress
              style="width: 55px;font-size: 14px"
              type="circle"
              :stroke-width="10"
              :percentage="getPercent(analysisData.roleCountMap[pos.key],analysisData.totalChampions)"
              :color="usedRole!==pos.key ? colorGreen.color:colorBlue.color"
              :rail-color="usedRole!==pos.key ? colorGreen.bgColor:colorBlue.bgColor"
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
</template>


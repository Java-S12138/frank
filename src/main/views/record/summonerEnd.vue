<script setup lang="ts">
import {NPopover, NTag, NIcon, NButton, NEllipsis, NAvatar, NSkeleton} from "naive-ui"
import {ThumbDown, ThumbUp} from "@vicons/tabler";
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {getIconImg} from "@/queryMatch/utils/tools";


const {isTeamOne,sumList, addBlackList} = defineProps<{
  isTeamOne:boolean,
  sumList: SummonerDetailInfo[],
  addBlackList: (isHater: boolean, requiredInfo: { name: string; sumId: string }) => void
}>()

const searchMatch = (summonerId: number) => {
  localStorage.setItem('queSumMatch', String(summonerId))
  cube.windows.obtainDeclaredWindow('queryMatch')
}

const handleAdd = (isHater:boolean,summonerInfo:SummonerDetailInfo) => {
  const requiredInfo = {
    name:summonerInfo.name,
    sumId:String(summonerInfo.accountId),
    teamType:isTeamOne
  }
  addBlackList(isHater,requiredInfo)
}
</script>

<template>
  <div class="flex flex-col gap-y-5 mb-5">
    <div v-for="summoner in sumList" class="flex justify-between">
      <div class="flex gap-x-3 ">
        <n-avatar
          @click="searchMatch(summoner.accountId)"
          :bordered="false"
          :size="50"
          :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+summoner.champImgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display: block;cursor: pointer"
        />
        <div class="flex flex-col justify-between">
          <div class="flex gap-x-3">
            <n-tag :bordered="false" class="justify-center"
                   type="info" style="width: 36px">
              {{ summoner.score }}
            </n-tag>
            <n-tag
              :bordered="false" class="justify-center"
              style="width: 127px" type="default">
              <n-ellipsis style="max-width: 112px">
                {{ summoner.name }}
              </n-ellipsis>
            </n-tag>
          </div>
          <div class="flex items-center" style="column-gap: 6px"
               v-if="summoner.iconList.length!==0 || summoner.isMvp">
            <n-popover v-for="icon in getIconImg(summoner.iconList,summoner.isMvp,summoner.isWin).slice(0,8)"
                       :show-arrow="false"
                       style="padding: 2px 6px;font-size: 13px" trigger="hover">
              <template #trigger>
                <img class="h-3" :src="icon[1]">
              </template>
              <span>{{ icon[0] }}</span>
            </n-popover>
          </div>
          <div class="flex items-center" style="column-gap: 6px" v-else>
            <n-skeleton
              v-for="i in 3"
              :animated="false" height="12px" width="12px" :sharp="false"/>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <n-button
          @click="handleAdd(false,summoner)"
          :bordered="false" secondary :focusable="false"
          size="tiny" type="success">
          <text class="text-ss" style="margin-left: -3px;">点赞</text>
          <template #icon>
            <n-icon :size="15" :component="ThumbUp"/>
          </template>
        </n-button>
        <n-button
          @click="handleAdd(true,summoner)"
          :bordered="false" secondary :focusable="false"
          size="tiny" type="error">
          <text class="text-ss" style="margin-left: -3px;">拉黑</text>
          <template #icon>
            <n-icon :size="15" :component="ThumbDown"/>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

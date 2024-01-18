<script setup lang="ts">
import {NSpace,NScrollbar,NAvatar, NTag, NSkeleton,NLayout, NLayoutSider, NLayoutContent,} from 'naive-ui'
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import SummonerMatchLoad from "@/main/pages/assist/views/teammate/summonerMatchLoad.vue";
import {getItemImgUrl, getspellImgUrl} from "@/lcu/utils";
import {ref} from "vue";

const {matchList} = defineProps<{
  matchList:SimpleMatchTypes[]
}>()

const isLoad = ref(true)
setTimeout(() => {
  if (matchList.length!==0){
    isLoad.value = false
  }
},300)

</script>

<template>
  <n-scrollbar style="max-height: 378px;padding-right: 18px">
    <div v-if="isLoad">
      <summoner-match-load/>
    </div>
    <div v-else>
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="match in matchList" style="height: 50px" has-sider>
          <n-layout-sider width="50"  style="margin-right: 8px;">
            <div>
              <n-avatar
                :size="50"
                :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+match.champImgUrl"
                style="display: block"
              />
              <div class="absolute bottom-0 right-0 flex gap-1">
                <img class="h-4 rounded-sm"  :src="getspellImgUrl(match.spell1Id)">
                <img class="h-4 rounded-sm" :src="getspellImgUrl(match.spell2Id)">
              </div>
            </div>
          </n-layout-sider>
          <n-layout>
            <n-layout-content>
              <div class="flex justify-between">
                <img
                  class="imgItem"
                  v-for="item in match.itemList"
                  :src='getItemImgUrl(item)'
                >

              </div>
            </n-layout-content >
            <n-layout-content style="margin-top: 7px;">
              <div class="flex justify-between">
                <n-tag style="width: 58px;justify-content: center;height: 18px"
                       :bordered="false" size="tiny"
                       :type="match.isWin ? 'success' : 'error'">
                  {{ match.kills }}-{{match.deaths}}-{{match.assists}}
                </n-tag>
                <n-tag style="width: 90px;justify-content: center;height: 18px"
                       :bordered="false" size="tiny" type="default">{{ match.gameModel }}/{{ match.lane }}•{{match.level}}
                </n-tag>
                <n-tag style="width: 58px;justify-content: center;height: 18px"
                       size="tiny" :bordered="false" type="default">{{match.matchTime}}</n-tag>
              </div>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
  </n-scrollbar>
</template>

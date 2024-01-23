<script setup lang="ts">
import {NSpace, NScrollbar, NAvatar, NTag, NSkeleton, NLayout, NLayoutSider, NLayoutContent, NResult,} from 'naive-ui'
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import SummonerMatchLoad from "@/main/views/teammate/summonerMatchLoad.vue";
import {getItemImgUrl, getspellImgUrl} from "@/lcu/utils";
import {ref} from "vue";

const {matchList} = defineProps<{
  matchList:SimpleMatchTypes[]|undefined
}>()

const isLoad = ref(0)
setTimeout(() => {
  if (matchList!==undefined){
    isLoad.value = 1 // 数据正确
  }else {
    isLoad.value = 2 // 数据错误
  }
},500)

</script>

<template>
  <n-scrollbar style="max-height: 378px;padding-right: 18px">
    <div v-if="isLoad===0">
      <summoner-match-load/>
    </div>
    <div v-else-if="isLoad===1">
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="match in matchList" style="height: 50px" has-sider>
          <n-layout-sider width="50"  style="margin-right: 8px;">
            <div>
              <n-avatar
                lazy
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
                <n-avatar
                  lazy
                  class="imgItem"
                  v-for="item in match.itemList"
                  :src='getItemImgUrl(item)'
                />
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
    <n-result v-else style="margin-top: 65px"
              status="418" title="数据获取失败" description="或许 这与英雄联盟服务器有关">
      <template #footer>
        页面显示数据已替换为召唤师绝活英雄
      </template>
    </n-result>
  </n-scrollbar>
</template>

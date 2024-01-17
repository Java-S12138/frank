<script setup lang="ts">
import {NSpace,NScrollbar,NAvatar, NTag, NSkeleton,NLayout, NLayoutSider, NLayoutContent,} from 'naive-ui'
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";

const {matchList} = defineProps<{
  matchList:SimpleMatchTypes[]
}>()
</script>

<template>
  <n-scrollbar v-if="matchList !== null" style="max-height: 378px;padding-right: 18px">
    <div v-if="matchList?.length === 0">
      <n-skeleton text :repeat="2" />
      <n-skeleton text style="width: 60%" />
    </div>
    <div v-else>
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="match in matchList" style="height: 50px" has-sider>
          <n-layout-sider width="50"  style="margin-right: 8px;">
            <div>
              <n-avatar
                :size="50"
                :src="match.champImgUrl"
                style="display: block"
              />
              <div class="absolute bottom-0 right-0 flex gap-1">
                <img class="h-4 rounded-sm"  :src="match.spell1Id">
                <img class="h-4 rounded-sm" :src="match.spell2Id">
              </div>
            </div>
          </n-layout-sider>
          <n-layout>
            <n-layout-content>
              <div class="flex justify-between">
                <img class="imgItem" :src="match.item0">
                <img class="imgItem" :src="match.item1">
                <img class="imgItem" :src="match.item2">
                <img class="imgItem" :src="match.item3">
                <img class="imgItem" :src="match.item4">
                <img class="imgItem" :src="match.item5">
                <img class="imgItem" :src="match.item6">
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

<script setup lang="ts">
import {NAvatar,NCard, NProgress, NSpace, NTag,NList,NListItem,NEllipsis} from "naive-ui"
import SummonerMasteryChamp from "@/main/common/summonerMasteryChamp.vue";
import {summonerInfo} from "@/lcu/types/SummonerTypes";

const {sumInfo} = defineProps<{
  sumInfo:{ info:summonerInfo, rank:string[] }
}>()

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
            <n-tag class="w-full justify-center" type="success" :bordered="false" round>
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
    <n-card size="small" class="mt-3 shadow" content-style="padding-top:10px">
      <summoner-mastery-champ :max-h="313" puuid="c9b0fd7a-59cd-54c6-bf7e-6b5241ebee84" :exist-champ-list="undefined"/>
    </n-card>
  </div>
</template>



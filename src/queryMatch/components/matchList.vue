<script setup lang="ts">
import {ref} from "vue";
import {NAvatar,NSpace, NTag,NList,NListItem,NIcon} from "naive-ui";
import {ThumbUp,ThumbDown} from "@vicons/tabler"
import useMatchStore from "@/queryMatch/store";

const curMatch = ref(0)
const matchStore = useMatchStore()

const renderMatch = (index:number,gameId:number) => {
  curMatch.value = index
  matchStore.getMatchDetail(gameId)
}

</script>

<template>
  <n-list>
    <n-list-item style="width: 186px" v-for="(match,index) in matchStore.matchList">
      <n-space @click="renderMatch(index,match.gameId)">
        <n-avatar
          :bordered="false"
          :size="42"
          :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+match.champImgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display:block"
        />
        <n-space class="relative h-full" vertical :size="[0,0]">
          <div class="flex gap-x-3">
            <n-tag size="small" type="success" v-if="match.isWin"
                   style="width: 74px;justify-content: center"
                   :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
            </n-tag>
            <n-tag size="small" type="error" v-else
                   style="width: 74px;justify-content: center"
                   :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
            </n-tag>

            <n-tag size="small"
                   :type="index === curMatch?'warning':'default'"
                   style="width: 46px;justify-content: center"
                   :class="index === curMatch?'':' text-gray-400'"
                   :bordered="false">
              <div class="flex justify-center gap-x-1">
                <NIcon size="15">
                  <ThumbUp v-if="match.kda>=9"/>
                  <ThumbDown v-else/>
                </NIcon>
                {{match.kda}}
              </div>
            </n-tag>
          </div>
         <div class="flex justify-between absolute w-full" style="bottom: -2px">
           <div class="flex justify-between" style="width: 74px;">
             <text class="text-xs text-gray-400">{{ match.matchTime }}</text>
             <text class="text-xs text-gray-400">{{ match.startTime }}</text>
           </div>
           <text class="text-xs text-gray-400">{{ match.gameModel }}</text>

         </div>
        </n-space>
      </n-space>
    </n-list-item>
  </n-list>
</template>

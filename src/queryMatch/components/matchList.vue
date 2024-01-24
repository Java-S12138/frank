<script setup lang="ts">
import {inject, Ref, ref, watch} from "vue";
import {NAvatar,NSpace, NTag,NList,NListItem} from "naive-ui"
import {SimpleMatchDetailsTypes} from "@/lcu/types/queryMatchLcuTypes";

const curMatch = ref(0)
const matchList = inject('matchList') as Ref<SimpleMatchDetailsTypes[]>

const stopWatching = watch(matchList,() => {
  emits('changeDetail', matchList.value[0].gameId)
  stopWatching()
})

// 声明子组件的事件
const emits = defineEmits(['changeDetail'])
// 子组件的逻辑
const sendToParent = (index:number,gamdId:number) => {
  curMatch.value = index
  emits('changeDetail', gamdId)
}

</script>

<template>
  <n-list>
    <n-list-item style="width: 186px" v-for="(match,index) in matchList">
      <n-space @click="sendToParent(index,match.gameId)">
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
                   style="width: 70px;justify-content: center"
                   :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
            </n-tag>
            <n-tag size="small" type="error" v-else
                   style="width: 70px;justify-content: center"
                   :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
            </n-tag>

            <n-tag size="small"
                   :type="index === curMatch?'warning':'default'"
                   style="width: 50px;justify-content: center"
                   :class="index === curMatch?'':' text-gray-400'"
                   :bordered="false">{{ match.matchTime }}
            </n-tag>
          </div>
         <div class="flex justify-between absolute w-full" style="bottom: -2px">
           <text class="text-xs text-gray-400">{{ match.gameModel }}</text>
           <text class="text-xs text-gray-400">{{ match.startTime }}</text>
         </div>
        </n-space>
      </n-space>
    </n-list-item>
  </n-list>
</template>

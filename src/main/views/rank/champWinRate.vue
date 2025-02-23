<script setup lang="ts">
import {NAvatar,NScrollbar,NSkeleton,NListItem, NSpace, NTag} from "naive-ui";

const {champList,preselectChamp} = defineProps<{
  champList:[string,string,number,number,number][],
  preselectChamp:(champId:number) => void,
}>()


</script>

<template>
  <div>
    <n-list-item v-if="champList.length===0"
                 v-for="count in 5">
      <n-space>
        <n-skeleton height="48px" circle/>
        <n-space vertical size="medium">
          <n-skeleton height="20px" width="216px" round/>
          <n-skeleton height="20px" width="216px" round/>
        </n-space>
      </n-space>
    </n-list-item>
    <n-scrollbar id="image-scroll-container" style="max-height: 350px;padding-right: 12px" v-else>
      <n-list-item v-for="champRes in champList">
        <div class="flex gap-x-3">
          <n-avatar
            class="cursor-pointer hover:rounded"
            style="transition: border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);"
            round
            :bordered="false"
            :size="48"
            @click="preselectChamp(champRes[3])"
            :src=champRes[1]
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          />
          <div class="flex-grow flex flex-col  justify-between">
            <n-tag type="info" :bordered="false" size="small" round
                   style="justify-content: center;height: 20px;">
              {{ champRes[0] }}
            </n-tag>
            <n-tag :type="champRes[2] >= 50 ? 'success' :'error'" :bordered="false" size="small"
                   style="justify-content: center;height: 20px;" round>
              场数: {{ champRes[4] }}&emsp;胜率: {{ champRes[2] }}%
            </n-tag>
          </div>
        </div>
      </n-list-item>
    </n-scrollbar>
  </div>
</template>


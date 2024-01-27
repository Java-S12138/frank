<script setup lang="ts">
import {NDrawerContent, NAvatar, NSpace, NTag, NList, NListItem, NButton} from "naive-ui"
import {SumDetail} from "@/queryMatch/utils/MatchDetail";
import {getspellImgUrl,gerNoneImg} from "@/lcu/utils";

const {personalDetails,searchSummoner} = defineProps<{
  personalDetails: SumDetail,searchSummoner:() => void }>()

const getImgUrl = (rune: number) => {
  if (rune===0){
   return  gerNoneImg()
  }
  return new URL(`/src/assets/runes/${rune}.png`, import.meta.url).href
}


</script>

<template>
  <n-drawer-content body-content-style="padding:12px">
    <div class="flex w-full gap-x-3">
      <!--              头像-->
      <n-avatar
        :bordered="false"
        :size="50"
        :src="personalDetails.champImgUrl"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        style="display: block"
      />
      <div class="flex-grow flex flex-col" style="gap: 6px 0">
        <n-tag class="w-full justify-center text-ss"
               :bordered="false" type="success" size="small">{{ personalDetails.name }}
        </n-tag>
        <div class="flex justify-between">
          <span class="flex gap-x-2">
            <img class="itemClassSecond" :src="getspellImgUrl(personalDetails.spell1Id)">
            <img class="itemClassSecond" :src="getspellImgUrl(personalDetails.spell2Id)">
          </span>
          <span class="flex gap-x-2">
           <n-tag :bordered="false" size="small" type="warning">Lv {{ personalDetails.champLevel }}</n-tag>
          <n-tag :bordered="false" size="small" type="warning">{{ personalDetails.kda }}</n-tag>
          </span>
        </div>
      </div>
    </div>

    <!--    符文-->
    <div class="flex justify-between border-dashed my-3
     border border-gray-300  rounded p-1">
      <img v-for="runeIndex in personalDetails.runesList"
           :src="getImgUrl(runeIndex)" alt="" class="runImg">
    </div>

    <!--    排位数据-->
    <n-list>
      <n-list-item>
        <n-space justify="space-between">
          <n-tag :bordered="false" type="success">
            单双排位
          </n-tag>
          <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
            {{ personalDetails.rankData[0] }}
          </n-tag>
        </n-space>
      </n-list-item>
      <n-list-item>
        <n-space justify="space-between">
          <n-tag :bordered="false" type="success">
            灵活排位
          </n-tag>
          <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
            {{ personalDetails.rankData[1] }}
          </n-tag>
        </n-space>
      </n-list-item>
      <n-list-item>
        <n-space justify="space-between">
          <n-tag :bordered="false" type="success">
            云顶排位
          </n-tag>
          <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
            {{ personalDetails.rankData[2] }}
          </n-tag>
        </n-space>
      </n-list-item>
    </n-list>
    <!--    其他数据-->
    <n-list style="margin-top: 7px;" :show-divider="false">
      <n-list-item
        style="padding: 5px 0;"
        v-for="item in personalDetails.listItemData">
        <n-space justify="space-between">
          <n-tag
            class="text-gray-400"
            style="width: 70px;justify-content: center;font-size: 13px"
            :bordered="false" size="small">
            {{ item[0] }}
          </n-tag>
          <n-tag
            class="text-gray-400"
            style="width: 70px;justify-content: center;font-size: 13px"
            :bordered="false" size="small">
            {{ item[1] }}
          </n-tag>
        </n-space>
      </n-list-item>
      </n-list>
    <n-button type="success" :bordered="false" @click="searchSummoner"
              style="margin-top: 8px;width: 100%;">
      查询详细战绩
    </n-button>
  </n-drawer-content>
</template>

<style scoped>

.runImg {
  width: 30px;
}

.itemClassSecond {
  width: 22px;
  height: 22px;
  border-radius: 3px;
}
</style>

<script setup lang="ts">
import {NSpace, NTag,NPopover} from "naive-ui"
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {getspellImgUrl} from "@/lcu/utils";
import MatchSumDetails from "@/queryMatch/common/matchSumDetails.vue";
import {getIconImg} from "@/queryMatch/utils/tools";

const {summonerList,summonerId,isOne} = defineProps<{
  summonerList:SummonerDetailInfo[],
  summonerId:number,
  isOne:boolean,
  showMode:string
}>()

const emits = defineEmits(['openDrawer'])

const showSumDetails = (summonerId:number) => {
  emits('openDrawer',summonerId)
}

</script>

<template>
  <div class="flex flex-col justify-between" style="margin-top: 17px;">
    <!--    每一个英雄数据-->
    <n-space
      v-for="summoner in summonerList" vertical>
      <match-sum-details
        @click="showSumDetails(summoner.accountId)"
        :summoner="summoner" :summoner-id="summonerId" :is-one="isOne"/>
      <!--        数据显示-->
      <div class='progressDivP'>
        <n-tag style="height: 26px;width: 50px;justify-content: center"
               size="small" :bordered="false" class="text-gray-400">
          {{ summoner[showMode] }}
        </n-tag>
        <div class="flex-grow flex flex-col h-full justify-between">
          <div class='matchIconImgDiv'>
            <!--        召唤师技能等-->
            <img class="itemClassSecond" :src="getspellImgUrl(summoner.spell1Id)">
            <img class="itemClassSecond" style="margin-right: 5px;" :src="getspellImgUrl(summoner.spell2Id)">
            <n-popover v-for="icon in getIconImg(summoner.iconList,summoner.isMvp,summoner.isWin)"
                       :show-arrow="false"
                       style="padding: 2px 6px;font-size: 13px" trigger="hover">
              <template #trigger>
                <img class="matchIconImg" :src="icon[1]">
              </template>
              <span>{{ icon[0] }}</span>
            </n-popover>
          </div>
          <p :style="'width:'+summoner.showDataDict[showMode]"
             :key="showMode"
             :class="isOne?'scale-in-hor-left champAvatarColorRed progressP':'scale-in-hor-left champAvatarColorBlue progressP'"
          />
        </div>
      </div>
    </n-space>
  </div>
</template>

<style scoped>
.matchIconImg {
  height: 12px;
  padding-bottom: 1px;
}
.matchIconImgDiv {
  display: flex;
  align-items: flex-end;
  gap: 5px;
}

.progressP {
  height: 6px;
  border-radius: 1px;
  margin: 0px;
}

.progressDivP {
  width: 290px;
  height: 26px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 12px;
  align-items: flex-end;
  position: relative;
}

.itemClassSecond {
  width: 15px;
  height: 15px;
  border-radius: 2.5px;
}

</style>

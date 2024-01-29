<script setup lang="ts">
import {NAvatar,NSpace, NTag,NPopover,NEllipsis} from "naive-ui"
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {getItemImgUrl, getspellImgUrl} from "@/lcu/utils";
import MatchSumDetails from "@/queryMatch/common/matchSumDetails.vue";

const {summonerList,summonerId,isOne} = defineProps<{
  summonerList:SummonerDetailInfo[],
  summonerId:number,
  isOne:boolean,
  showMode:string
}>()

const emits = defineEmits(['openDrawer'])

const showSumDetails = (isOne,index) => {
  emits('openDrawer',isOne,index)
}

const iconDict:{ [key: string]: string } = {
  'assists':'助攻最多, 从不K头',
  'firstBlood':'第一滴血, 这局我Carry',
  'fiveKills':'五杀! Superexcellent',
  'fourKills':'四杀! Excellent',
  'god':'超神! So Easy',
  'goldEarned':'获得最多金币 So Rich',
  'kills':'击杀最多 是在下无敌啦',
  'mvp':'Most Valuable Player',
  'svp':'Super Valuable Player',
  'threeKills':'三杀! Good Job',
  'totalDamageDealtToChampions':'输出最高伤害 人称小代',
  'totalDamageTaken':'承伤最多的坦克爸爸',
  'totalMinionsKilled':'补刀最多 随便玩玩啦',
  'turretKills':'拆塔最多, 人在塔拆',
  'visionScore':'视野得分最高'
}

// 获取iconImgUrl
const getIconEle = (key:string) => {
  const imgUrl = new URL(`/src/assets/matchImage/${key}.png`, import.meta.url).href
  return [iconDict[key],imgUrl]
}
const getIconImg = (iconList:string[],isMvp:boolean,isWin:boolean) => {
  const iconImgEle = iconList.map((icon) => {
    return getIconEle(icon)
  })
  if (isMvp && isWin){
    iconImgEle.unshift(getIconEle('mvp'))
  }else if (isMvp && !isWin){
    iconImgEle.unshift(getIconEle('svp'))
  }
  return iconImgEle
}


</script>

<template>
  <div class="flex flex-col justify-between" style="margin-top: 17px;">
    <!--    每一个英雄数据-->
    <n-space
      v-for="(summoner,index) in summonerList" vertical>
      <match-sum-details
        @click="showSumDetails(isOne,index)"
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
  border-radius: 2px;
  margin: 0px;
}

.progressDivP {
  width: 290px;
  height: 26px;
  border-radius: 2px;
  background-color: #ffffff;
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

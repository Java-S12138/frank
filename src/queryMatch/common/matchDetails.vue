<script setup lang="ts">
import {NAvatar,NSpace, NTag,NPopover} from "naive-ui"
import {SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {getItemImgUrl, getspellImgUrl} from "@/lcu/utils";

const {summonerList,curSumId,isOne} = defineProps<{
  summonerList:SummonerDetailInfo[],
  curSumId:number,
  isOne:boolean
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
  <div class="flex flex-col gap-y-5" style="margin-top: 17px;">
    <!--    每一个英雄数据-->
    <n-space
      v-for="(summoner,index) in summonerList"
      style="width: 290px;" vertical>
      <div class="flex gap-x-3">
        <!--      头像-->
        <div class="relative" @click="showSumDetails(isOne,index)">
          <n-avatar
            :bordered="false"
            :size="50"
            :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+summoner.champImgUrl"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display: block;"
          />
          <div :class="isOne?'champAvatarColorRed champLevel':'champAvatarColorBlue champLevel'">
            {{ summoner.champLevel }}
          </div>
        </div>

        <div class='grow flex flex-col justify-between'>
          <!--        装备-->
          <div class='flex justify-between'>
            <img class="itemClass" v-for="url in summoner.items" :src="getItemImgUrl(url)">
          </div>

          <div class="flex justify-between">
            <!--          召唤师昵称-->
            <text size="tiny" class="nameDiv"
                  :class="curSumId===summoner.accountId?'nameDiv currentSumColor slideSum':'nameDiv text-gray-400'"
                  :bordered="false">
              {{ summoner.name }}
            </text>
            <!--        kda-->
            <n-tag class="kdaDiv" size="tiny" :bordered="false">
              {{ summoner.kills }}-{{ summoner.deaths }}-{{ summoner.assists }}
            </n-tag>
          </div>
        </div>

      </div>
      <!--        数据显示-->
      <div class='progressDivP'>
        <n-tag style="height: 26px;width: 50px;justify-content: center"
               size="small" :bordered="false" class="text-gray-400">
          {{ summoner.totalDamageDealtToChampions }}
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
          <p :style="'width:'+summoner.showDataDict.totalDamageDealtToChampions"
             :class="isOne?'scale-in-hor-left champAvatarColorRed progressP':'scale-in-hor-left champAvatarColorBlue progressP'"
          />
        </div>
      </div>
    </n-space>

  </div>
</template>

<style scoped>
.currentSumColor {
  color: #f0a020;
}
.nameDiv {
  font-size: 13px;
  line-height: 16px;
}
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
  width: 288px;
  height: 26px;
  border-radius: 2px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  gap: 14px;
  align-items: flex-end;
  position: relative;
}

.champAvatarColorRed {
  background-color: #ff6666;
}

.champAvatarColorBlue {
  background-color: #66B3FF;
}

.champLevel {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 15px;
  height: 15px;
  bottom: 0px;
  right: 0px;
  color: #ffffff;
  border-radius: 2px;
}

.itemClass {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}

.itemClassSecond {
  width: 15px;
  height: 15px;
  border-radius: 2.5px;
}

.kdaDiv {
  width: 59px;
  justify-content: center;
}
</style>

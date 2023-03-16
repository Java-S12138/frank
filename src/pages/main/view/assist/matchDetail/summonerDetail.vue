<template>
  <n-drawer-content body-content-style="padding:16px">
    <n-space :size="[12,0]" justify="center">
      <n-avatar
        :size="55"
        round
        :src="getImgUrl(summonerIcon)"
        style="display: block"
      />
      <n-space vertical :size="[0,5]">
        <n-tag round class="titleTag" :bordered="false" type="success">{{ summonerName }}</n-tag>
        <n-tag round class="titleTag" :bordered="false" type="info">{{summonerLevel}}</n-tag>
      </n-space>
    </n-space>

    <n-tabs style="margin-top: 4px" justify-content="space-between" type="line" animated>
      <n-tab-pane name="最近战绩" tab="最近战绩">
        <summoner-match :summoner-puuid="summonerPuuid" :summoner-id="summonerId"/>
      </n-tab-pane>
      <n-tab-pane name="对局战绩" tab="对局战绩">
        Hey Jude
      </n-tab-pane>
      <n-tab-pane name="绝活英雄" tab="绝活英雄">
        七里香
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>

<script setup lang="ts">
import {NDrawerContent,NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
import SummonerMatch from "./summonerMatch.vue";

import {PropType} from "vue";

const props = defineProps({
  summonerName:{
    type:String as PropType<string>
  },
  summonerLevel:{
    type:String as PropType<string>
  },
  summonerId:{
    type:String as PropType<string>
  },
  summonerPuuid:{
    type:String as PropType<string>
  },
  summonerIcon:{
    type:Number as PropType<number>
  }
})

const getImgUrl = (profileIconId:number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}
</script>

<style scoped>
.titleTag {
  height: 25px;
  font-size: 13px;
  width: 191px;
  justify-content: center;
}
</style>

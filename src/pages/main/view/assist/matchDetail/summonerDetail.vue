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
        <n-tag class="titleTag" :bordered="false" type="success">{{ summonerName }}</n-tag>
        <n-tag class="titleTag" :bordered="false" type="info">{{summonerLevel}}</n-tag>
      </n-space>
    </n-space>

    <n-tabs style="margin-top: 4px" justify-content="space-between" type="line">
      <n-tab-pane name="最近战绩" tab="最近战绩">
        <summoner-match :match-list="matchList"/>
      </n-tab-pane>
      <n-tab-pane name="绝活英雄" tab="绝活英雄">
        <summoner-super-champ :summoner-id="props.summonerId"/>
      </n-tab-pane>
      <n-tab-pane name="温馨提示" tab="温馨提示">
        <summoner-tips/>
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>

<script setup lang="ts">
import {NDrawerContent,NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
import SummonerMatch from "./summonerMatch.vue";
import SummonerSuperChamp from "./summonerSuperChamp.vue";
import SummonerTips from "./summonerTips.vue";
import {onMounted, PropType, ref, Ref} from "vue";
import {queryMatch} from "../../../lcu/assistMatchDetailLcu";
import {simpleMatchTypes} from "../../../lcu/types/queryMatchLcuTypes";

const props = defineProps({
  summonerName:{
    default:'',
    type:String as PropType<string>
  },
  summonerLevel:{
    default:'',
    type:String as PropType<string>
  },
  summonerId:{
    default:'',
    type:String as PropType<string>
  },
  summonerPuuid:{
    default:'',
    type:String as PropType<string>
  },
  summonerIcon:{
    type:Number as PropType<number>
  }
})
const matchList:Ref<simpleMatchTypes[] | null> = ref([])

onMounted(() => {
  queryMatch(props.summonerPuuid as string).then((value) => {
    setTimeout(() => {
      if (value===null){
        return
      }
      matchList.value = value
    },300)
  })
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

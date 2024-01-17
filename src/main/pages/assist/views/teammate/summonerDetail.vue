<script setup lang="ts">
import {NDrawerContent,NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
import {SummonerDetailTypes} from "./teammateTypes";
import SummonerMatch from "./summonerMatch.vue";
import SummonerSuperChamp from "./summonerSuperChamp.vue";

const {name,summonerId,puuid,rank,profileIconId,matchList} = defineProps<SummonerDetailTypes>()

const getImgUrl = (profileIconId: number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}

</script>

<template>
  <n-drawer-content body-content-style="padding:12px 22px 10px">
    <div class="flex gap-x-3" style="height: 50px;">
      <n-avatar
        :size="50"
        round
        :src="getImgUrl(profileIconId)"
      />
      <n-space class="flex-grow" vertical :size="[0,6]">
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="success">{{ name }}</n-tag>
        <n-tag class="w-full justify-center text-sm" round size="small"
               :bordered="false" type="info">{{rank}}</n-tag>
      </n-space>
    </div>

    <n-tabs style="margin-top: 6px" type="line" animated >
      <n-tab-pane name="最近战绩" tab="最近战绩" display-directive="show">
         <summoner-match :match-list="matchList"/>
      </n-tab-pane>
      <n-tab-pane name="绝活英雄" tab="绝活英雄" display-directive="show">
        <summoner-super-champ :puuid="puuid"/>
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>



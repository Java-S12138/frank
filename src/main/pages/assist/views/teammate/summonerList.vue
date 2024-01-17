<script setup lang="ts">
import {NAvatar, NDrawer, NList, NListItem, NSpace, NTag} from "naive-ui";
import LoadMatch from "./loadMatch.vue";
import {SummonerInfoList,SummonerDetailTypes} from "./teammateTypes";
import {Ref, ref} from "vue";
import SummonerDetail from "./summonerDetail.vue";
import {MatchList} from "@/lcu/types/queryMatchLcuTypes";

const {friSummonerInfo} = defineProps<{
  friSummonerInfo:SummonerInfoList[]
}>()
const drawerActive = ref(false)
const currentSumInfo:Ref<SummonerDetailTypes> = ref({
  name:'',
  summonerId:'',
  puuid:'',
  rank:'',
  profileIconId:0,
  matchList:[]
})

const getCurrentSum = (name:string,summonerId:string,puuid:string,
                       rank:string,profileIconId:number,matchList:MatchList[]) => {
  // todo isSubscribe
  // if (isSubscribe ==='f'){
  //   message.warning('查看更多信息 需要订阅服务')
  //   return
  // }
  currentSumInfo.value = {
    name,summonerId,puuid,rank,profileIconId,matchList
  }
  drawerActive.value = true
}

const getImgUrl = (profileIconId:number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}
</script>

<template>
  <n-list>
    <n-list-item
      v-for="summoner in friSummonerInfo" style="padding: 8px 0 10px 0">
      <div class="flex gap-x-3" style="height: 50px;">
        <n-avatar
          :size="50" round
          class="cursor-pointer"
          :src="getImgUrl(summoner.profileIconId)"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          @click="getCurrentSum(summoner.name,summoner.summonerId,summoner.puuid,summoner.match.rank,summoner.profileIconId,summoner.match.recentMatchList)"
        />
        <div class="flex-grow">
          <n-space vertical :size="[0,6]">
            <n-tag round size="small" class="w-full justify-center text-sm" :bordered="false" type="success">{{ summoner.name }}</n-tag>
            <n-tag round size="small" class="w-full justify-center text-sm" :bordered="false" type="info">
              {{ summoner.match.rank }}</n-tag>
          </n-space>
        </div>
      </div>
      <load-match v-if="summoner.match.recentMatchList.length === 0"/>
      <n-space v-else style="margin-top: 10px;height: 32px;" justify="space-between">
        <n-avatar
          v-for="img in summoner.match.recentMatchList.slice(0, 6)"
          :size="32"
          :src="img.champImgUrl"
        />
      </n-space>
    </n-list-item>
  </n-list>

  <n-drawer style="border-top-left-radius: 12px;border-top-right-radius: 12px"
            v-model:show="drawerActive" :height="512" placement="bottom">
    <summoner-detail
      :profile-icon-id="currentSumInfo.profileIconId"
      :match-list="currentSumInfo.matchList"
      :name="currentSumInfo.name"
      :rank="currentSumInfo.rank"
      :summoner-id="currentSumInfo.summonerId"
      :puuid="currentSumInfo.puuid"/>
  </n-drawer>
</template>

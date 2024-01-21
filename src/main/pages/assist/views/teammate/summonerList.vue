<script setup lang="ts">
import {NAvatar, NDrawer, NList, NListItem, NSpace, NTag} from "naive-ui";
import LoadMatch from "./loadMatch.vue";
import {CurrentSumInfoTypes,} from "./teammateTypes";
import {Ref, ref} from "vue";
import SummonerDetail from "./summonerDetail.vue";
import {useTeammateStore} from "@/main/store/useTeammate";

const teammateStore = useTeammateStore()
const drawerActive = ref(false)
const currentSumInfo:Ref<CurrentSumInfoTypes> = ref({
  name:'',
  puuid:'',
  rank:'',
  index:0,
  profileIconId:0
})

const getCurrentSum = (name:string,puuid:string,rank:string,profileIconId:number,index:number) => {
  // todo isSubscribe
  // if (isSubscribe ==='f'){
  //   message.warning('查看更多信息 需要订阅服务')
  //   return
  // }
  drawerActive.value = true
  currentSumInfo.value = {
    name,puuid,rank,profileIconId,index
  } as CurrentSumInfoTypes
}


const clearInfo = () => {
  currentSumInfo.value ={
    name:'',
    puuid:'',
    rank:'',
    index:0,
    profileIconId:0
  }
}

const getImgUrl = (profileIconId:number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}
</script>

<template>
  <n-list>
    <n-list-item
      v-for="(summoner,index) in teammateStore.summonerInfo" style="padding: 8px 0 10px 0">
      <div class="flex gap-x-3" style="height: 50px;">
        <n-avatar
          :size="50" round
          class="cursor-pointer"
          :src="getImgUrl(summoner.profileIconId)"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          @click="getCurrentSum(summoner.name,summoner.puuid,summoner.rank,summoner.profileIconId,index)"
        />
        <div class="flex-grow">
          <n-space vertical :size="[0,6]">
            <n-tag round size="small" class="w-full justify-center text-sm" :bordered="false" type="success">{{ summoner.name }}</n-tag>
            <n-tag round size="small" class="w-full justify-center text-sm" :bordered="false" type="info">
              {{ summoner.rank }}</n-tag>
          </n-space>
        </div>
      </div>
      <div v-if="!teammateStore.isLcuErr">
        <load-match v-if="teammateStore.recentMatchList[index] === undefined"/>
        <n-space
          v-else style="margin-top: 10px;height: 32px;" :size="[17.2,0]">
          <n-avatar
            v-for="img in teammateStore.recentMatchList[index].slice(0, 6)"
            :size="32"
            :src="'https://game.gtimg.cn/images/lol/act/img/champion/'+img.champImgUrl"
          />
        </n-space>
      </div>
      <n-space
        v-else style="margin-top: 10px;height: 32px;" :size="[17.2,0]">
        <n-avatar
          v-for="img in teammateStore.masteryChampList[index].slice(0, 6)"
          :size="32"
          :src="img[0]"
        />
      </n-space>
    </n-list-item>
  </n-list>

  <n-drawer
    class="rounded-t-xl" v-model:show="drawerActive"
    height="512" placement="bottom"
    @after-leave="clearInfo">
    <summoner-detail
      :profile-icon-id="currentSumInfo.profileIconId"
      :name="currentSumInfo.name"
      :rank="currentSumInfo.rank"
      :puuid="currentSumInfo.puuid"
      :index="currentSumInfo.index"
    />
  </n-drawer>
</template>

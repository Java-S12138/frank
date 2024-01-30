<script setup lang="ts">
import {NAvatar, NDrawer, NList, NListItem, NSpace, NTag} from "naive-ui";
import LoadMatch from "./loadMatch.vue";
import {CurrentSumInfoTypes, SummonerInfoList,} from "./teammateTypes";
import {Ref, ref, onDeactivated} from "vue";
import SummonerDetail from "./summonerDetail.vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import SummonerKdaName from "@/main/views/teammate/summonerKdaName.vue";

const teammateStore = useTeammateStore()
const drawerActive = ref(false)
const currentSumInfo: Ref<CurrentSumInfoTypes> = ref({
  kda:0,
  name: '',
  puuid: '',
  rank: '',
  index: 0,
  profileIconId: 0
})

const getCurrentSum = (summoner:SummonerInfoList,index: number,kda:number) => {
  // todo isSubscribe
  // if (isSubscribe ==='f'){
  //   message.warning('查看更多信息 需要订阅服务')
  //   return
  // }
  drawerActive.value = true
  currentSumInfo.value = {
    kda:kda,
    name:summoner.name,
    puuid:summoner.puuid,
    rank:summoner.rank,
    index:index,
    profileIconId:summoner.profileIconId,

  } as CurrentSumInfoTypes
}


const clearInfo = () => {
  currentSumInfo.value = {
    kda:0,
    name: '',
    puuid: '',
    rank: '',
    index: 0,
    profileIconId: 0
  }
}

const getImgUrl = (profileIconId: number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}

onDeactivated(() => {
  drawerActive.value = false
})
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
          @click="getCurrentSum(summoner,index,teammateStore.summonerKad[index])"
        />
        <div class="flex-grow">
          <div
            class="flex flex-col justify-between"
            style="height: 50px;"
          >
            <!--            根据KDA计算数据-->
            <summoner-kda-name :name="summoner.name" :kda="teammateStore.summonerKad[index]"/>
            <n-tag round size="small" class="w-full justify-center text-sm" :bordered="false" type="info">
              {{ summoner.rank }}
            </n-tag>
          </div>
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
      :kda="currentSumInfo.kda"
    />
  </n-drawer>
</template>

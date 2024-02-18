<script setup lang="ts">
import LoadMatch from "./loadMatch.vue";
import {Ref, ref, onDeactivated, watch} from "vue";
import SummonerDetail from "./summonerDetail.vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import HaterDetails from "@/main/views/record/haterDetails.vue";
import {CurrentSumInfoTypes, SummonerInfoList,} from "./teammateTypes";
import SummonerKdaName from "@/main/views/teammate/summonerKdaName.vue";
import {NAvatar, NDrawer, NList, NListItem, NSpace, NTag,useMessage} from "naive-ui";
import {BlackItemsTypes} from "@/main/views/record/blackListTypes";

const teammateStore = useTeammateStore()
const drawerActive = ref(false)
const drawerBlackActive = ref(false)
const currentSumInfo: Ref<CurrentSumInfoTypes | null> = ref(null)
const currentHaterInfo: Ref<BlackItemsTypes | null> = ref(null)
const message = useMessage()

watch(teammateStore.blackItems, () => {
  if (teammateStore.blackItems.length !== 0 ){
    currentHaterInfo.value = teammateStore.blackItems[0]
    drawerBlackActive.value = true
  }
})

const getCurrentSum = (summoner: SummonerInfoList, index: number) => {
  currentSumInfo.value = {
    kda: summoner?.kda,
    hater: summoner?.hater,
    name: summoner.name,
    puuid: summoner.puuid,
    rank: summoner.rank,
    index: index,
    imgUrl: summoner.imgUrl,
  } as CurrentSumInfoTypes
  drawerActive.value = true
}

const clearInfo = () => {
  currentSumInfo.value = null
}
const clearBlackInfo = () => {
  currentHaterInfo.value = null
}

const openBlackList = (haterIndex: number) => {
  currentHaterInfo.value = teammateStore.blackItems[haterIndex]
  drawerBlackActive.value = true
}

onDeactivated(() => {
  drawerActive.value = false
  drawerBlackActive.value = false
})
</script>

<template>
  <n-list>
    <n-list-item
      v-for="(summoner,index) in teammateStore.summonerInfo" style="padding: 10px 0">
      <div class="flex gap-x-3" style="height: 50px;">
        <n-avatar
          :size="50" round
          class="cursor-pointer"
          :src="summoner.imgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          @click="getCurrentSum(summoner,index)"
        />
        <div class="flex-grow">
          <div
            class="flex flex-col justify-between"
            style="height: 50px;"
          >
            <!--            根据KDA计算数据-->
            <summoner-kda-name
              :open-drawer="openBlackList"
              :name="summoner.name"
              :hater="summoner?.hater"
              :hater-index="summoner?.haterIndex"
              :kda="summoner.kda"/>
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
    height="518" placement="bottom"
    @after-leave="clearInfo">
    <summoner-detail
      v-if="currentSumInfo"
      :sum-info="currentSumInfo"
      :index="currentSumInfo.index"
    />
  </n-drawer>

  <n-drawer
    v-model:show="drawerBlackActive" class="rounded-t-xl" :auto-focus="false"
    @after-leave="clearBlackInfo" height="264" placement="bottom">
    <hater-details
      v-if="currentHaterInfo"
      :h-content="currentHaterInfo.hContent"
      :h-info="currentHaterInfo.hInfo"
      :is-edit="false"
    />
  </n-drawer>

</template>

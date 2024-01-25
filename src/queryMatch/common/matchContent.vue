<script setup lang="ts">
import MatchConHeader from "./matchConHeader.vue";
import MatchDetails from "./matchDetails.vue";
import MatchDrawer from "@/queryMatch/common/matchDrawer.vue";
import {SumDetail, SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {Ref, ref} from "vue";
import {NDrawer} from "naive-ui"
import {queryRankPoint} from "@/lcu/aboutSummoner";

const emits = defineEmits(['changeSum'])
const {teamOne,teamTwo,headerInfo,summonerId} = defineProps<{
  teamOne: SummonerDetailInfo[],
  teamTwo: SummonerDetailInfo[],
  headerInfo: string[],
  summonerId:number
}>()

const isMatchDra = ref(false)
const curMatchDraData:Ref<null|SumDetail> = ref(null)

const openMatchDra = async (isOne,index) => {
  const summonerInfo:SummonerDetailInfo = isOne ? teamOne[index] : teamTwo[index]
  curMatchDraData.value = await getDrawerData(summonerInfo)
  isMatchDra.value = true
}

const getDrawerData = async (summonerInfo:SummonerDetailInfo):Promise<SumDetail> => {
  const rankList = await queryRankPoint(summonerInfo.puuid)
  const listItemData = [
    ['输出伤害',summonerInfo.totalDamageDealtToChampions],
    ['物理伤害',summonerInfo.physicalDamageDealtToChampions],
    ['魔法伤害',summonerInfo.magicDamageDealtToChampions],
    ['真实伤害',summonerInfo.trueDamageDealtToChampions],
    ['承受伤害',summonerInfo.totalDamageTaken],
    ['击杀野怪',summonerInfo.neutralMinionsKilled],
    ['击杀小兵',summonerInfo.totalMinionsKilled],
    ['获得金钱',summonerInfo.goldEarned],
    ['视野得分',summonerInfo.visionScore],
    ['放置守卫',summonerInfo.wardsPlaced],
  ]
  return {
    name:summonerInfo.name,
    champImgUrl:`https://game.gtimg.cn/images/lol/act/img/champion/${summonerInfo.champImgUrl}`,
    platformId:summonerInfo.platformId,
    kda:`${summonerInfo.kills}-${summonerInfo.deaths}-${summonerInfo.assists}`,
    champLevel: summonerInfo.champLevel,
    listItemData: listItemData,
    rankData: rankList,
    runesList: summonerInfo.runesList,
    spell1Id: summonerInfo.spell1Id,
    spell2Id: summonerInfo.spell2Id,
    summonerId: summonerInfo.accountId
  } as SumDetail
}

const searchSummoner = () => {
  isMatchDra.value = false
  emits('changeSum',curMatchDraData.value?.summonerId)
}
</script>

<template>
  <match-con-header :title-list="headerInfo"/>
  <div class="flex justify-between">
    <match-details
      @open-drawer="openMatchDra"
      :summoner-list="teamOne"
      :cur-sum-id="summonerId"
      :is-one="true"/>
    <match-details
      @open-drawer="openMatchDra"
      :summoner-list="teamTwo"
      :cur-sum-id="summonerId"
      :is-one="false"/>
  </div>
  <n-drawer v-model:show="isMatchDra"
            class="rounded-r-xl"
            @after-leave="curMatchDraData=null"
            :auto-focus="false"
            :width="265" placement="left">
    <match-drawer v-if="curMatchDraData!==null"
                  :search-summoner="searchSummoner"
                  :personal-details="curMatchDraData"/>
  </n-drawer>
</template>


<script setup lang="ts">
import {Ref, ref} from "vue";
import {NDrawer} from "naive-ui"
import MatchDetails from "./matchDetails.vue";
import MatchConHeader from "./matchConHeader.vue";
import {queryRankPoint} from "@/lcu/aboutSummoner";
import MatchDrawer from "@/queryMatch/common/matchDrawer.vue";
import MatchDetailsFighter from "@/queryMatch/common/matchDetailsFighter.vue";
import {SumDetail, SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";

const emits = defineEmits(['changeSum'])
const {teamOne, teamTwo, headerInfo, summonerId, queueId, isGameIn,gameId} = defineProps<{
  teamOne: SummonerDetailInfo[],
  teamTwo: SummonerDetailInfo[],
  headerInfo: string[],
  queueId: number,
  summonerId: number,
  isGameIn: boolean,
  gameId:number
}>()

const rotatedIndex = ref(0)
const isMatchDra = ref(false)
const curMatchDraData: Ref<null | SumDetail> = ref(null)
const titleArr = [['totalDamageDealtToChampions', '输出伤害'], ['totalDamageTaken', '承受伤害'], ['goldEarned', '商店存款'], ['visionScore', '视野得分'], ['totalMinionsKilled', '击杀小兵']]

const changeShowMode = () => {
  rotatedIndex.value = (rotatedIndex.value += 1) % titleArr.length
}

const openMatchDra = async (isOne, index) => {
  if (isGameIn){
    // 如果是游戏里面的窗口显示此页面，不让打开抽屉窗口
    return
  }
  const summonerInfo: SummonerDetailInfo = isOne ? teamOne[index] : teamTwo[index]
  curMatchDraData.value = await getDrawerData(summonerInfo)
  isMatchDra.value = true
}

const getDrawerData = async (summonerInfo: SummonerDetailInfo): Promise<SumDetail> => {
  const rankList = await queryRankPoint(summonerInfo.puuid)
  const listItemData = [
    ['输出伤害', summonerInfo.totalDamageDealtToChampions],
    ['物理伤害', summonerInfo.physicalDamageDealtToChampions],
    ['魔法伤害', summonerInfo.magicDamageDealtToChampions],
    ['真实伤害', summonerInfo.trueDamageDealtToChampions],
    ['承受伤害', summonerInfo.totalDamageTaken],
    ['击杀野怪', summonerInfo.neutralMinionsKilled],
    ['击杀小兵', summonerInfo.totalMinionsKilled],
    ['获得金钱', summonerInfo.goldEarned],
    ['视野得分', summonerInfo.visionScore],
    ['放置守卫', summonerInfo.wardsPlaced],
  ]

  return {
    name: summonerInfo.name,
    champImgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${summonerInfo.champImgUrl}`,
    kda: `${summonerInfo.kills}-${summonerInfo.deaths}-${summonerInfo.assists}`,
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
  emits('changeSum', curMatchDraData.value?.summonerId)
}
</script>

<template>
  <div class="h-full flex flex-col" v-if="queueId!==1700">
    <match-con-header :title="titleArr[rotatedIndex][1]" :title-list="headerInfo" :change-show="changeShowMode"/>
    <div class="flex flex-grow justify-between">
      <match-details
        @open-drawer="openMatchDra"
        :summoner-list="teamOne"
        :summoner-id="summonerId"
        :show-mode="titleArr[rotatedIndex][0]"
        :is-one="true"/>
      <match-details
        @open-drawer="openMatchDra"
        :summoner-list="teamTwo"
        :summoner-id="summonerId"
        :show-mode="titleArr[rotatedIndex][0]"
        :is-one="false"/>
    </div>
  </div>

  <match-details-fighter
    v-else
    :header-info="headerInfo"
    :team-one="teamOne"
    :summoner-id="summonerId"
    @open-drawer="openMatchDra"
  />

  <n-drawer
    v-if="!isGameIn"
    v-model:show="isMatchDra"
    class="rounded-r-xl"
    @after-leave="curMatchDraData=null"
    :auto-focus="false"
    :width="265" placement="left">
    <match-drawer v-if="curMatchDraData!==null"
                  :search-summoner="searchSummoner"
                  :game-id="gameId"
                  :personal-details="curMatchDraData"/>
  </n-drawer>
</template>


<script setup lang="ts">
import {Ref, ref} from "vue";
import Dashboard from "./components/dashboard.vue";
import AnalysisMain from "./components/analysisMain.vue";
import {findTopChamp} from "@/main/views/teammate/utils";
import {SimpleMatchTypes} from "@/lcu/types/queryMatchLcuTypes";
import {SummonerInfoList} from "@/main/views/teammate/teammateTypes";
import {SummonerAnaInfo} from "@/matchAnalysis/utils/MatchAnalysisTypes";

const isShowMatch = ref(true)
const summonerList:Ref<SummonerAnaInfo[]> = ref([])

const changeShowType = () => {
  isShowMatch.value = !isShowMatch.value
}

cube.windows.getWindowByName('main').then((mainWin: any) => {
  cube.windows.message
    .invoke(<number>mainWin.id, 'getTeammate', '')
    .then((res: {
      summonerInfo:SummonerInfoList[],
      cacheMatchList:SimpleMatchTypes[],
      summonerKad:number[]
    }) => {
      init(res.summonerInfo,res.cacheMatchList,res.summonerKad)
    })
})

const init = (summonerInfoList:SummonerInfoList[],cacheMatchList:SimpleMatchTypes[],summonerKadn:number[]) => {
  const resSummoner:SummonerAnaInfo[] = summonerInfoList.map((summoner,index) => {
    const rankList = summoner.rank.split(' • ')
    const isThumbUp = summonerKadn[index] >= 9
    return <SummonerAnaInfo>{
      name: summoner.name,
      summonerId: summoner.summonerId,
      isThumbUp: isThumbUp,
      imgUrl: `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summoner.profileIconId}.png`,
      rankList: rankList,
      matchList: cacheMatchList[summoner.summonerId],
      matchAnalysis:findTopChamp(cacheMatchList[summoner.summonerId])
    }
  })
  summonerList.value = resSummoner
}


</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :show-type="isShowMatch" :change-show-type="changeShowType"/>
    <analysis-main
      :summoner-list="summonerList"
      :show-type="isShowMatch"/>
  </div>
</template>

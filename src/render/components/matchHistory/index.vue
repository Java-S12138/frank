<template>
  <div style="overflow: hidden;">
    <n-space>
      <left-card @summonerId="getSummonerId($event)"></left-card>
      <n-space>
      <bar-k-d-a
                v-if="pageCount==1" class="slide-in-right"></bar-k-d-a>
      <standing :matchData="matchData"
                @changePage="() => {pageCount=1}"
                @toGameDetailsPage="toGameDetailsPage($event)"
                v-else-if="pageCount==2" class="slide-in-right"></standing>
        <gameDetails v-else-if="pageCount==3" class="slide-in-right"
                     @changePageSencond="() => {pageCount=2}"></gameDetails>
      </n-space>
    </n-space>
  </div>
</template>

<script>
import leftCard from "@/render/components/matchHistory/leftCard";
import barKDA from "@/render/components/matchHistory/barKDA";
import standing from "@/render/components/matchHistory/standing";
import gameDetails from "@/render/components/matchHistory/gameDetails";
import {NSpace} from "naive-ui";
import {onBeforeMount,ref} from "vue";
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {getSummonerNickName,queryMatchSummonerInfo} from "@/utils/main/lcu";
import {appConfig} from "@/utils/main/config";
export default {
  name: "index",
  components:{leftCard,barKDA,standing,NSpace,gameDetails},
  setup(){
    let matchData = ref([])
    let pageCount = ref(1)
    const store = useStore()
    const {summonerInfo,echartsData,currentQueryGameId,currentSummonerName,currentTeam,currentEchartData} = storeToRefs(store)
    const credentials = appConfig.get('credentials')

    const getChartsData = (res) => {
      echartsData.value = {name:[],data:[],kdaHistory:[],horse:[]}
      for (const re of res) {
        echartsData.value.name.push(re.name)
        echartsData.value.data.push(re.score)
        echartsData.value.kdaHistory.push(re.kdaHistory)
        echartsData.value.horse.push(re.horse)
      }
      currentEchartData.value = echartsData.value
    }
    onBeforeMount(async () => {
      const res =  await getSummonerNickName(credentials)
      currentTeam.value = 1
      summonerInfo.value = []
      summonerInfo.value = res
      console.log(summonerInfo.value)
      getChartsData(summonerInfo.value)
    })

    const getSummonerId = async (summonerData) => {
      pageCount.value = 2
      currentSummonerName.value = summonerData.name
      const res = await queryMatchSummonerInfo(credentials,summonerData.summonerId)
      matchData.value = res
    }

    const toGameDetailsPage = (gameId) => {
      pageCount.value =3
      currentQueryGameId.value = gameId
    }

    return{
      pageCount,matchData,
      getSummonerId,toGameDetailsPage
    }
  }
}
</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
</style>

<script setup lang="ts">
import {ref, Ref} from "vue";
import QuerySummoner from "@/recentMatch/utils/querySummoner";
import Dashboard from "@/recentMatch/components/dashboard.vue";
import RecentMatchList from "@/recentMatch/components/recentMatchList.vue";
import {RecentAllSumInfo, RecentSumInfo} from "@/recentMatch/utils/queryTypes";
import QueryMatch from "@/recentMatch/utils/queryMatch";

const querySummoner = new QuerySummoner()
const queryMatch = new QueryMatch()

const friendList:Ref<RecentSumInfo[]> = ref([])
const enemyList:Ref<RecentSumInfo[]> = ref([])
const queueId:Ref<undefined|number> = ref(undefined)
const winCount = ref({friend:[0,0],enemy:[0,0]})

querySummoner.fromLcuQuery().then( async (allSumInfo:RecentAllSumInfo) => {
  if (allSumInfo!==null){
    queueId.value = allSumInfo.queueId
    getCompleteSumInfo(allSumInfo.friendList,allSumInfo.queueId,true)
    getCompleteSumInfo(allSumInfo.enemyList,allSumInfo.queueId,false)
    console.log(allSumInfo)
  }
})

const getCompleteSumInfo  = async (sumInfos:RecentSumInfo[],queueId:number,isFri:boolean) => {
  for (const summoner of sumInfos) {
    // 根据已获取的召唤师puuid获取每一个召唤师的战绩数据
    const resultList = await queryMatch.queryMatchHistory(summoner.puuid, queueId, summoner.summonerState)
    summoner.matchList = resultList[0]
    // 判断是否为小代
    if (resultList[2]) {
      summoner.summonerState = 'S'
    }
    // 判断是否为友方或敌方，分别写入不同的数据
    const targetList = isFri ? friendList.value : enemyList.value
    const countList = isFri ? winCount.value.friend : winCount.value.enemy

    countList[0] += resultList[1]
    countList[1] += resultList[0].length

    targetList.push(summoner)
  }

}
</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard :win-count="winCount"/>
    <div v-if="queueId" class="flex justify-between">
      <recent-match-list :sum-list="friendList" :queue-id="queueId"/>
      <recent-match-list :sum-list="enemyList" :queue-id="queueId"/>
    </div>
  </div>
</template>

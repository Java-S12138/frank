<template>
  <div class="mainDiv">
    <dashboard @changeChampImg="changeChampImg"/>
    <div class="matchs">
      <match :matchList="isTeamOne===true?friendList:enemyList"
             :is-team-one="true" ref="teamOne"></match>
      <match :matchList="isTeamOne===false?friendList:enemyList"
             :is-team-one="false" ref="teamTwo"></match>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "./dashboard.vue"
import Match from "./match.vue"
import {recentMatch} from "../../lcu/recentMatchLcu"
import {onMounted, ref} from "vue";

const friendList = ref([])
const enemyList = ref([])
const isTeamOne = ref(true)
const teamOne = ref(false)
const teamTwo = ref(false)

onMounted(async () => {
  const RecentMatch: any = new recentMatch()
  const matchList = await RecentMatch.queryAllSummonerInfo()
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  isTeamOne.value = matchList.isTeamOne
})

const changeChampImg = (e:Boolean) => {
  // @ts-ignore
  teamOne.value.isShowChamp = e;teamTwo.value.isShowChamp = e
}
</script>

<style scoped>
.matchs {
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-between;
  margin: 0px 12px 12px 12px;
}
</style>

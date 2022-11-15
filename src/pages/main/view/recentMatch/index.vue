<template>
  <div class="mainDiv" v-if="!isPageNull">
    <dashboard @changeChampImg="changeChampImg"/>
    <div class="matchs">
      <match :matchList="isTeamOne===true?friendList:enemyList"
             :is-team-one="true" ref="teamOne"></match>
      <match :matchList="isTeamOne===false?friendList:enemyList"
             :is-team-one="false" ref="teamTwo"></match>
    </div>
  </div>
  <div v-else>
    <null-page/>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "./dashboard.vue"
import Match from "./match.vue"
import NullPage from "../components/nullPage.vue"
import {recentMatch} from "../../lcu/recentMatchLcu"
import {onMounted, ref} from "vue"

const friendList = ref([])
const enemyList = ref([])
const isTeamOne = ref(true)
const teamOne = ref(false)
const teamTwo = ref(false)
const isPageNull = ref(false)

onMounted(async () => {
  const RecentMatch: any = new recentMatch()
  const matchList = await RecentMatch.queryAllSummonerInfo()
  if (matchList.friendList.length === 0){
    isPageNull.value = true
  }
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  isTeamOne.value = matchList.isTeamOne
  cube.windows.getWindowByName('background').then((win) => {
    cube.windows.message.send(win.id,'initDone','')
  })
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

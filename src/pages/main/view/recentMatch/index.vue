<template>
  <div class="mainDiv">
    <dashboard/>
    <div class="matchs">
      <match :matchList="isTeamOne===true?friendList:enemyList" :is-team-one="true"></match>
      <match :matchList="isTeamOne===false?friendList:enemyList" :is-team-one="false"></match>
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

onMounted(async () => {
  const RecentMatch: any = new recentMatch()
  const matchList = await RecentMatch.queryAllSummonerInfo()
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  isTeamOne.value = matchList.isTeamOne
})


</script>

<style scoped>
.matchs {
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-between;
  margin: 0px 12px 12px 12px;
}
</style>

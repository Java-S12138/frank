<template>
  <div class="mainDiv" v-if="!isPageNull">
    <dashboard/>
    <div class="matchs">
      <match :matchList="isTeamOne===true?friendList:enemyList"
             :is-team-one="true"></match>
      <match :matchList="isTeamOne===false?friendList:enemyList"
             :is-team-one="false"></match>
    </div>
    <div class="winStat">
      <span class="winCount">我方胜利次数 {{ friendTeamList[0] }}/{{ friendTeamList[1] }} 次</span>
      <span class="winCount">敌方胜利次数 {{ enemyTeamTwoList[0] }}/{{ enemyTeamTwoList[1] }} 次</span>
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
const isPageNull = ref(false)
const friendTeamList = ref([0,0])
const enemyTeamTwoList = ref([0,0])

onMounted(async () => {
  const RecentMatch: any = new recentMatch()
  const matchList = await RecentMatch.queryAllSummonerInfo()
  if (matchList.friendList.length === 0){
    isPageNull.value = true
  }
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  isTeamOne.value = matchList.isTeamOne
  matchList.isTeamOne === true ? (friendTeamList.value = matchList.teamOneList,enemyTeamTwoList.value = matchList.teamTwoList) :
    (enemyTeamTwoList.value = matchList.teamOneList,friendTeamList.value = matchList.teamTwoList)
  cube.windows.getWindowByName('background').then((win) => {
    cube.windows.message.send(win.id,'initDone','')
  })
})
</script>

<style scoped>
.matchs {
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-between;
  margin: 0px 12px 12px 12px;
  position: relative;
}
.winStat {
  position: absolute;
  right: 30px;
  top: 24px;
}
.winCount {
  color: #9AA4AF;
  margin-right: 15px
}
</style>

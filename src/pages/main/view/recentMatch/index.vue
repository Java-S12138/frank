<template>
  <div class="mainDiv" v-if="!isPageNull">
    <dashboard/>
    <div class="matchs">
      <match :matchList="friendList"></match>
      <match :matchList="enemyList"
             :blackList="blackList"
             @openDrawer="openDrawer"
      ></match>
    </div>
    <div class="winStat">
      <span class="winCount">我方胜利次数 {{ friendTeamList[0] }}/{{ friendTeamList[1] }} 次</span>
      <span class="winCount">敌方胜利次数 {{ enemyTeamTwoList[0] }}/{{ enemyTeamTwoList[1] }} 次</span>
    </div>

    <n-drawer v-model:show="blacklistActice"
              :width="336" :placement="'right'">
      <n-drawer-content>
        <div v-for="detialsJson in detialsJsonList" style="margin-bottom: 20px">
          <n-space justify="space-between" style="width: 100%;">
            <n-tag size="large"
                   :bordered="false"
                   type="error" >{{detialsNickname}}</n-tag>
            <n-tag type="info" :bordered="false"
                   size="large">{{formatDate(detialsJson.UpdatedAt)}}</n-tag>

          </n-space>
          <div class="draContent">
            {{detialsJson.content}}
          </div>
          <n-space style="width: 100%;" justify="space-between">
            <n-tag type="error" :bordered="false">{{detialsJson.tag}}
            </n-tag>
            <n-popover trigger="hover" :show-arrow="false" placement="left">
              <template #trigger>
                <n-tag  :bordered="false"
                        type="info">{{detialsJson.playerSumName}}</n-tag>
              </template>
              <p>当前数据由此用户提供</p>
            </n-popover>

          </n-space>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
  <div v-else>
    <null-page/>
  </div>

</template>

<script setup lang="ts">
import {NSpace,NPopover,NTag,NDrawer,NDrawerContent} from 'naive-ui'
import Dashboard from "./dashboard.vue"
import Match from "./match.vue"
import NullPage from "../components/nullPage.vue"
import {recentMatch} from "../../lcu/recentMatchLcu"
import {onMounted,ref} from "vue"
import {blacklistServe} from "../../utils/request";

const friendList = ref([])
const enemyList = ref([])
const isPageNull = ref(true)
const friendTeamList = ref([0,0])
const enemyTeamTwoList = ref([0,0])
const blacklistActice = ref(false)
const blacklistDict:any = ref({})
const blackList:any = ref([])
const detialsNickname =ref('')
const detialsJsonList:any = ref([])


onMounted(async () => {
  const RecentMatch = new recentMatch()
  const matchList = await RecentMatch.queryAllSummonerInfo()
  if (matchList.friendList.length !== 0){
    isPageNull.value = false
  }else {
    return
  }
  checkBlacklist(matchList.enemyList)
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  matchList.isTeamOne === true ? (friendTeamList.value = matchList.teamOneList,enemyTeamTwoList.value = matchList.teamTwoList) :
    (enemyTeamTwoList.value = <[number,number]>matchList.teamOneList, friendTeamList.value = <[number,number]> matchList.teamTwoList)
  cube.windows.getWindowByName('background').then((win) => {
    cube.windows.message.send(win.id,'initDone','')
  })
})

const checkBlacklist = async (enemyList:[]) => {
  const areaSetting = JSON.parse(<string>(localStorage.getItem('config'))).currentArea
  const enemySummonerList = enemyList.reduce((res:any,item:any) => {
    return res.concat([
      item.summonerId
    ])
  },[])

  const res = await  blacklistServe({
    url:'/hater/findHaterBySumId',
    data:{'sumIdList':enemySummonerList,'area':areaSetting},
    method:'POST'
  })
  if (res.data.code !== 0){
    return
  }else {
    let init = true
    for (const re of res.data.data) {
      blacklistDict.value[re.sumId] = []
      for (const reElement of re.blacklist) {
        if (reElement.isShow){
          blackList.value.push(re.sumId)
          blacklistDict.value[re.sumId].push(reElement)
          if (init){
            blacklistActice.value = true
            detialsJsonList.value = blacklistDict.value[re.sumId]
            detialsNickname.value = re.nickName
            init=false
          }
        }
      }
    }
  }
}

const openDrawer = (summonerId:string,summonerName:string) => {
  detialsNickname.value = summonerName
  blacklistActice.value=true
  detialsJsonList.value = blacklistDict.value[summonerId]
}
const formatDate = (dateStr:string) => {
  return dateStr.split('T')[0]
}
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
.draContent {
  margin: 15px 0px;
  color: #9AA4AF;
  font-size: 13px;
}
</style>

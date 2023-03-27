<template>
  <div class="mainDiv" v-if="!isPageNull">
    <dashboard :is-in="isIn"/>
    <div class="matchs">
      <match :matchList="friendList"
             :win-count="friendTeamList"
             :game-type="gameType"
             :is-left = "true"
             @open-match-drawer="openMatchDrawer"
             @done-render = "renderRightMatch"
      ></match>
      <match :matchList="enemyList"
             :win-count="enemyTeamTwoList"
             :game-type="gameType"
             :is-left = "false"
             :blackList="blackList"
             ref="rightMatch"
             @openDrawer="openDrawer"
             @open-match-drawer="openMatchDrawer"
      ></match>
    </div>
    <div class="winStat">
      <span class="winCount">友方胜利次数 {{ friendTeamList[0] }}/{{ friendTeamList[1] }} 次</span>
      <span class="winCount">敌方胜利次数 {{ enemyTeamTwoList[0] }}/{{ enemyTeamTwoList[1] }} 次</span>
      <n-tag size="medium" v-if="isSubscribe==='f'" @click="matchActive=!matchActive"
             type="warning" style="height: 22px;font-size: 13px"
             :bordered="false">轮播广告</n-tag>
    </div>

    <n-drawer  v-if="blacklistActice" v-model:show="blacklistActice"
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

    <n-drawer v-if="matchActive" v-model:show="matchActive"
              :content-style="isSubscribe==='t'?'padding-top:3px;padding-left:7px':'padding:0px'"
              :width="678" placement="right">
      <game-details v-if="isSubscribe==='t'" :current-game-id-props="curGId" :summoner-id="curSId"/>
      <advertisement v-else/>
    </n-drawer>
  </div>
  <div v-else>
    <null-page :is-in="isIn"/>
  </div>

</template>

<script setup lang="ts">
import {NSpace,NPopover,NTag,NDrawer,NDrawerContent} from 'naive-ui'
import Dashboard from "./dashboard.vue"
import Match from "./match.vue"
import GameDetails from "../components/gameDetails.vue";
import NullPage from "../components/nullPage.vue"
import Advertisement from "./advertisement.vue";
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
const gameType = ref(420)
const curGId = ref(0)
const curSId = ref(0)
const isSubscribe =  localStorage.getItem('isSubscribe')
const matchActive = ref(false)
const isIn = ref(true)
const rightMatch = ref()

onMounted(async () => {
  cube.windows.getCurrentWindow().then(value => {
    if (value.height===551){
      isIn.value = false
    }
  })
  const RecentMatch = new recentMatch()
  const isSession = await RecentMatch.checkmatchSession()
  if (isSession){
    RecentMatch.fromLcuQuery().then((matchList) => {
      init(matchList)
    })
  }else {
    let timer = 0
    const interval = setInterval(async () => {
      timer += 1
      const matchList = await RecentMatch.fromLogQuery()
      if (matchList.friendList.length !== 0){
        init(matchList)
        clearInterval(interval)
      }else if (timer===10){
        clearInterval(interval)
      }
    },1000)
  }
})

const init = (matchList:any) => {
  if (matchList.friendList.length !== 0 || matchList.enemyList.length !== 0){
    isPageNull.value = false
  }else {
    return
  }
  checkBlacklist(matchList.enemyList)
  gameType.value = <number>matchList.gameType
  friendList.value = matchList.friendList
  enemyList.value = matchList.enemyList
  if (isSubscribe === 'f'){
    matchActive.value = true
  }
}

const checkBlacklist = async (enemyList:[]) => {
  if (isSubscribe === 'f'){
    return
  }
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  if (!config.isSwitchBlacklist){
    return
  }
  const areaSetting = localStorage.getItem('currentArea')
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

const openMatchDrawer = (mId:number,sId:number) => {
  curGId.value = mId
  curSId.value = sId
  matchActive.value=true
}

const formatDate = (dateStr:string) => {
  return dateStr.split('T')[0]
}

const renderRightMatch = () => {
  rightMatch.value.initMatchList()
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
  display: flex;
  position: absolute;
  left: 160px;
  top: 21px;
  justify-content: space-between;
}
.winCount {
  display: flex;
  color: #666666;
  height: 22px;
  background-color: #e3e3e3;
  font-size: 13px;
  padding: 0px 5px 0px 5px;
  border-radius: 2px;
  align-items: center;
  margin-right: 15px;
}
.draContent {
  margin: 15px 0px;
  color: #9AA4AF;
  font-size: 13px;
}
</style>

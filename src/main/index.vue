<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useMessage} from "naive-ui"
import {useRouter} from "vue-router";
import {useRuneStore} from "@/main/store/useRune";
import Dashboard from "@/main/common/dashboard.vue"
import {useRecordStore} from "@/main/store/useRecord";
import Navigation from "@/main/common/navigation.vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import {queryFriendInfo} from "@/main/views/teammate/utils";

const router = useRouter()
const curPos = ref(0)
const message = useMessage()
const teammateStore = useTeammateStore()
const runeStore = useRuneStore()
const recordStore = useRecordStore()
let isCSSProcess = false
let curFlow = 'None'

onMounted(() => {
  router.push({name: 'home'})
  // testCSSession()
  // testRune()
  // testEndOfGame()
})

cube.windows.message.on('received', (messageId, content) => {
  switch (messageId) {
    case 'None':
      return handleNone(messageId)
    case 'Lobby':
      return handleLobby(messageId)
    case 'CSSession':
      return handleCSSession(messageId, content,true)
    case 'ChampSelect':
      return handleCSSession(messageId, content,false)
    case 'Champion':
      return handleChampion(messageId, content)
    case 'GameStart':
      return handleGameStart(messageId)
    case 'EndOfGame':
      return handleEndOfGame(messageId)
  }
})
cube.windows.message.on('invoked', (id, content, reply) => {
  if (id === 'getMatchList') {
    return reply(JSON.parse(JSON.stringify(teammateStore.cacheMatchList)))
  } else if (id === 'getTeammate') {
    const summonerInfo = JSON.parse(JSON.stringify(teammateStore.summonerInfo))
    const cacheMatchList = JSON.parse(JSON.stringify(teammateStore.cacheMatchList))
    return reply({summonerInfo,cacheMatchList})
  }
})

// 处理None状态
const handleNone = (id: string) => {
  if (id === curFlow){
    return
  }
  runeStore.$reset()
  teammateStore.$reset()
  isCSSProcess = false
  changeState(id, 'home', 0)
}
// 处理Lobby状态
const handleLobby = (id: string) => {
  if (id === curFlow){
    return
  }
  runeStore.$reset()
  teammateStore.$reset()
  isCSSProcess = false
  changeState(id, 'rank', 1)
}
// 处理CSSession状态
const handleCSSession = async (id: string, content: any,isChangeState:boolean) => {
  // 解决极地大乱斗模式问题
  if (isCSSProcess){return}
  isCSSProcess = true

  const queueId:number = JSON.parse(localStorage.getItem('gameInfo') as string).queueId

  queryFriendInfo(content).then(async (summonerInfoList) => {
    const summonerIdList = summonerInfoList.map(summoner => summoner.summonerId)
    // 判断是否存在黑名单数据
    recordStore.checkFriSum(summonerIdList).then(value => {
      teammateStore.initStore(summonerInfoList, queueId, value)
      if (isChangeState){
        changeState(id, 'teammate', 2)
      }else {
        // 从符文配置界面切换过来
        if (value !== null && value.length !== 0){
          setTimeout(() => {
            changeState(id, 'teammate', 2)
          },3000)
        }
      }
    })
  })
}
// 处理Champion状态
const handleChampion = (id: string, content: any) => {
  if (content === 0) {
    return
  }
  runeStore.initStore(content).then((res) => {
    if (res) {
      message.error('当前英雄暂无符文数据')
      return
    } else {
      changeState(id, 'rune', 3)
    }
  })
}
// 处理GameStart状态
const handleGameStart = (id: string) => {
  runeStore.$reset()
  changeState(id, 'record', 4)
}
// 处理EndOfGame状态
const handleEndOfGame = (id: string) => {
  teammateStore.$reset()
  isCSSProcess = false
  recordStore.getParticipantsInfo()
}

// 改变页面
const changeState = (id: string, page: string, index: number) => {
  curFlow = id
  navigateToPage(page, index)
}
// 改变底部页面图标
const navigateToPage = (page: string, index: number) => {
  if (!preventAccess(index)){
    message.warning('当前状态无法查看此页面', {duration: 2000})
    return
  }
  curPos.value = index
  router.push({name: page})
}
// 防止访问
const preventAccess = (index: number) => {
  switch (index) {
    case 2:
      return curFlow === 'CSSession' || curFlow === 'ChampSelect' || curFlow === 'Champion'
    case 3:
      return curFlow === 'Champion'
    default:
      return true
  }
}

/*
const testRune = () => {
  handleChampion('Champion',84)
}
const testCSSession = async () => {
  // await handleCSSession('CSSession', champSession,true)
  // cube.windows.obtainDeclaredWindow('recentMatch')
}
const testEndOfGame = async ()  => {
  curFlow = 'EndOfGame'
  curPos.value = 4
  router.push({name: 'record',query:{id:'1'}})
  recordStore.getParticipantsInfo()
}
*/


</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard/>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
    <navigation :cur-pos="curPos" :navigate-to-page="navigateToPage"/>
  </div>
</template>

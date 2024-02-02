<script setup lang="ts">
import {ref} from "vue";
import {invokeLcu} from "@/lcu";
import {useMessage} from "naive-ui"
import {useRouter} from "vue-router";
import {useRuneStore} from "@/main/store/useRune";
import Dashboard from "@/main/common/dashboard.vue"
import Navigation from "@/main/common/navigation.vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import {queryFriendInfo, writeGameInfo} from "@/main/views/teammate/utils";
import {champSession} from "@/main/views/testSession";

const router = useRouter()
const curPos = ref(0)
const curFlow = ref('None')
const message = useMessage()
const teammateStore = useTeammateStore()
const runeStore = useRuneStore()

router.push({name: 'home'})

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
    case 'PreEndOfGame':
      return handlePreEndOfGame(messageId)
  }
})
cube.windows.message.on('invoked', (id, content, reply) => {
  if (id === 'getMatchList') {
    return reply(JSON.parse(JSON.stringify(teammateStore.cacheMatchList)))
  } else if (id === 'getTeammate') {
    const summonerInfo = JSON.parse(JSON.stringify(teammateStore.summonerInfo))
    const cacheMatchList = JSON.parse(JSON.stringify(teammateStore.cacheMatchList))
    const summonerKad = JSON.parse(JSON.stringify(teammateStore.summonerKad))
    return reply({summonerInfo,cacheMatchList,summonerKad})
  }
})

// 处理None状态
const handleNone = (id: string) => {
  if (id===curFlow.value){
    return
  }
  runeStore.clearStore()
  teammateStore.clearStore()
  changeState(id, 'home', 0)
}
// 处理Lobby状态
const handleLobby = (id: string) => {
  if (id === curFlow.value){
    return
  }
  runeStore.clearStore()
  teammateStore.clearStore()
  changeState(id, 'rank', 1)
}
// 处理CSSession状态
const handleCSSession = async (id: string, content: any,isChangeState:boolean) => {
  // 解决极地大乱斗模式问题
  if (curFlow.value==='CSSession'){
    return
  }

  const queueId = await writeGameInfo()
  queryFriendInfo(content).then((SummonerInfoList) => {
    teammateStore.initStore(SummonerInfoList, queueId)
    if (isChangeState){
      changeState(id, 'teammate', 2)
    }
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
    } else {
      changeState(id, 'rune', 3)
    }
  })
}
// 处理GameStart状态
const handleGameStart = (id: string) => {
  runeStore.clearStore()
  changeState(id, 'rank', 1)
}
// 处理PreEndOfGame状态
const handlePreEndOfGame = (id: string) => {
  teammateStore.clearStore()
  curFlow.value = id
  curPos.value = 4
  router.push({name: 'record'})
}

// 改变页面
const changeState = (id: string, page: string, index: number) => {
  curFlow.value = id
  navigateToPage(page, index)
}
// 改变底部页面图标
const navigateToPage = (page: string, index: number) => {

  if ((index === 2 && curFlow.value === 'None') || (index === 3 && curFlow.value !== 'Champion')) {
    message.warning('当前状态无法查看此页面', {duration: 2000})
    return
  }
  curPos.value = index
  router.push({name: page})
}

const testRune = () => {
  handleChampion('Champion',112)
}
const testCSSession = async () => {
  await handleCSSession('CSSession', champSession,true)
  // cube.windows.obtainDeclaredWindow('recentMatch')
}
const textEndOfGame = async ()  => {
  curFlow.value = 'PreEndOfGame'
  curPos.value = 4
  router.push({name: 'record',query:{id:'1'}})
}
// textEndOfGame()

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

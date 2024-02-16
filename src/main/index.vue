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

onMounted(() => {
  router.push({name: 'home'})
  // testCSSession()
  // testRune()
  // testEndOfGame()
})

// 处理不同的状态
class GameState {
  public curFlow = 'None'
  public isCSSProcess = false
  // 重置Store数据
  public resetStore = () => {
    runeStore.$reset()
    teammateStore.$reset()
    this.isCSSProcess = false
  }
  // 改变页面
  public changeState = (id: string, page: string, index: number) => {
    this.curFlow = id
    this.navigateToPage(page, index)
  }
  // 改变底部页面图标
  public navigateToPage = (page: string, index: number) => {
    if (!this.preventAccess(index)) {
      message.warning('当前状态无法查看此页面', {duration: 2000})
      return
    }
    curPos.value = index
    router.push({name: page})
  }
  // 防止访问
  public preventAccess = (index: number) => {
    switch (index) {
      case 2:
        return this.curFlow === 'CSSession' || this.curFlow === 'ChampSelect' || this.curFlow === 'Champion'
      case 3:
        return this.curFlow === 'Champion'
      default:
        return true
    }
  }
  // 处理None状态
  public handleNone = (id: string) => {
    if (id === this.curFlow) {
      return
    }
    this.isCSSProcess = false
    this.changeState(id, 'home', 0)
  }
  // 处理Lobby状态
  public handleLobby = (id: string) => {
    if (id === this.curFlow) {
      return
    }
    this.isCSSProcess = false
    this.changeState(id, 'rank', 1)
  }
  // 处理Matchmaking状态
  public handleMatchmaking = (id: string) => {
    this.resetStore()
    this.changeState(id, 'rank', 1)
  }
  // 处理CSSession状态
  public handleCSSession = async (id: string, content: any, isChangeState: boolean) => {
    // 解决极地大乱斗模式问题
    if (this.isCSSProcess) {
      return
    }
    this.isCSSProcess = true

    const queueId: number = JSON.parse(localStorage.getItem('gameInfo') as string).queueId

    queryFriendInfo(content).then(async (summonerInfoList) => {
      const summonerIdList = summonerInfoList.map(summoner => summoner.summonerId)
      // 判断是否存在黑名单数据
      recordStore.checkFriSum(summonerIdList).then(value => {
        teammateStore.initStore(summonerInfoList, queueId, value)
        if (isChangeState) {
          this.changeState(id, 'teammate', 2)
        } else {
          // 从符文配置界面切换过来
          if (value !== null && value.length !== 0) {
            setTimeout(() => {
              this.changeState(id, 'teammate', 2)
            }, 3000)
          }
        }
      })
    })
  }
  // 处理Champion状态
  public handleChampion = (id: string, content: any) => {
    if (content === 0) {
      return
    }
    runeStore.initStore(content).then((res) => {
      if (res) {
        message.error('当前英雄暂无符文数据')
        return
      } else {
        this.changeState(id, 'rune', 3)
      }
    })
  }
  // 处理GameStart状态
  public handleGameStart = (id: string) => {
    this.changeState(id, 'record', 4)
  }
  // 处理EndOfGame状态
  public handleEndOfGame = () => {
    recordStore.getParticipantsInfo()
  }
  // 处理AddBlackList状态
  public handleAddBlackList = (gameId:number) => {
    this.changeState('GameStart', 'record', 4)
    recordStore.getParticipantsInfo(gameId)
  }
}

const gameState = new GameState()

cube.windows.message.on('received', (messageId, content) => {
  switch (messageId) {
    case 'None':
      return gameState.handleNone(messageId)
    case 'Lobby':
      return gameState.handleLobby(messageId)
    case 'Matchmaking':
      return gameState.handleMatchmaking(messageId)
    case 'CSSession':
      return gameState.handleCSSession(messageId, content, true)
    case 'ChampSelect':
      return gameState.handleCSSession(messageId, content, false)
    case 'Champion':
      return gameState.handleChampion(messageId, content)
    case 'GameStart':
      return gameState.handleGameStart(messageId)
    case 'EndOfGame':
      return gameState.handleEndOfGame()
    case 'AddBlackList':
      return gameState.handleAddBlackList(content)
  }
})

cube.windows.message.on('invoked', (id, content, reply) => {
  if (id === 'getMatchList') {
    return reply(JSON.parse(JSON.stringify(teammateStore.cacheMatchList)))
  } else if (id === 'getTeammate') {
    const summonerInfo = JSON.parse(JSON.stringify(teammateStore.summonerInfo))
    const cacheMatchList = JSON.parse(JSON.stringify(teammateStore.cacheMatchList))
    return reply({summonerInfo, cacheMatchList})
  }
})

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
    <navigation :cur-pos="curPos" :navigate-to-page="gameState.navigateToPage"/>
  </div>
</template>

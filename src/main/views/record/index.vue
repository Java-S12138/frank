<script setup lang="ts">
import BlackList from "./blackList";
import {NCard, NAlert, NDrawer} from "naive-ui"
import {Hater} from "./blackListTypes";
import {onActivated, onDeactivated, Ref, ref} from "vue";
import BlackSummonerList from "./blackSummonerList.vue";
import {useRouter} from "vue-router";
import MatchDetails from "@/queryMatch/utils/matchDetails";
import GameEnd from "@/main/views/record/gameEnd.vue";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";
import {useRecordStore} from "@/main/store/useRecord";
import HaterDetails from "@/main/views/record/haterDetails.vue";
import {invokeLcu} from "@/lcu";
import {SessionTypes} from "@/recentMatch/utils/queryTypes";

const router = useRouter()
const recordStore = useRecordStore()
const showGameEnd = ref(false)
const participantsInfo: Ref<ParticipantsInfo | null> = ref(null)
const gameId = ref(0)

onActivated(async () => {
  // 游戏结束，弹出的结算窗口
  if (router.currentRoute.value.query.id === '1') {
    const session =  await invokeLcu('get','/lol-gameflow/v1/session') as SessionTypes
    gameId.value = session.gameData.gameId

    const matchDetail = new MatchDetails()
    matchDetail.queryGameDetail(gameId.value, recordStore.localSumInfo.summonerId).then((info) => {
      if (info !== null) {
        participantsInfo.value = info
        showGameEnd.value = true
      }
    })
  }
})

onDeactivated(() => {
  closeDrawer()
})

const closeDrawer = () => {
  showGameEnd.value = false
  setTimeout(() => {
    participantsInfo.value = null
  },1000)
}
</script>

<template>
  <n-card class="shadow " size="small" style="height: 616px;">
    <n-alert v-if="recordStore.haterList === null" title="啊嗷~~~" type="error">
      <text>连接服务器异常，请重启Frank!</text>
      <br>
      <text>多次尝试无果，请等待作者修复！</text>
      <br>
      <text>给您带来的使用不便，深感抱歉~</text>
    </n-alert>
    <n-alert v-else-if="recordStore.haterList.length===0" title="排位笔记" type="success">
      <text>当前大区暂无你的排位笔记哟，</text>
      <br>
      <text>营造良好游戏环境从你我做起。</text>
      <br>
      <text class="text-gray-400">游戏对局结束后方可添加数据~</text>
    </n-alert>
    <black-summoner-list
      v-else
      :local-sum-id="recordStore.localSumInfo.summonerId"
      :hater-list="recordStore.haterList"
      :refresh-list="recordStore.init"
    />
  </n-card>

  <!--  游戏结束，弹出增加玩家的窗口-->
  <n-drawer
    v-model:show="showGameEnd" class="rounded-t-xl"
    :mask-closable="false" :auto-focus="false"
    height="400" placement="bottom">
    <game-end
      v-if="participantsInfo"
      :close-drawer="closeDrawer"
      :team-one="participantsInfo.teamOne"
      :team-two="participantsInfo.teamTwo"
      :game-id="gameId"
      :platform-id="recordStore.localSumInfo.platformId"
    />
  </n-drawer>
</template>

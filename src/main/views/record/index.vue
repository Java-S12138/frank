<script setup lang="ts">
import {NCard, NAlert, NDrawer} from "naive-ui"
import {onDeactivated} from "vue";
import BlackSummonerList from "./blackSummonerList.vue";
import GameEnd from "@/main/views/record/gameEnd.vue";
import {useRecordStore} from "@/main/store/useRecord";

const recordStore = useRecordStore()

onDeactivated(() => {
  closeDrawer()
})

const closeDrawer = () => {
  recordStore.showGameEnd = false
  setTimeout(() => {
    recordStore.participantsInfo = null
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
    v-model:show="recordStore.showGameEnd" class="rounded-t-xl"
    :mask-closable="false" :auto-focus="false"
    height="400" placement="bottom">
    <game-end
      v-if="recordStore.participantsInfo"
      :close-drawer="closeDrawer"
      :team-one="recordStore.participantsInfo.teamOne"
      :team-two="recordStore.participantsInfo.teamTwo"
      :game-id="recordStore.participantsInfo.gameId"
      :platform-id="recordStore.localSumInfo.platformId"
    />
  </n-drawer>
</template>

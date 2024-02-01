<script setup lang="ts">
import BlackList from "./blackList";
import {NCard, NAlert} from "naive-ui"
import {Hater} from "./blackListTypes";
import {onActivated,Ref, ref} from "vue";
import BlackSummonerList from "./blackSummonerList.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const blackList = new BlackList()
const localSumId = blackList.sumInfo.summonerId
const haterList: Ref<Hater[]|null> = ref([])

onActivated(() => {
  if (haterList.value?.length===0){
    init()
  }
  if (router.currentRoute.value.query.id === '1'){
    console.log(13)
  }

})

const init = async () => {
  const cubeUserId: string = (await cube.profile.getCurrentUser())?.userId
  const sumIdList = await blackList.queryBlacklist(cubeUserId)
  if (sumIdList === null) {
    haterList.value = null
    return
  }
  haterList.value = await blackList.querySumDetails(sumIdList)
}

</script>

<template>
  <n-card class="shadow " size="small" style="height: 616px;">
    <n-alert v-if="haterList === null" title="啊嗷~~~" type="error">
      <text>连接服务器异常，请重启Frank!</text>
      <br>
      <text>多次尝试无果，请等待作者修复！</text>
      <br>
      <text>给您带来的使用不便，深感抱歉~</text>
    </n-alert>
    <n-alert v-else-if="haterList.length===0" title="排位笔记" type="success">
      <text>当前大区暂无你的排位笔记哟，</text>
      <br>
      <text>营造良好游戏环境从你我做起。</text>
      <br>
      <text class="text-gray-400">游戏对局结束后方可添加数据~</text>
    </n-alert>
    <black-summoner-list
      v-else
      :local-sum-id="localSumId"
      :hater-list="haterList"
      :refresh-list="init"
    />
  </n-card>
</template>

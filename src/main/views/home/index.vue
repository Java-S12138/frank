<script setup lang="ts">
import {
  NCard, NAvatar, NProgress, NSpace, NTag, NDivider,NList, NListItem,NButton,NEllipsis
} from 'naive-ui'
import {getCurrentSummonerAllInfo} from "./getHomeData";
import {onActivated, onMounted, reactive} from "vue";
import {SummonerData} from "@/lcu/types/SummonerTypes";
import SummonerMasteryChamp from "@/main/common/summonerMasteryChamp.vue";
import StartGame from "./startGame.vue";
import {GameInfo, sumInfoTypes} from "@/background/utils/backgroundTypes";

const summonerData:SummonerData = reactive({
  summonerInfo: null,
  rankList: null,
  champLevel: null,
})

onMounted( () => {
  init().then(async (value) =>  {
    if (!value){
      const lolCient = (await cube.games.launchers.getRunningLaunchers())
        .find(((i:any) => i.classId===10902))

      if (lolCient === undefined){
        onClientLaunch()
      }else {
        let timer = 0
        const maxAttempts = 3
        const launchInterval = setInterval(async () => {
          timer++
          const isInit = await init()
          if (isInit || timer === maxAttempts) {
            clearInterval(launchInterval)
          }
        }, 1500)
      }
    }
  })
})

onActivated(() => {
  if (summonerData.summonerInfo!==null){
    init()
  }
})

const init = async () => {
  const summonerAllInfo = await getCurrentSummonerAllInfo()
  if (summonerAllInfo === null){
    return false
  }
  writeSumInfo(summonerAllInfo)
  return true
}

const writeSumInfo = (sInfo) => {
  summonerData.summonerInfo = sInfo.summonerInfo
  summonerData.rankList = sInfo.rankList as string[]
  summonerData.champLevel = sInfo.champLevel as string[][]

  cube.games.launchers.events.getInfo(10902).then((info:GameInfo) => {
    // 设置召唤师信息
    const sumInfo:sumInfoTypes = {
      name:sInfo.summonerInfo.name,
      summonerId:sInfo.summonerInfo.currentId,
      platformId:<string>info.summoner_info?.platform_id
    }
    localStorage.setItem('sumInfo',JSON.stringify(sumInfo))
  })
}

const onClientLaunch = () => {
  const closeMessageOn = cube.windows.message.on('received', async (id) => {
    if (id === 'initHome') {
      let timer = 0
      const interval = setInterval(async () => {
        timer += 1
        if (summonerData.summonerInfo === null){
          init()
        }else {
          clearInterval(interval)
          closeMessageOn()
        }
        if (timer===8){
          clearInterval(interval)
          closeMessageOn()
        }
      },3000)
    }
  })
}

const openWin = () => {
  cube.windows.obtainDeclaredWindow('queryMatch')
}

</script>

<template>
  <div class="mainContent" v-if="summonerData.summonerInfo">
    <n-card size="small" class="shadow" content-style="padding-bottom: 0;">
      <!--    头像 昵称 等级-->
      <div class="h-14 flex gap-x-2">
        <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                  :src="summonerData.summonerInfo.imgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <n-space class="flex-grow" :size="[0,0]"
                 justify="space-between" vertical>
          <div class="flex justify-between">
            <!--昵称-->
            <n-tag type="success"
                   style="width: 130px;justify-content: center"
                   :bordered="false" round>
              <n-ellipsis style="max-width: 110px" :tooltip="false">
                {{summonerData.summonerInfo.name}}
              </n-ellipsis>
            </n-tag>
            <n-button class="px-2"  :bordered="false"
                      @click="openWin"
                      type="success" size="small" round>
              查询战绩
            </n-button>
          </div>
          <div class="flex justify-between gap-x-3">
            <n-tag type="warning" size="small" round :bordered="false">
              {{ summonerData.summonerInfo.lv }}
            </n-tag>
            <div class="flex-grow "
                 style="background-color: rgba(240, 160, 32, 0.15);
               padding: 0 7px; color: #f0a020; font-size: 12px;
               border-radius: 12px">
              <div class="flex justify-between items-center">
                <n-progress
                  type="line"
                  :show-indicator="false"
                  :percentage="summonerData.summonerInfo.xp"
                  status="warning"
                  processing
                  style="width:100px;margin-top: 1.2px;"
                  :height="10"
                />
                <div style="padding-top: 2px;">{{ summonerData.summonerInfo.xp }} %</div>
              </div>
            </div>

          </div>
        </n-space>
      </div>
      <!--    头像 昵称 等级-->

    <n-divider dashed style="margin: 14px 0 2px 0"/>

      <!--段位 荣誉等级-->
      <n-list>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32 justify-center" type="success" :bordered="false" :round="false">
              单双 {{ summonerData.rankList[0] }}
            </n-tag>
            <n-tag class="w-32 justify-center" type="success" :bordered="false" :round="false">
              灵活 {{ summonerData.rankList[1] }}
            </n-tag>
          </n-space>
        </n-list-item>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32 justify-center" type="warning" :bordered="false" :round="false">
              云顶 {{ summonerData.rankList[2] }}
            </n-tag>
            <n-tag class="w-32 justify-center" type="warning" :bordered="false" :round="false">
              {{ summonerData.rankList[3] }}
            </n-tag>
          </n-space>
        </n-list-item>
      </n-list>
      <!--段位 荣誉等级-->
    </n-card>
    <n-card size="small" content-style="padding-top:10px"
            class="shadow" style="height: 402px;">
      <summoner-mastery-champ v-if="summonerData.champLevel"
                              :max-h="378" :puuid="''" :exist-champ-list="summonerData.champLevel"/>
    </n-card>
  </div>
  <div class="mainContent" v-else>
    <start-game/>
  </div>
</template>

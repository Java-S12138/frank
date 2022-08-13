<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small"
            :content-style="'padding:9px 12px 0px 16px'" style="height: 100%">
      <n-layout has-sider >
        <n-layout-sider  :width="189">
          <n-list>
            <n-list-item v-for="(match,index) in matchList" style="width: 172px;">
              <n-space @click="showDetiledData(match.gameId,index)" style="position: relative">
                <n-avatar
                  :bordered="false"
                  :size="40"
                  :src="match.champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display:block"
                />
                <n-space vertical :size="[2,1.6]">
                  <n-space>
                    <n-tag size="small" type="success" v-if="match.isWin"
                           style="width: 68px;justify-content: center"
                           :bordered="false">{{match.kills}}-{{match.deaths}}-{{match.assists}}</n-tag>
                    <n-tag size="small" type="error" v-else
                           style="width: 68px;justify-content: center"
                           :bordered="false">{{match.kills}}-{{match.deaths}}-{{match.assists}}</n-tag>

                    <n-tag size="small" :type="index === currentMatchIndex?'warning':'default'" style="width: 40px;justify-content: center"
                           :bordered="false">{{match.matchTime}}</n-tag>
                  </n-space>
                  <p style="font-size: 12px;color: #9aa4af">{{match.queueId}}</p>
                  <n-icon size="19" color="#18a058" style="position: absolute;right: 0px;top: 26.5px"
                          v-if="((match.kills+match.assists)/match.deaths)*3 >=10" >
                    <ThumbUp/>
                  </n-icon>
                  <n-icon size="19" color="#ff6666" style="position: absolute;right: 0px;top: 29px"
                          v-else >
                    <ThumbDown/>
                  </n-icon>
                </n-space>
              </n-space>
            </n-list-item>
          </n-list>

        </n-layout-sider>
        <n-layout>
          <n-layout-content v-if="currentGameId !==0" >
            <game-details class="slide-in-right"
              :currentGameId="currentGameId" :key="currentGameId"
            ></game-details>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-card>

  </div>
</template>

<script>
export default {
  name: "matchDetailed"
}
</script>

<script setup>
import {ThumbUp,ThumbDown} from '@vicons/tabler'
import {NCard,NLayout,NLayoutSider,NLayoutContent, NAvatar,NIcon, NSpace, NTag,
  NList, NListItem,useMessage} from "naive-ui";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia.esm-browser";
import {ref, watch} from "vue";
import {dealMatchHistory} from "@/utils/render/queryMatchLcu";
import {appConfig} from "@/utils/main/config";
import GameDetails from "./gameDetails.vue";

const store = queryStore()
const {querySummonerId,begIndex,endIndex,page} = storeToRefs(store)
const matchList = ref([])
const credentials = appConfig.get('credentials')
const currentGameId = ref(0)
const currentMatchIndex = ref(0)
const message = useMessage()

watch(querySummonerId,async () => {
  if (page.value !==1){
    page.value =1
    return
  }

  const matchDict = await dealMatchHistory(credentials,querySummonerId.value,0,8)
  if (matchDict === null){
    message.warning('当前页数战绩为空')
    return
  }else {
    currentGameId.value = matchDict[0].gameId
    matchList.value =matchDict
    currentMatchIndex.value = 0
  }
})


watch(begIndex,async () => {
  const matchDict = await dealMatchHistory(credentials,querySummonerId.value,begIndex.value,endIndex.value)
  if (matchDict === null){
    message.warning('当前页数战绩为空')
    return
  }else {
    currentGameId.value = matchDict[0].gameId
    matchList.value =matchDict
    currentMatchIndex.value = 0
  }

})

const showDetiledData = (gameId,index) => {
  currentGameId.value = gameId
  currentMatchIndex.value = index
}
</script>

<style scoped>
.slide-in-right {
  animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-right {
  0% {
    transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.mainCard {
  width: 850px;
}
</style>

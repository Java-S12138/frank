<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small"
            :content-style="'padding:9px 12px 0px 16px'" style="height: 100%">
      <n-layout has-sider v-if="!showChart">
        <n-layout-sider :width="189">
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
                           :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
                    </n-tag>
                    <n-tag size="small" type="error" v-else
                           style="width: 68px;justify-content: center"
                           :bordered="false">{{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
                    </n-tag>

                    <n-tag size="small" :type="index === currentMatchIndex?'warning':'default'"
                           style="width: 40px;justify-content: center"
                           :bordered="false">{{ match.matchTime }}
                    </n-tag>
                  </n-space>
                  <p style="font-size: 12px;color: #9aa4af">{{ match.queueId }}</p>
                  <n-icon size="19" color="#18a058" style="position: absolute;right: 0px;top: 26.5px"
                          v-if="((match.kills+match.assists)/match.deaths)*3 >=10">
                    <ThumbUp/>
                  </n-icon>
                  <n-icon size="19" color="#ff6666" style="position: absolute;right: 0px;top: 29px"
                          v-else>
                    <ThumbDown/>
                  </n-icon>
                </n-space>
              </n-space>
            </n-list-item>
          </n-list>

        </n-layout-sider>
        <n-layout>
          <n-layout-content v-if="currentGameId !==0">
            <game-details class="slide-in-right"
                          :currentGameId="currentGameId" :key="currentGameId"
            ></game-details>
          </n-layout-content>
        </n-layout>
      </n-layout>
      <recent-echart v-if="matchList.length!==0 && showChart" :matchList="matchList"></recent-echart>
    </n-card>

  </div>
</template>

<script>
export default {
  name: "matchDetailed"
}
</script>

<script setup>
import {ThumbUp, ThumbDown} from '@vicons/tabler'
import {
  NCard, NLayout, NLayoutSider, NLayoutContent, NAvatar, NIcon, NSpace, NTag,
  NList, NListItem, useMessage
} from "naive-ui";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";
import {dealMatchHistory, querySpecialMatchHistory} from "@/utils/render/queryMatchLcu";
import {appConfig} from "@/utils/main/config";
import GameDetails from "./gameDetails.vue";
import RecentEchart from "./recentEchart.vue";

const store = queryStore()
const {
  querySummonerId, begIndex, endIndex, page, currentMode,
  showChart, matchList, currentGameId, currentMatchIndex
} = storeToRefs(store)
const credentials = appConfig.get('credentials')
const message = useMessage()
let messageReactive = null
const specialMatchDict = ref([])

watch(querySummonerId, async () => {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  initHomeData()
})

watch(begIndex, async () => {
  if (currentMode.value === '全部模式') {
    initHomeData()
  } else {
    matchList.value = specialMatchDict.value.slice(begIndex.value, endIndex.value)
    if (matchList.value.length === 0) {
      message.warning('当前页数战绩为空')
      currentGameId.value = 0
    } else {
      currentMatchIndex.value = 0
      currentGameId.value = matchList.value[0].gameId
    }
  }
})

watch(currentMode, async () => {
  let mode
  switch (currentMode.value) {
    case '全部模式' :
      mode = '全部模式';
      break
    case '单双排位' :
      mode = '排位赛 单排/双排';
      break
    case '灵活排位' :
      mode = '排位赛 灵活排位';
      break
    case '极地乱斗' :
      mode = '极地大乱斗';
      break
    case '匹配模式' :
      mode = '匹配模式';
      break
    case '其它模式' :
      mode = '其它模式';
      break
  }
  if (mode !== '全部模式') {
    createMessage(mode)
    specialMatchDict.value = await querySpecialMatchHistory(credentials, querySummonerId.value, mode)
    removeMessage()
    renderSpecialMatch(mode)
  } else {
    if (page.value === 1) {
      initHomeData()
    } else {
      page.value = 1
    }
  }
})
const showDetiledData = (gameId, index) => {
  currentGameId.value = gameId
  currentMatchIndex.value = index
}
const initHomeData = async () => {
  const matchDict = await dealMatchHistory(credentials, querySummonerId.value, begIndex.value, endIndex.value)
  if (matchDict === null) {
    matchList.value = []
    currentGameId.value = 0
    currentMatchIndex.value = 0
    message.warning('当前页数战绩为空')
    return
  } else {
    currentGameId.value = matchDict[0].gameId
    matchList.value = matchDict
    currentMatchIndex.value = 0
  }
}
const removeMessage = () => {
  if (messageReactive) {
    messageReactive.destroy();
    messageReactive = null;
  }
};
const createMessage = (mode) => {
  if (!messageReactive) {
    messageReactive = message.loading(`${mode} 数据加载中...`, {
      duration: 0
    });
  }
}
// 渲染其它模式的游戏数据
const renderSpecialMatch = async (mode) => {
  if (page.value === 1) {
    matchList.value = specialMatchDict.value.slice(0, 8)
    if (matchList.value.length === 0) {
      message.warning('当前模式战绩为空')
      currentGameId.value = 0
    } else {
      currentMatchIndex.value = 0
      currentGameId.value = matchList.value[0].gameId
      message.success(`${mode} 数据加载成功!`)
    }
  } else {
    page.value = 1
  }
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

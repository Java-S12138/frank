<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-avatar
        round
        :bordered="false"
        :size="60"
        :src="rankData[7]"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <n-space vertical :size="[2,10]">
        <div style="">
          <!--                昵称-->
          <n-tag type="success" :bordered="false" :round="true">
            {{ rankData[0] }}
          </n-tag>
          <!--                大区-->
          <n-tag type="success" style="float: right"
                 :bordered="false" :round="true">
            {{ rankData[1] }}
          </n-tag>
        </div>
        <n-space style="justify-content: space-between;">
          <n-popover v-for="value in [0,2,4]"
                     trigger="hover" :show-arrow="false" placement="bottom">
            <template #trigger>
              <n-tag type="warning" :bordered="false" :round="true" size="small">
                {{ carryData[value] }}
              </n-tag>
            </template>
            {{ carryData[value + 1] }}
          </n-popover>
        </n-space>
      </n-space>
    </n-card>

    <n-card class="boxShadow pointCard" size="small">
      <n-space justify="space-between" >
        <n-button dashed size="large" style=" color: #666F75;" @click = "switchButton = 1">
          个人生涯
        </n-button>
        <n-button dashed size="large" style=" color: #666F75;" @click = "switchButton = 2">
          英雄数据
        </n-button>
<!--        <n-button dashed size="large" style=" color: #666F75;" @click = "queryMatch">-->
<!--          查询战绩-->
<!--        </n-button>-->
      </n-space>
      <div v-show="switchButton == 1">
        <n-list>
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0"
                     :round="false" size="large">
                单双排位
              </n-tag>
              <n-tag type="success" :bordered="false" v-else class="tagWidth"
                     :round="false" size="large">

              </n-tag>

              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{ rankData[2] }}
              </n-tag>
            </n-space>
          </n-list-item>
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0" :round="false"
                     size="large">
                灵活排位
              </n-tag>
              <n-tag type="success" :bordered="false" class="tagWidth" v-else :round="false" size="large">

              </n-tag>
              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{ rankData[3] }}
              </n-tag>
            </n-space>
          </n-list-item>
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0" :round="false"
                     size="large">
                云顶排位
              </n-tag>
              <n-tag type="success" :bordered="false" class="tagWidth" v-else :round="false" size="large">
              </n-tag>

              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{ rankData[4] }}
              </n-tag>
            </n-space>
          </n-list-item>
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" :round="false" size="large" class="tagWidth">
                {{ summonerHonor[0] }}
              </n-tag>

              <n-tag type="warning" :bordered="false"
                     :round="false" size="large" class="tagWidth">
                {{ summonerHonor[1] }}
              </n-tag>
            </n-space>
          </n-list-item>

        </n-list>
      </div>
      <div v-show="switchButton == 2">
        <div style="margin-top: 12px">
          <n-space vertical>

            <n-list>
              <n-scrollbar style="max-height: 215px">
                <n-list-item v-for="chapm in summonerChampLevel">
                  <n-space class="alignCenter">
                    <n-avatar
                      round
                      :bordered="false"
                      :size="50"
                      :src="chapm[0]"
                      fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    />
                    <n-tag :bordered="false" style="color: #9aa4af">
                      英雄等级 {{ chapm[1] }}
                    </n-tag>
                    <n-tag :bordered="false" style="color: #9aa4af">
                      熟练度 {{ chapm[2] }}
                    </n-tag>
                  </n-space>
                </n-list-item>
              </n-scrollbar>
            </n-list>
          </n-space>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue"
import {ipcRenderer} from 'electron'
import {
  NCard, NAvatar, NSpace, NTag, NButton, NPopover, NList, NListItem, NScrollbar, useMessage
} from 'naive-ui'
import {appConfig} from "@/utils/main/config";
import {returnRankData} from "@/utils/render/renderLcu";


const rankData = ref([])
const carryData = ref([])
const summonerHonor = ref([])
const summonerChampLevel = ref([])
let switchButton = ref(1)

const message = useMessage()

onMounted(() => {
  getHomeData()
  // 监听是否获取到英雄联盟客户端信息
  ipcRenderer.once('client-starting', () => {
    message.loading(
      '英雄联盟客户端启动中...'
    )
  })
  ipcRenderer.once('init-home', (event, data) => {
    rankData.value = data.rank
    carryData.value = data.carry
    summonerHonor.value = data.honorData
    summonerChampLevel.value = data.chapmLevel
  })
})
const getHomeData = async () => {
  const credentials = appConfig.get('credentials')
  if (credentials.port != '') {
    const homeData = await returnRankData(credentials)
    rankData.value = homeData.rank
    carryData.value = homeData.carry
    summonerHonor.value = homeData.honorData
    summonerChampLevel.value = homeData.chapmLevel
  }
}
const queryMatch = () => {
  ipcRenderer.send('show-query-match')
}
</script>

<style scoped>
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
}

.n-avatar {
  float: left;
  margin-right: 15px;
  margin-top: 1px;
}

.pointCard {
  margin-top: 37px;
  height: 300px;
}

.alignCenter {
  align-items: center;
}

.tagWidth {
  width: 96px;
  justify-content: center;
}
</style>

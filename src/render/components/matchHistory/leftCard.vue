<template>
  <div>
    <n-card class="mainCard boxShadow">
      <n-space v-if="summonerInfo.length !=0">
        <n-space vertical style="margin-top: 15px;width: 200px"
                 :size="[2,34]" v-if="currentTeam ===1">
          <n-space v-for="summoner in summonerInfo">
            <n-avatar
              round
              :bordered="false"
              :size="50"
              :src="`https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summoner.iconId}.png`"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              @click="clickCurrentSummoner($event,summoner.summonerId,summoner.name)"
            />
            <n-space vertical :size="[10,4]">
              <n-tag type="success" :bordered="false"
                     round size="small" :disabled="currentSummonerName === summoner.name ? false:true">{{ summoner.name }}</n-tag>

              <n-tag type="success" :bordered="false" v-if="summoner.horse == horseType.top"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="warning" :bordered="false" v-else-if="summoner.horse == horseType.mid"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="info" :bordered="false" v-else-if="summoner.horse == horseType.bot"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="error" :bordered="false" v-else-if="summoner.horse == horseType.trash"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
            </n-space>
          </n-space>
        </n-space>

        <n-space vertical style="margin-top: 15px;width: 200px"
                 :size="[2,34]" v-else-if="currentTeam===2">
          <n-space v-for="summoner in enemySummonerInfo">
            <n-avatar
              round
              :bordered="false"
              :size="50"
              :src="`https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summoner.iconId}.png`"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              @click="clickCurrentSummoner($event,summoner.summonerId,summoner.name)"
            />
            <n-space vertical :size="[10,4]">
              <n-tag type="success" :bordered="false" round size="small"
                     :disabled="currentSummonerName === summoner.name ? false:true">{{ summoner.name }}</n-tag>
              <n-tag type="success" :bordered="false" v-if="summoner.horse == horseType.top"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="warning" :bordered="false" v-else-if="summoner.horse == horseType.mid"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="info" :bordered="false" v-else-if="summoner.horse == horseType.bot"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
              <n-tag type="error" :bordered="false" v-else-if="summoner.horse == horseType.trash"
                     round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
              </n-tag>
            </n-space>
          </n-space>
        </n-space>

        <n-space style="margin-top: 30px;width: 200px" v-if="enemySummonerInfo.length != 0" justify="space-between">
          <n-button size="small" :bordered="currentTeam===1" @click="changeCurrentTeam"
                    type="success" dashed>我方召唤师
          </n-button>
          <n-button size="small" :bordered="currentTeam===2" @click="changeCurrentTeam"
                    type="error" dashed>敌方召唤师
          </n-button>
        </n-space>

        <n-space style="margin-top: 12px;width: 200px"
                 v-else-if="summonerInfo !=null && enemySummonerInfo.length === 0">
          <n-tag :bordered="false" size="small" class="tipTag">进入游戏后可查看敌方信息</n-tag>
          <n-tag :bordered="false" size="small" class="tipTag">点击召唤师的头像查看战绩</n-tag>
        </n-space>
      </n-space>
      <n-space v-else style="align-items: center;margin-top: 220px;margin-left: 30px">
        <n-spin size="medium"/>
        <p>数据加载中....</p>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import {NCard, NAvatar, NSpace, NTag, NButton, NSpin} from 'naive-ui'
import {appConfig} from "@/utils/main/config";
import {queryEnemySummonerId} from "@/utils/render/renderLcu";
import {getSummonerNickName} from "@/utils/main/lcu";
import {storeToRefs} from "pinia/dist/pinia";
import {matchStore} from "@/render/store";
import {ipcRenderer} from "electron";
const emits = defineEmits(['summonerId','backHome'])

const horseType = appConfig.get('horseType')
const store = matchStore()
const {enemyEchartsData, currentEchartData,echartsData,currentTeam,
  currentSummonerName, summonerInfo,enemySummonerInfo} = storeToRefs(store)

ipcRenderer.on('query-enemy-summoner', () => {
  getEnemyInfo()
})
const getEnemyInfo = async () => {
  const credentials = appConfig.get('credentials')
  const enemyIdList = await queryEnemySummonerId(credentials)
  enemySummonerInfo.value = await getSummonerNickName(credentials, enemyIdList)
  getEnemyChartsData(enemySummonerInfo.value)
}
// getEnemyInfo()

const getEnemyChartsData = (res) => {
  enemyEchartsData.value = {name: [], data: [], kdaHistory: [], horse: [], summonerId: []}
  for (const re of res) {
    enemyEchartsData.value.name.push(re.name)
    enemyEchartsData.value.data.push(re.score)
    enemyEchartsData.value.kdaHistory.push(re.kdaHistory)
    enemyEchartsData.value.horse.push(re.horse)
    enemyEchartsData.value.summonerId.push(re.summonerId)
  }
}

const changeCurrentTeam = () => {
  currentTeam.value = currentTeam.value === 1 ? 2 : 1
  currentEchartData.value = currentTeam.value === 1 ? echartsData.value : enemyEchartsData.value
  emits('backHome')
}

const clickCurrentSummoner = (e, summonerId, name) => {
  emits('summonerId', {summonerId, name})
}

</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  width: 250px;
  height: 556px
}

.tipTag {
  width: 200px;
  justify-content: center;
  color: #9aa4af;
}
</style>

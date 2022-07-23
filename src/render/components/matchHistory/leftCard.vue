<template>
  <div>
      <n-card class="mainCard boxShadow">
        <n-space v-if="summonerInfo !=null">
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
                <n-tag type="success" :bordered="false" round size="small" disabled="disabled">{{ summoner.name }}</n-tag>
                <n-tag type="success" :bordered="false"  v-if="summoner.horse == horseType.top"
                       round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
                </n-tag>
                <n-tag type="warning" :bordered="false" v-else-if="summoner.horse == horseType.mid"
                       round size="small">{{ summoner.horse }} {{summoner.rankPoint }}
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
                <n-tag type="success" :bordered="false" round size="small" disabled="disabled">{{ summoner.name }}</n-tag>
                <n-tag type="success" :bordered="false"  v-if="summoner.horse == horseType.top"
                       round size="small">{{ summoner.horse }} {{ summoner.rankPoint }}
                </n-tag>
                <n-tag type="warning" :bordered="false" v-else-if="summoner.horse == horseType.mid"
                       round size="small">{{ summoner.horse }} {{summoner.rankPoint }}
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

          <n-space style="margin-top: 12px;width: 200px" v-if="enemySummonerInfo.length != 0" justify="space-between">
            <n-button size="small" :bordered="currentTeam===1" @click="changeCurrentTeam"
                      type="success" dashed>我方召唤师</n-button>
            <n-button  size="small" :bordered="currentTeam===2" @click="changeCurrentTeam"
                       type="error" dashed>敌方召唤师</n-button>
          </n-space>

          <n-space style="margin-top: 12px;width: 200px" v-else-if="summonerInfo !=null && enemySummonerInfo.length === 0">
            <n-tag :bordered="false" size="small">进入游戏后可查看敌方信息</n-tag>
          </n-space>
        </n-space>
        <n-space v-else style="align-items: center">
          <n-spin size="medium" />
          <p>数据加载中....</p>
        </n-space>
      </n-card>
  </div>
</template>

<script>
import {NCard, NAvatar, NSpace, NTag, NButton,NBadge,NSpin} from 'naive-ui'
import {appConfig} from "@/utils/main/config";
import {queryEnemySummonerId} from "@/utils/render/renderLcu";
import {ref} from "vue";
import {getSummonerNickName} from "@/utils/main/lcu";
import {storeToRefs} from "pinia/dist/pinia";
import {useStore} from "@/render/store";
import {ipcRenderer} from "electron";

export default {
  name: "leftCard",
  components: {
    NCard, NAvatar, NSpace, NTag, NButton,NBadge,NSpin
  },
  props: {
    summonerInfo: {
      type: Array
    }
  },
  setup(props,{emit}) {
    let clickCount = 0
    let clickList = []
    const horseType = appConfig.get('horseType')
    const enemySummonerInfo = ref([])
    const store = useStore()
    const {enemyEchartsData,currentTeam} = storeToRefs(store)

    ipcRenderer.on('query-enemy-summoner',() => {
      getEnemyInfo()
    })

    const getEnemyInfo = async () => {
      const credentials = appConfig.get('credentials')
      const enemyIdList = await queryEnemySummonerId(credentials)
      enemySummonerInfo.value = await getSummonerNickName(credentials,enemyIdList)
      getEnemyChartsData(enemySummonerInfo.value)
    }

    const getEnemyChartsData = (res) => {
      enemyEchartsData.value = {name:[],data:[],kdaHistory:[],horse:[]}
      for (const re of res) {
        enemyEchartsData.value.name.push(re.name)
        enemyEchartsData.value.data.push(re.score)
        enemyEchartsData.value.kdaHistory.push(re.kdaHistory)
        enemyEchartsData.value.horse.push(re.horse)
      }
    }

    const changeCurrentTeam = () => {
      currentTeam.value = currentTeam.value ===1 ? 2:1
    }

    const clickCurrentSummoner = (e,summonerId,name) => {
      try {
        emit('summonerId', {summonerId, name})
        let tar = e.currentTarget.parentElement.parentElement
        let nTag = tar.getElementsByClassName('n-tag--disabled')[0]
        nTag.classList.remove('n-tag--disabled')
        clickCount += 1
        clickList.push(nTag)
        if (clickCount == 2) {
          clickList[0].classList.add('n-tag--disabled')
          clickList.splice(0, 1)
          clickCount = 1
        }
      }catch (e){
        return e
      }
    }

    return {
      horseType,currentTeam,enemySummonerInfo,
      clickCurrentSummoner,changeCurrentTeam
    }
  }
}
</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  width: 250px;
  height: 556px
}

</style>

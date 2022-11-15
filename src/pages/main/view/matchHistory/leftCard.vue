<template>
  <div>
    <n-card class="mainCard boxShadow">
      <n-space v-if="summonerInfo.length !=0">
        <n-space vertical style="margin-top: 15px;width: 200px"
                 :size="[2,30.6]">
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
            <n-space style="width: 200px">
              <n-tag :bordered="false" round :color="{ color: '#fafafc', textColor: '#9AA4AF' }"
                     size="small" class="tipTag">进入游戏后可查看敌方信息</n-tag>
              <n-tag :bordered="false" round :color="{ color: '#fafafc', textColor: '#9AA4AF' }"
                     size="small" class="tipTag">点击召唤师的头像查看战绩</n-tag>
           </n-space>
         </n-space>
        </n-space>
      <n-space v-else style="align-items: center;margin-top: 220px;margin-left: 30px">
        <n-spin size="medium"/>
        <p>数据加载中....</p>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NAvatar, NSpace, NTag, NSpin} from 'naive-ui'
import {storeToRefs} from "pinia";
import {matchStore} from "../../store";
const emits = defineEmits(['summonerId','backHome'])

const config = JSON.parse(String(localStorage.getItem('config')))
const horseType:any = config.horseType
const store = matchStore()
const {currentSummonerName, summonerInfo}:any = storeToRefs(store)


const clickCurrentSummoner = (e:any, summonerId:number, name:string) => {
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

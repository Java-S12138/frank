<template>
  <n-list hoverable :show-divider="false" class="listFlex">
    <n-list-item
      v-for="(summoner,index) in store.summonerInfo" style="padding: 5px">
      <n-space :size="[12,0]">
        <n-avatar
          :size="55"
          round
          :src="getImgUrl(summoner.profileIconId)"
          style="display: block;cursor: pointer"
          @click="getCurrentSum(summoner.name,extraData[index]?.rank,summoner.summonerId,summoner.puuid,summoner.profileIconId)"
        />
        <n-space vertical :size="[0,5]">
          <n-tag round class="titleTag" :bordered="false" type="success">{{ summoner.name }}</n-tag>
          <n-tag round class="titleTag" :bordered="false" type="info">
             {{ extraData[index]?.rank }}</n-tag>
        </n-space>
      </n-space>
      <n-space style="margin-top: 10px" justify="space-between">
        <n-avatar
          v-for="img in extraData[index]?.champImgs"
          :size="32"
          :src="img"
          style="display: block"
        />
      </n-space>
    </n-list-item>

    <div class="tipBottom">
      <n-space justify="space-between" style="width: 100%;">
        <n-tag @click="openWin" class="tipTag" type="success" :bordered="false" round>对局分析</n-tag>
        <n-tag type="info" round style="font-size: 13px"
               :disabled="true" :bordered="false">点击头像查看更多信息</n-tag>
      </n-space>
    </div>
  </n-list>

  <n-drawer style="border-top-left-radius: 12px;border-top-right-radius: 12px"
    v-model:show="active" :height="523" placement="bottom">
    <summoner-detail
      :summoner-name="currentSumInfo.name"
      :summoner-level="currentSumInfo.level"
      :summoner-puuid="currentSumInfo.puuid"
      :summoner-id="currentSumInfo.summonerId"
      :summoner-icon="currentSumInfo.icon">
    </summoner-detail>
  </n-drawer>
</template>

<script setup lang="ts">
import {NSpace, useMessage, NList, NListItem, NAvatar, NTag,NDrawer} from 'naive-ui'
import assistStore from "../../../store/assistStore";
import {querySummonerRank,querySuperChampList} from "../../../lcu/assistMatchDetailLcu"
import {onMounted, ref, Ref} from "vue";
import SummonerDetail from "./summonerDetail.vue";

const store = assistStore()
const extraData:Ref<{rank:string,champImgs:string[]}[]> = ref([])
const active = ref(false)
const currentSumInfo = ref({name:'',level:'',summonerId:'',puuid:'',icon:0})

onMounted(async () => {
  for (const summoner of store.summonerInfo) {
    const rankHandler = await querySummonerRank(summoner.puuid)
    extraData.value.push({
      rank: `${rankHandler[0]} • ${rankHandler[1]}`,
      champImgs: await querySuperChampList(summoner.summonerId,6)
    })
  }
})

const getCurrentSum = (sumName:string,sumLevel:string,sumId:string,sumPuuid:string,sumIcon:number) => {
  currentSumInfo.value = {
    name: sumName,
    level: sumLevel,
    summonerId: sumId,
    puuid: sumPuuid,
    icon: sumIcon
  }
  console.log(currentSumInfo.value)
  active.value = true
}

const getImgUrl = (profileIconId:number) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIconId}.png`
}

const openWin = () => {
  cube.windows.obtainDeclaredWindow('matchHistory')
}
</script>

<style scoped>
.titleTag {
  height: 25px;
  font-size: 13px;
  width: 191px;
  justify-content: center;
}

.listFlex {
  display: flex;
  flex-wrap: wrap;
  gap: 7.5px;
}

.tipBottom {
  margin-top: 2px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
  border-radius: 20px;
  height: 40px;
  border: 1px dashed #dfdfdf;
}

.tipTag {
  width: 76.5px;
  font-size: 13px;
  justify-content: center;
  cursor: pointer;
}
</style>

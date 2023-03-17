<template>
  <n-list  :show-divider="false" class="listFlex">
    <n-list-item
      v-for="summoner in store.summonerInfo" style="padding: 5px">
      <n-space :size="[12,0]">
        <n-avatar
          :size="55"
          round
          :src="getImgUrl(summoner.profileIconId)"
          class="champImg"
          @click="getCurrentSum(summoner.name,summoner.extraData.rank,summoner.summonerId,summoner.puuid,summoner.profileIconId)"
        />
        <n-space vertical :size="[0,5]">
          <n-tag  class="titleTag" :bordered="false" type="success">{{ summoner.name }}</n-tag>
          <n-tag  class="titleTag" :bordered="false" type="info">
             {{ summoner.extraData.rank }}</n-tag>
        </n-space>
      </n-space>
      <n-space style="margin-top: 10px" justify="space-between">
        <n-avatar
          v-for="img in summoner.extraData.champImgs"
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
import {NSpace, NList, NListItem, NAvatar, NTag,NDrawer} from 'naive-ui'
import assistStore from "../../../store/assistStore";
import {ref} from "vue";
import SummonerDetail from "./summonerDetail.vue";

const store = assistStore()
const active = ref(false)
const currentSumInfo = ref({name:'',level:'',summonerId:'',puuid:'',icon:0})

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
.champImg {
  display: block;
  cursor: pointer;
  transition:  border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);
}
.champImg:hover {
  border-radius: 3px;
}
</style>

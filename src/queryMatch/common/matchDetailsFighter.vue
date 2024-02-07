<script setup lang="ts">
import {SumDetail, SummonerDetailInfo} from "@/queryMatch/utils/MatchDetail";
import {NGi, NGrid, NSpace,NTag} from "naive-ui";
import {Ref, ref} from "vue";
import MatchSumDetails from "@/queryMatch/common/matchSumDetails.vue";

const {teamOne,headerInfo,summonerId} = defineProps<{
  teamOne: SummonerDetailInfo[],
  headerInfo: string[],
  summonerId:number
}>()

const emits = defineEmits(['openDrawer'])
const isMatchDra = ref(false)
const curMatchDraData:Ref<null|SumDetail> = ref(null)

const showSumDetails = (isOne,index) => {
  emits('openDrawer',isOne,index)
}
</script>

<template>
  <n-grid class="bg-neutral-100 rounded" :cols="4">
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局日期</text>
        <text>{{ headerInfo[0] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局类型</text>
        <text>{{ headerInfo[2] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">开始时间</text>
        <text>{{ headerInfo[1] }}</text>
      </n-space>
    </n-gi>
    <n-gi>
      <n-space vertical align="center">
        <text class="text-gray-400">对局时长</text>
        <text>{{ headerInfo[3] }}分钟</text>
      </n-space>
    </n-gi>
  </n-grid>
    <n-space style="margin-top: 17px;" :size="[0,54.8]" justify="space-between">
      <div v-for="(summoner,index) in teamOne" >
        <n-space style="width: 290px;" @click="showSumDetails(true,index)" vertical>
          <match-sum-details :summoner="summoner" :summoner-id="summonerId"/>
          <div class="flex justify-between">
            <n-tag style="width: 82px;justify-content: center;height: 26px;" type="success"
                   :bordered="false" size="small">输出：{{summoner.totalDamageDealtToChampions}}</n-tag>
            <n-tag style="width: 82px;justify-content: center;height: 26px;" type="error"
                   :bordered="false" size="small">承伤：{{summoner.totalDamageTaken}}</n-tag>
            <n-tag style="width: 82px;justify-content: center;height: 26px;" type="warning"
                   :bordered="false" size="small">金币：{{summoner.goldEarned}}</n-tag>
          </div>
        </n-space>
      </div>
    </n-space>
</template>

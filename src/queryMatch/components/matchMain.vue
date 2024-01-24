<script setup lang="ts">
import MatchList from "./matchList.vue";
import {NCard} from "naive-ui"
import MatchContent from "../common/matchContent.vue";
import MatchDetails from "../utils/matchDetails";
import {onMounted, Ref, ref} from "vue";
import {ParticipantsInfo} from "@/queryMatch/utils/MatchDetail";

const {summonerId} = defineProps<{summonerId:number}>()
const parInfo:Ref<null|ParticipantsInfo> = ref(null)

const matchDetials = new MatchDetails()


const handleDetail = async (gameId: number) => {
  const gameDetail:null|ParticipantsInfo = await matchDetials.queryGameDetail(gameId,summonerId)
  if (gameDetail!==null){
    parInfo.value = gameDetail
  }
  console.log(gameDetail)
}

</script>

<template>
  <n-card
    class="shadow h-full" size="small" style="height: 596px;"
    content-style="padding:0 0 0 12px">
    <div class="flex">
      <match-list @change-detail="handleDetail"/>
      <div class="flex-grow p-3 ml-7" v-if="parInfo">
        <match-content
          :header-info="parInfo.headerInfo"
          :team-one="parInfo.teamOne"
          :team-two="parInfo.teamTwo"
          :summoner-id="summonerId"
        />
      </div>
    </div>
  </n-card>
</template>


<template>
  <div style="margin-top: 12px">
    <n-space vertical >
      <n-space>
        <n-tag :bordered="false" type="success">
          {{summonerHonor[0]}}
        </n-tag>
        <n-tag :bordered="false" type="warning">
          {{summonerHonor[1]}}
        </n-tag>
      </n-space>

      <n-list  >
        <n-scrollbar style="max-height: 175px">
          <n-list-item v-for="chapm in summonerChapmLevel">
            <n-space style="align-items: center">
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
                英雄熟练度 {{chapm[2]}}
              </n-tag>
            </n-space>
          </n-list-item>
        </n-scrollbar>
      </n-list>
    </n-space>
  </div>
</template>

<script>
import {
  NSpace, NTag, NList, NListItem,NAvatar,NScrollbar
} from 'naive-ui'
import {ref,onMounted} from "vue"
import {queryCurrentChapm, querySummonerHonorLevel} from "@/utils/render/renderLcu";

export default {
  name: "realPower",
  components: {NSpace, NTag, NList, NListItem,NAvatar,NScrollbar},
  setup(){
    let summonerHonor = ref([])
    let summonerChapmLevel = ref([])
    onMounted(async () => {
      const honorData = await querySummonerHonorLevel()
      if (honorData !=null){
        summonerHonor.value = honorData
        summonerChapmLevel.value = await queryCurrentChapm(0,15)
      }
    })
    return {
      summonerHonor,summonerChapmLevel
    }
  }
}
</script>

<style scoped>

</style>

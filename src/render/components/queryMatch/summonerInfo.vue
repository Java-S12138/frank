<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-space justify="space-between">
        <n-avatar
          round
          :bordered="false"
          :size="60"
          :src="summoner.summonerInfo.imgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display:block"
        />
        <n-space vertical :size="[2,9]">
          <n-tag type="success" style="width: 150px;justify-content: center"
                 :bordered="false" :round="true">
            {{summoner.summonerInfo.name}}
          </n-tag>
          <n-popover
            trigger="hover" :show-arrow="false" placement="bottom">
            <template #trigger>
              <n-tag type="warning" size="small"
                     style="width: 150px;justify-content: center;padding-top: 2px"
                     :bordered="false" :round="true">
                <n-space style="align-items: center">

                  <n-progress
                    type="line"
                    :show-indicator="false"
                    :percentage="parseInt((summoner.summonerInfo.xpSL/summoner.summonerInfo.xpNL)*100)"
                    status="warning"
                    processing
                    style="width: 85px;"
                    :height="10"
                  />
                  <span style="padding-top: 2px">{{parseInt((summoner.summonerInfo.xpSL/summoner.summonerInfo.xpNL)*100)}} %</span>
                </n-space>
              </n-tag>
            </template>
            <span>当前等级 {{summoner.summonerInfo.lv}}</span>
          </n-popover>
        </n-space>
      </n-space>
        <n-list style="margin-top: 8px">
          <n-list-item >
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth"
                     :round="false" size="large">
                单双排位
              </n-tag>

              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{summoner.rankData[0]}}
              </n-tag>
            </n-space>
          </n-list-item >
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth"
                     :round="false" size="large">
                灵活排位
              </n-tag>

              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{summoner.rankData[1]}}
              </n-tag>
            </n-space>
          </n-list-item>
          <n-list-item>
            <n-space justify="space-between">
              <n-tag type="success" :bordered="false" class="tagWidth"
                     :round="false" size="large">
                云顶排位
              </n-tag>

              <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                {{summoner.rankData[2]}}
              </n-tag>
            </n-space>
          </n-list-item>
        </n-list>
    </n-card>
    <n-card class="boxShadow" size="small" :content-style="'padding-right: 0px'"
            style="margin-top: 15.5px">
        <!--        召唤师绝活英雄展示-->
      <n-scrollbar style="max-height: 263px">
        <n-space vertical style="" :size="[2,16]" >
          <n-space v-if="summoner.superChampList.length !==0" :size="[20.5]"
            v-for="superChamp in summoner.superChampList"  class="alignCenter">
            <n-avatar
              :bordered="false"
              :size="40"
              :src="superChamp.champImgUrl"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display: block"
            />
            <n-space :size="[20.5]" >
              <n-tag size="small"  style="width:100px;"
                     type="success" :bordered="false" >
                熟练度: {{ superChamp.championPoints }}
              </n-tag>
              <n-tag size="small" type="warning" :bordered="false" style="">
                Lv: {{ superChamp.champLevel }}
              </n-tag>


            </n-space>
          </n-space>
          <n-space  v-else justify="center"><n-tag type="error" :bordered="false">当前召唤师英雄数据为空</n-tag></n-space>

        </n-space>
      </n-scrollbar>
    </n-card>
  </div>
</template>

<script>
export default {
  name: "summonerInfo"
}
</script>
<script setup>
import {
  NCard, NAvatar, NSpace, NTag, NPopover,
  NList, NListItem, NScrollbar, useMessage,NProgress
} from 'naive-ui'
import {onMounted} from "vue";
import {returnSummonerData} from "@/utils/render/queryMatchLcu";
import {appConfig} from "@/utils/main/config";
import {queryStore} from '../../store'
import {storeToRefs} from 'pinia'

const message = useMessage()
const store = queryStore()
const {querySummonerId,summoner,localSummoner} = storeToRefs(store)

onMounted(async () => {
  summoner.value = await returnSummonerData(appConfig.get('credentials'),'')
  localSummoner.value =summoner.value.summonerInfo.name

  querySummonerId.value = summoner.value.summonerInfo.summonerId
})

</script>

<style scoped>
@import url("../../assets/css/queryMatchCommon.css");
.mainCard {
  width: 256px;
}
.tagWidth {
  width: 85px;
  justify-content: center;
}
.secendCard {
  margin-top: 40px;
}
.alignCenter {
  align-items: center
}
</style>

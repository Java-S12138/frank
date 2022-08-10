<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small"
            :content-style="'padding:14px 12px 0px 16px'" style="height: 100%">
      <n-layout has-sider>
        <n-layout-sider  :width="189" >

          <n-list>
            <n-list-item v-for="match in matchList">
              <n-space>
                <n-avatar
                  :bordered="false"
                  :size="40"
                  :src="match.champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display:block"
                />
                <n-space vertical :size="[2,1.6]">
                  <n-space>
                    <n-tag size="small" type="success" v-if="match.isWin"
                           style="width: 68px;justify-content: center"
                           :bordered="false">{{match.kills}}-{{match.deaths}}-{{match.assists}}</n-tag>
                    <n-tag size="small" type="error" v-else
                           style="width: 68px;justify-content: center"
                           :bordered="false">{{match.kills}}-{{match.deaths}}-{{match.assists}}</n-tag>

                    <n-tag size="small" type="default" style="width: 30px;justify-content: center"
                           :bordered="false">{{match.matchTime}}</n-tag>
                  </n-space>
                  <p style="font-size: 12px;color: #9aa4af">{{match.queueId}}</p>
                </n-space>
              </n-space>
            </n-list-item>
          </n-list>

        </n-layout-sider>
        <n-layout>
          <n-layout-content >
            平山道
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-card>

  </div>
</template>

<script>
export default {
  name: "matchDetailed"
}
</script>

<script setup>
import {NCard,NLayout,NLayoutSider,NLayoutContent,NPagination,
  NAvatar, NSpace, NTag, NButton, NPopover,NInput,NBadge,
  NList, NListItem, NScrollbar, useMessage,NProgress} from "naive-ui";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia.esm-browser";
import {ref, watch} from "vue";
import {dealMatchHistory} from "@/utils/render/queryMatchLcu";
import {appConfig} from "@/utils/main/config";

const store = queryStore()
const {querySummonerId,begIndex,endIndex} = storeToRefs(store)
const matchList = ref([])
const credentials = appConfig.get('credentials')

watch(querySummonerId,async () => {
  begIndex.value = 0
  endIndex.value = 8
  const matchDict = await dealMatchHistory(credentials,querySummonerId.value,begIndex.value,endIndex.value)
  matchList.value =matchDict.simpleMatchList
  console.log('querySummonerId'+'监听执行了')
})

watch(begIndex,async () => {
  const matchDict = await dealMatchHistory(credentials,querySummonerId.value,begIndex.value,endIndex.value)
  matchList.value =matchDict.simpleMatchList
  console.log('begIndex'+'监听执行了')
})

</script>

<style scoped>
@import url("../../assets/css/queryMatchCommon.css");
.mainCard {
  width: 69.1vw;
}
</style>

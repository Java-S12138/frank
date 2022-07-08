<template>
  <div class="mainCard" >
        <n-card class="boxShadow" size="small">
          <n-avatar
            round
            :bordered="false"
            :size="60"
            :src="rankData[7]"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          />
          <n-space vertical :size="[2,10]">
            <div style="">
              <!--                昵称-->
              <n-tag type="success" :bordered="false" :round="true">
                {{ rankData[0] }}
              </n-tag>
              <!--                大区-->
              <n-tag type="success" style="float: right"
                     :bordered="false" :round="true">
                {{ rankData[1] }}
              </n-tag>
            </div>
              <n-space style="justify-content: space-between;" >
                <n-popover v-for="value in [0,2,4]"
                           trigger="hover" :show-arrow="false" placement="bottom">
                  <template #trigger>
                    <n-tag type="warning" :bordered="false" :round="true" size="small">
                      {{ carryData[value] }}
                    </n-tag>
                  </template>
                  {{ carryData[value+1] }}
                </n-popover>
              </n-space>
          </n-space>
        </n-card>

        <n-card class="boxShadow pointCard" size="small" >
          <n-space>
            <n-button dashed size="large" style=" color: #666F75;" @click = "switchButton = 1">
              S12季前赛
            </n-button>
            <n-button dashed size="large" style=" color: #666F75;
          margin-left: 15px" @click = "switchButton = 2">
              英雄熟练度
            </n-button>
          </n-space>
          <div v-if="switchButton == 1">
            <n-list  >
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" :round="false" size="large">
                  单双排位
                </n-tag>

                <n-tag type="warning" :bordered="false" :round="false" size="large" >
                  {{ rankData[2] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" :round="false" size="large">
                  灵活排位
                </n-tag>

                <n-tag type="warning" :bordered="false" :round="false" size="large" >
                  {{ rankData[3] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" :round="false" size="large">
                  云顶排位
                </n-tag>

                <n-tag type="warning" :bordered="false" :round="false" size="large" >
                  {{ rankData[4] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" :round="false" size="large">
                  国服排名
                </n-tag>

                <n-tag type="warning" :bordered="false" :round="false" size="large" >
                  {{ rankData[6] }}
                </n-tag>
              </n-space>
            </n-list-item>

          </n-list>
          </div>
          <div v-else-if="switchButton == 2">
            <real-power></real-power>
          </div>
        </n-card>
  </div>
</template>

<script>
import {ref, onMounted} from "vue"
import {ipcRenderer} from 'electron'
import router from '@/render/router'
import RealPower from './realPower.vue'
import {init} from '@/utils/render/getUserInfo'
import {serveArea} from '@/utils/render/lolDataList'
import {appConfig} from '@/utils/main/config'
import {mapNameFromUrl} from '@/utils/render/lolDataList'

import {NCard, NAvatar, NSpace, NTag, NModal,
  NInput, NButton, NSelect,NPopover,NList,NListItem,useMessage } from 'naive-ui'
import {querySummonerHonorLevel, returnRankData} from "@/utils/render/renderLcu";

export default {
  name: "appMain",
  components:{NCard,NAvatar,NSpace,NTag,NModal,RealPower,
    NInput,NButton,NSelect,NPopover,NList,NListItem
  },
  setup(){
    let rankData = ref([])
    let carryData = ref([])
    let switchButton = ref(1)

    const message = useMessage()

    onMounted(() => {
      // 监听是否获取到英雄联盟客户端信息
      ipcRenderer.once('client-starting',()=>{
        message.loading(
          '英雄联盟客户端启动中...'
        )
      })
      getDataLocal()
    })
    // 本地获取数据
    const getDataLocal = async () => {
      const allList = await returnRankData()
      if (allList == null){return}
      rankData.value = allList.rank
      carryData.value = allList.carry
    }
    return {
      rankData,carryData,switchButton,
    }
  }
}
</script>

<style scoped>
.mainCard {
  width: 90vw;
  display: flex;
  flex-direction: column;
}

.n-card {
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 10px;
  padding: 5px;
}

.n-avatar {
  float: left;
  margin-right: 15px;
  margin-top: 1px;
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}

.pointCard {
  margin-top: 37px;
  height: 300px;
}

</style>

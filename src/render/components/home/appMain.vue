<template>
  <div class="mainCard" >
        <n-card class="boxShadow" size="small">
          <n-avatar
            round
            :bordered="false"
            :size="60"
            :src="rankData[7]"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            @click="showModal=true"
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
          <n-button dashed size="large" style=" color: #666F75;" @click = "switchButton = 1">
            S12季前赛
          </n-button>
          <n-button dashed size="large" style=" color: #666F75;
          margin-left: 15px" @click = "switchButton = 2">
            综合实力
          </n-button>
          <div v-show="switchButton == 1">
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
          <div v-show="switchButton == 2">
            <real-power></real-power>
          </div>
        </n-card>

        <n-modal v-model:show="showModal" class="boxShadow">
          <n-card
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
            style="width: 360px; position: fixed; bottom: 330px"
          >
            <n-space vertical>
              <n-input v-model:value="userName" type="text" placeholder="请输入您的召唤师昵称"/>
              <div>
                <n-space>
                  <n-select v-model:value="userArea" filterable
                            :options="optionArea" style="width: 202px"/>
                  <n-button type="primary" @click="setUserInfo" :disabled="homeShowWay == 'local'" >
                    确定
                  </n-button>
                </n-space>
              </div>
            </n-space>
          </n-card>
        </n-modal>

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
import {returnRankData} from "@/utils/render/renderLcu";

export default {
  name: "appMain",
  components:{NCard,NAvatar,NSpace,NTag,NModal,RealPower,
    NInput,NButton,NSelect,NPopover,NList,NListItem
  },
  setup(){
    let rankData = ref([])
    let carryData = ref([])
    let userName = ref('')
    let userArea = ref('')
    let showModal = ref(false)
    let optionArea = serveArea
    let switchButton = ref(1)
    let homeShowWay = ref(appConfig.get('homeShowWay'))

    const message = useMessage()

    onMounted(() => {
      // 监听是否获取到英雄联盟客户端信息
      ipcRenderer.once('client-starting',()=>{
        message.loading(
          '英雄联盟客户端启动中...'
        )
      })
      if (homeShowWay.value =='web'){
        userName.value = appConfig.get('userInfo').name
        userArea.value = appConfig.get('userInfo').area
        getData()
      }else {
        userName.value = '本地获取数据不需要填写'
        userArea.value = 1
        getDataLocal()
      }

    })
    // 本地获取数据时
    const getDataLocal = async () => {
      const allList =await returnRankData()
      if (allList == null){
        return
      }
      rankData.value = allList.rank
      carryData.value = allList.carry
    }
    // 初始化界面,获取召唤师基本信息
    const getData = async () => {
      const allList = await init()
      rankData.value = allList.rank
      if (rankData.value[0] == '') {
        rankData.value = ['请点击左侧圆圈设置信息']
        // 提示错误信息
        if (userName.value !=''){
          message.error('召唤师不存在, 请重新输入')
        }
        return
      }
      rankData.value[7] = 'https://wegame.gtimg.com/g.26-r.c2d3c/helper/' +
        'lol/assis/images/resources/usericon/'+rankData.value[7].slice(rankData.value[7].length-8)
      carryData.value = allList.carry
      await adjustCarryData()
    }

    // 处理召唤师绝活英雄数据
    const adjustCarryData = async () => {
      for (let i = 0; i < 6; i+=2) {
        if (carryData.value[i].indexOf('png') == -1){
          carryData.value[i] = '接口异常'
        }else{
          let urlMapName = carryData.value[i]
          urlMapName = urlMapName.slice(50,-4)
          carryData.value[i] =mapNameFromUrl[urlMapName].label.length === 4 ?
            mapNameFromUrl[urlMapName].label : mapNameFromUrl[urlMapName].name
        }
      }
      carryData.value[5] = '英雄熟练度：' + carryData.value[5].slice(5)
    }

    // 设置召唤师信息,包含用户昵称和用户所在大区
    const setUserInfo = async () => {
      appConfig.set('userInfo', {
        'name': userName.value,
        'area': userArea.value
      })
      getData()
      showModal.value = false
      router.go(0)
    }

    return {
      rankData,carryData,userName,userArea,showModal,optionArea,switchButton,homeShowWay,
      setUserInfo
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

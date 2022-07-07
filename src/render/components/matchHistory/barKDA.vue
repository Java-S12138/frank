<template>
  <div>
    <n-space>
      <n-card class="boxShadow mainCard">
        <div>
        <v-chart style="margin-top: 10px" class="chart" :key="refresh" :option="
{
      title: {
        show: true,
        text: '召唤师 实力排行',
        subtext: '选取最近10场排位进行分析',
        textStyle: { //主标题文本样式
          fontFamily: 'bom',
          fontSize: 20,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        subtextStyle: {//副标题文本样式
          fontFamily: 'bom',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: echartsData.name
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: echartsData.data,
          type: 'bar',
          itemStyle: {
            emphasis: {
              barBorderRadius: 30
            },
            normal: {
              color: function(params) {
                      if (params.data>=120){
                        return appConfig.get('topHorse')
                      }else if (params.data>=110){
                        return appConfig.get('midHorse')
                      }else if(params.data>=100){
                        return appConfig.get('bottomHorse')
                      }else if (params.data<100){
                        return appConfig.get('trashHorse')
                      }
              },
              barBorderRadius: [5, 5, 0, 0],
              label: {//这里是设置label的样式
                show: true,
                textStyle: {
                  fontWeight: 'bolder',
                  fontSize: '15',
                  color: '#fff'
                }
              }
            },
          }
        },
      ]
    }"/></div>

        <n-space style="margin-left: 5px">
          <div style="display: flex;visibility: revert">
            <n-space>
              <n-tag :bordered="false" style="margin-top: 3px">
                上等马
              </n-tag>
              <n-color-picker :modes="['hex']" v-model:value="topHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('topHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>
              <n-tag :bordered="false" style="margin-top: 3px">
                中等马
              </n-tag>
              <n-color-picker :modes="['hex']" v-model:value="midHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('midHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>
              <n-tag :bordered="false" style="margin-top: 3px">
                下等马
              </n-tag>
              <n-color-picker :modes="['hex']" v-model:value="bottomHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('bottomHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>
              <n-tag :bordered="false" style="margin-top: 3px">
                小牛马
              </n-tag>
              <n-color-picker :modes="['hex']" v-model:value="trashHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('trashHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
          </div>
          <n-popover trigger="hover" placement="top-start">
            <template #trigger>
              <n-button type="info" size="small" style="margin-top: 3px;margin-left: 5px" :disabled = "isSend"
                        strong secondary @click="sendToChat(echartsData)">
                发送
              </n-button>
            </template>
            <span>发送匹马信息到聊天页面</span>
          </n-popover>
        </n-space>
        <div class="suspension">
          <n-space>
            <n-button
              text
              @click="handleMin" color="black">
              <n-icon size="25">
                <ChevronsDownLeft/>
              </n-icon>
            </n-button>

            <n-popconfirm @positive-click="toHomePage" :show-icon="false"
                          negative-text="取消" positive-text="确认">
              <template #trigger>
                <n-button text circle color="black" >
                  <n-icon size="24">
                    <ArrowBackUp/>
                  </n-icon>
                </n-button>
              </template>
              不要轻易返回首页<br>避免不必要的Bug发生<br>如果仍要返回请点击确认
            </n-popconfirm>

            <n-popover :show-arrow="false" trigger="hover" :delay="1000">
              <template #trigger>
                <n-icon size="24" v-mouse-drag="handleChangePosition">
                  <Hanger/>
                </n-icon>
              </template>
              移动窗口位置
            </n-popover>
          </n-space>
        </div>
      </n-card>
    </n-space>
  </div>
</template>

<script>
import VChart from "vue-echarts";
import {
  NCard, NAvatar, NSpace, NTag, NIcon,
  NButton, NColorPicker, NPopover,NPopconfirm
} from 'naive-ui'
import {onMounted, ref} from "vue"
import {appConfig} from "@/utils/main/config"
import {ChevronsDownLeft, ArrowBackUp, Hanger} from '@vicons/tabler'
import {ipcRenderer} from "electron"
import router from "@/render/router"
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {sendMessageToChat} from "@/utils/main/lcu";

export default ({
  name: "barKDA",
  components: {
    VChart, NCard, NAvatar, NSpace, NTag, NIcon,NPopconfirm,
    NButton, NColorPicker, NPopover, ChevronsDownLeft, ArrowBackUp, Hanger
  },
  setup() {
    const store = useStore()
    const {echartsData} = storeToRefs(store)
    let refresh = ref(1)
    let isSend = ref(false) // 是否已经发送匹马信息 如果发送了 就不能再次发送
    let topHorse = ref(appConfig.get("topHorse"))
    let midHorse = ref(appConfig.get("midHorse"))
    let bottomHorse = ref(appConfig.get("bottomHorse"))
    let trashHorse = ref(appConfig.get("trashHorse"))

    onMounted(() => {
      let colorTitle = document.querySelectorAll('.n-color-picker-trigger__value')
      for (const colorTitleElement of colorTitle) {
        colorTitleElement.remove()
      }
    })
    const handleChangePosition = (pos) => {
      ipcRenderer.send('move-main', {
        x: pos.x,
        y: pos.y
      })
    }
    const toHomePage = () => {
      router.back()
      ipcRenderer.send('to-mainWindow')
    }
    const handleMin = () => {
      ipcRenderer.send('mainwin-min')
    }

    const sendToChat = (summonerData) => {
      let sendMessage = 'Powered By Java_S \n'
      for (let i = 0; i < summonerData.name.length; i++) {
          let sendInfo = `${summonerData['name'][i]}: [ ${summonerData['horse'][i]} ]  评分:${summonerData['data'][i]}
          最近战绩:${summonerData['kdaHistory'][i]}`
          sendMessage += sendInfo + '\n'+'--------------------------------------------------------------------------------'+'\n'
      }
      if (appConfig.get('isRecommend')){
        sendMessage += 'Frank 一款全新的LOL助手软件 永久免费\n秒选英雄|战绩查询|符文配置|国服数据\n了解更多功能: https://cdn.syjun.vip/frank.html'
      }

      sendMessageToChat(appConfig.get('credentials'),sendMessage)
      isSend.value = true
    }

    return {
      appConfig, refresh, topHorse, midHorse, bottomHorse, trashHorse,echartsData,isSend,
      handleChangePosition, toHomePage, handleMin, sendToChat
    }
  }
})
</script>

<style scoped>
.chart {
  height: 450px;
  width: 670px;
}

.mainCard {
  margin: 10px;
  border-radius: 10px;
  height: 556px;
  width: 720px;
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}

.pickerWidth {
  width: 70px;
  margin-right: 10px;
}

.suspension {
  position: absolute;
  top: 30px;
  right: 25px;
}
</style>

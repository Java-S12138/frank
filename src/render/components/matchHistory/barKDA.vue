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
        subtext: '选取最近5场本局游戏模式进行分析',
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
        data: currentEchartData.name
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: currentEchartData.data,
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

        <n-space justify="space-between">
            <n-space>
              <n-popconfirm
                @positive-click="changeHorseType('top',topHorseType)"
                :show-icon="false" positive-text="修改" negative-text="取消"
              >
                <template #trigger>
                  <n-tag :bordered="false" style="margin-top: 3px">
                    {{horseType.top}}
                  </n-tag>
                </template>
                <n-input v-model:value="topHorseType"
                         type="text" style="width: 104px" />
              </n-popconfirm>

              <n-color-picker :modes="['hex']" v-model:value="topHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('topHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>

              <n-popconfirm
                @positive-click="changeHorseType('mid',midHorseType)"
                :show-icon="false" positive-text="修改" negative-text="取消"
              >
                <template #trigger>
                  <n-tag :bordered="false" style="margin-top: 3px">
                    {{horseType.mid}}
                  </n-tag>
                </template>
                <n-input v-model:value="midHorseType"
                         type="text" style="width: 104px" />
              </n-popconfirm>

              <n-color-picker :modes="['hex']" v-model:value="midHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('midHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>

              <n-popconfirm
                @positive-click="changeHorseType('bot',botHorseType)"
                :show-icon="false" positive-text="修改" negative-text="取消"
              >
                <template #trigger>
                  <n-tag :bordered="false" style="margin-top: 3px">
                    {{horseType.bot}}
                  </n-tag>
                </template>
                <n-input v-model:value="botHorseType"
                         type="text" style="width: 104px" />
              </n-popconfirm>
              <n-color-picker :modes="['hex']" v-model:value="bottomHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('bottomHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
            <n-space>
              <n-popconfirm
                @positive-click="changeHorseType('trash',trashHorseType)"
                :show-icon="false" positive-text="修改" negative-text="取消"
              >
                <template #trigger>
                  <n-tag :bordered="false" style="margin-top: 3px">
                    {{horseType.trash}}
                  </n-tag>
                </template>
                <n-input v-model:value="trashHorseType"
                         type="text" style="width: 104px" />
              </n-popconfirm>
              <n-color-picker :modes="['hex']" v-model:value="trashHorse"
                              :actions="['confirm']"
                              @confirm="(value) => {
                                appConfig.set('trashHorse',value)
                                refresh +=1
                              }"
                              class="pickerWidth"/>
            </n-space>
          <n-popconfirm :show-icon="false" @positive-click="sendToChat"
                        negative-text="取消" positive-text="确认"
          >
            <template #trigger>
              <n-button type="info" size="small" style="margin-top: 3px;margin-left: 5px"
                        strong secondary >
                发送
              </n-button>
            </template>
            <n-checkbox-group :value="summonerName"  @update:value="handleUpdateValue"  >
              <n-space vertical item-style="display: flex" >
                <n-checkbox
                  v-for="summoner in currentEchartData.name"
                  :value="summoner" :label="summoner" />
              </n-space>
            </n-checkbox-group>
          </n-popconfirm>
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
              是否要返回首页
            </n-popconfirm>

            <n-popover :show-arrow="false" trigger="hover" :delay="1000">
              <template #trigger>
                <n-icon size="24" v-mouse-drag="handleChangePosition">
                  <Ballon/>
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
  NCard, NAvatar, NSpace, NTag, NIcon,NInput,
NButton, NColorPicker, NPopover,NPopconfirm,NCheckbox,NCheckboxGroup
} from 'naive-ui'
import {onMounted, ref,watch} from "vue"
import {appConfig} from "@/utils/main/config"
import {ChevronsDownLeft, ArrowBackUp, Ballon} from '@vicons/tabler'
import {ipcRenderer} from "electron"
import router from "@/render/router"
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {sendMessageToChat} from "@/utils/main/lcu";

export default ({
  name: "barKDA",
  components: {
    VChart, NCard, NAvatar, NSpace, NTag, NIcon,NPopconfirm,NInput,
    NButton, NColorPicker, NPopover, ChevronsDownLeft, ArrowBackUp, Ballon,NCheckbox,NCheckboxGroup
  },
  setup() {
    const store = useStore()
    const {echartsData,enemyEchartsData,currentTeam,currentEchartData} = storeToRefs(store)
    let refresh = ref(1)
    let topHorse = ref(appConfig.get("topHorse"))
    let midHorse = ref(appConfig.get("midHorse"))
    let bottomHorse = ref(appConfig.get("bottomHorse"))
    let trashHorse = ref(appConfig.get("trashHorse"))
    const horseType = ref(appConfig.get('horseType'))
    let topHorseType = ref(horseType.value.top)
    let midHorseType = ref(horseType.value.mid)
    let botHorseType = ref(horseType.value.bot)
    let trashHorseType = ref(horseType.value.trash)

    const summonerName = ref([])

    watch(currentTeam,() => {
      currentEchartData.value = currentTeam.value === 1 ? echartsData.value :enemyEchartsData.value
    })

    onMounted(() => {
      let colorTitle = document.querySelectorAll('.n-color-picker-trigger__value')
      for (const colorTitleElement of colorTitle) {
        colorTitleElement.remove()
      }

    })
    const handleChangePosition = (pos) => {
      ipcRenderer.send('move-main', {
        x: pos.x,
        y: pos.y,
        isWindow:'horse'
      })
    }
    const toHomePage = () => {
      router.back()
      ipcRenderer.send('to-mainWindow')
    }
    const handleMin = () => {
      ipcRenderer.send('mainwin-min')
    }

    const sendToChat = () => {
      let sendMessage = 'Powered By Frank \n'
      for (const summonerDatum of summonerName.value) {
        const currentSummonerIndex = echartsData.value.name.indexOf(summonerDatum)
            let sendInfo = `${summonerDatum}: [ ${echartsData.value['horse'][currentSummonerIndex]} ] 评分:${echartsData.value['data'][currentSummonerIndex]} 最近战绩:${echartsData.value['kdaHistory'][currentSummonerIndex]}`
            sendMessage += sendInfo + '\n'
      }
      if (appConfig.get('isRecommend')){
        sendMessage += 'Frank 一款全新的LOL助手软件 永久免费\n秒选英雄|战绩查询|符文配置|国服数据\n了解更多功能: https://cdn.syjun.vip/frank.html'
      }
      if (sendMessage.length >18){
        sendMessageToChat(appConfig.get('credentials'),sendMessage)
      }
    }
    // 多选框组,数据改变
    const handleUpdateValue = (value) => {
      summonerName.value = value
    }
    // 改变马匹类型
    const changeHorseType = (type,horse) => {
      if (type === 'top'){
        appConfig.set('horseType.top',horse)
        location.reload()
      }else if (type === 'mid'){
        appConfig.set('horseType.mid',horse)
        location.reload()
      }else if (type === 'bot'){
        appConfig.set('horseType.bot',horse)
        location.reload()
      }else if (type === 'trash'){
        appConfig.set('horseType.trash',horse)
        location.reload()
      }
    }

    return {
      appConfig, refresh, topHorse, midHorse, bottomHorse,currentTeam,enemyEchartsData,currentEchartData,
      trashHorse,summonerName,horseType,topHorseType,midHorseType,botHorseType,trashHorseType,
      handleChangePosition, toHomePage, handleMin, sendToChat,handleUpdateValue,changeHorseType
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
  width: 722px;
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}

.pickerWidth {
  width: 50px;
}

.suspension {
  position: absolute;
  top: 30px;
  right: 25px;
}
.n-popconfirm__action {
  justify-content: space-between;
}
</style>

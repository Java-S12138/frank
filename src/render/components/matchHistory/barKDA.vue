<template>
  <div>
    <n-space>
      <n-card class="boxShadow mainCard">
        <div>
          <v-chart style="margin-top: 10px"  @click="onClick" class="chart" :key="refresh" :option="
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
    }"/>
        </div>

        <n-space justify="space-between">
          <n-space>
            <n-popconfirm
              @positive-click="changeHorseType('top',topHorseType)"
              :show-icon="false" positive-text="修改" negative-text="取消"
            >
              <template #trigger>
                <n-tag :bordered="false" style="margin-top: 3px">
                  {{ horseType.top }}
                </n-tag>
              </template>
              <n-input v-model:value="topHorseType"
                       type="text" style="width: 104px"/>
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
                  {{ horseType.mid }}
                </n-tag>
              </template>
              <n-input v-model:value="midHorseType"
                       type="text" style="width: 104px"/>
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
                  {{ horseType.bot }}
                </n-tag>
              </template>
              <n-input v-model:value="botHorseType"
                       type="text" style="width: 104px"/>
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
                  {{ horseType.trash }}
                </n-tag>
              </template>
              <n-input v-model:value="trashHorseType"
                       type="text" style="width: 104px"/>
            </n-popconfirm>
            <n-color-picker :modes="['hex']" v-model:value="trashHorse"
                            :actions="['confirm']"
                            @confirm="(value) => {
                                appConfig.set('trashHorse',value)
                                refresh +=1
                              }"
                            class="pickerWidth"/>
          </n-space>

          <n-popover :show-arrow="false" style="bottom: 5px"
                     trigger="click" :show="sendPopover">
            <template #trigger>
              <n-button type="info" size="small" style="margin-top: 3px;margin-left: 5px"
                        strong secondary @click="sendPopover = !sendPopover">
                <p v-if="sendPopover === false">发送</p>
                <p v-else>取消</p>
              </n-button>
            </template>
            <n-space vertical>
              <n-checkbox-group :value="summonerName" @update:value="handleUpdateValue">
                <n-space vertical item-style="display: flex">
                  <n-checkbox
                    v-for="summoner in currentEchartData.name"
                    :value="summoner" :label="summoner"/>
                </n-space>
              </n-checkbox-group>
              <n-space justify="space-between">
                <n-button size="small" type="success" secondary  @click="allSelect">
                  <p v-if="summonerName.length ===0">全选</p>
                  <p v-else>归零</p>
                </n-button>
                <n-button size="small" type="success" @click="sendToChat">确定</n-button>
              </n-space>
            </n-space>
          </n-popover>
        </n-space>

        <div class="suspension">
          <n-space>
            <n-button
              text
              @click="() => {pageCount=1}" color="black">
              <n-icon size="25">
                <PictureInPictureTop/>
              </n-icon>
            </n-button>

            <n-button
              text
              @click="handleMin" color="black">
              <n-icon size="25">
                <ChevronsDownLeft/>
              </n-icon>
            </n-button>

            <n-popconfirm @positive-click="closeWindow" :show-icon="false"
                          negative-text="取消" positive-text="确认">
              <template #trigger>
                <n-button text circle color="black">
                  <n-icon size="24">
                    <circle-x/>
                  </n-icon>
                </n-button>
              </template>
              是否关闭当前页面
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

<script setup>
import VChart from "vue-echarts";
import {
  NCard, NSpace, NTag, NIcon, NInput,
  NButton, NColorPicker, NPopover, NPopconfirm, NCheckbox, NCheckboxGroup
} from 'naive-ui'
import {onMounted, ref} from "vue"
import {appConfig} from "@/utils/main/config"
import {ChevronsDownLeft, CircleX, Ballon,PictureInPictureTop} from '@vicons/tabler'
import {ipcRenderer} from "electron"
import {matchStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {sendMessageToChat} from "@/utils/main/lcu";

const store = matchStore()
const {echartsData, enemyEchartsData, currentTeam, currentEchartData,summonerInfo,pageCount} = storeToRefs(store)
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
const sendPopover = ref(false)
const emits = defineEmits(['summonerId','changePage'])

const summonerName = ref([])

onMounted(() => {
  let colorTitle = document.querySelectorAll('.n-color-picker-trigger__value')
  for (const colorTitleElement of colorTitle) {
    colorTitleElement.remove()
  }

})
const handleChangePosition = (pos) => {
  ipcRenderer.send('move-match-history-window', {
    x: pos.x,
    y: pos.y,
  })
}
const closeWindow = () => {
  ipcRenderer.send('close-match-history-window')
}
const handleMin = () => {
  ipcRenderer.send('match-history-window-min')
}
const sendToChat = () => {
  if (summonerName.value.length ===0){sendPopover.value = !sendPopover.value; return}
  let sendMessage = 'Powered By Frank \n'
  for (const summonerDatum of summonerName.value) {
    const currentSummonerIndex = echartsData.value.name.indexOf(summonerDatum)
    let sendInfo = `${summonerDatum}: [ ${echartsData.value['horse'][currentSummonerIndex]} ] score:${echartsData.value['data'][currentSummonerIndex]} recent record:${echartsData.value['kdaHistory'][currentSummonerIndex]}`
    sendMessage += sendInfo + '\n'
  }
  if (sendMessage.length > 18) {
    sendMessageToChat(appConfig.get('credentials'), sendMessage)
  }
  sendPopover.value = !sendPopover.value
}
// 多选框组全选按钮
const allSelect = () => {
  if (summonerName.value.length === 0){
    summonerName.value=currentEchartData.value.name
  }else {
    summonerName.value = []
  }
}

// 多选框组,数据改变
const handleUpdateValue = (value) => {
  summonerName.value = value
}
// 改变马匹类型
const changeHorseType = (type, horse) => {
  if (type === 'top') {
    appConfig.set('horseType.top', horse)
    location.reload()
  } else if (type === 'mid') {
    appConfig.set('horseType.mid', horse)
    location.reload()
  } else if (type === 'bot') {
    appConfig.set('horseType.bot', horse)
    location.reload()
  } else if (type === 'trash') {
    appConfig.set('horseType.trash', horse)
    location.reload()
  }
}

function onClick() {
  const index = arguments[0].dataIndex
  emits('summonerId', {summonerId:currentEchartData.value.summonerId[index],
    name:currentEchartData.value.name[index]})
}
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

.pickerWidth {
  width: 50px;
}

.suspension {
  position: absolute;
  top: 7px;
  right: 3px;
}

.n-popconfirm__action {
  justify-content: space-between;
}
</style>

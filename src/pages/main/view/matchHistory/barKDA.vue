<template>
  <div>
    <n-space>
      <n-card class="boxShadow mainCard">
<div>
          <v-chart style="margin-top: 10px"  @click="onClick" class="chart" :key="refresh" :option="{
      title: {
        show: true,
        text: '召唤师 实力排行',
        subtext: '选取最近5场本局游戏模式进行分析',
        textStyle: { //主标题文本样式
          fontSize: 20,
          fontFamily: 'FZBenMoYueYiTiS',
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        subtextStyle: {//副标题文本样式
          fontSize: 12,
          fontFamily: 'FZBenMoYueYiTiS',
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
        data: currentEchartData.name,
          axisLabel: {
            fontFamily: 'FZBenMoYueYiTiS'
        }
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
            color: function(params) {
                    if (params.data>=120){
                      return config.horseColor.topHorse
                    }else if (params.data>=110){
                      return config.horseColor.midHorse
                    }else if(params.data>=100){
                      return config.horseColor.bottomHorse
                    }else if (params.data<100){
                      return config.horseColor.trashHorse
                    }
            },
            borderRadius: [5, 5, 0, 0],
          },
          //这里是设置label的样式
          label: {
            position: 'inside',
            show: true,
              fontWeight: 'normal',
              fontSize: '15',
              color: '#fff',
              fontFamily: 'FZBenMoYueYiTiS',
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
                <n-tag style="height:34px">
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
                <n-tag  style="height:34px">
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
                <n-tag style="height:34px">
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
                <n-tag  style="height:34px">
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
                <n-icon size="24" >
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

<script setup lang="ts">
import VChart from "vue-echarts";
import {
  NCard, NSpace, NTag, NIcon, NInput,
  NButton, NColorPicker, NPopover, NPopconfirm, NCheckbox, NCheckboxGroup
} from 'naive-ui'
import {onMounted, ref} from "vue"
import {ChevronsDownLeft, CircleX, Ballon,PictureInPictureTop} from '@vicons/tabler'
import {matchStore} from "../../store";
import {storeToRefs} from "pinia";

const config = JSON.parse(String(localStorage.getItem('config')))
const store = matchStore()

const {currentEchartData,summonerInfo,pageCount} = storeToRefs(store)
const refresh = ref(1)
const topHorse = ref(config.horseColor.topHorse)
const midHorse = ref(config.horseColor.midHorse)
const bottomHorse = ref(config.horseColor.bottomHorse)
const trashHorse = ref(config.horseColor.trashHorse)
const horseType = ref(config.horseType)
const topHorseType = ref(horseType.value.top)
const midHorseType = ref(horseType.value.mid)
const botHorseType = ref(horseType.value.bot)
const trashHorseType = ref(horseType.value.trash)
const sendPopover = ref(false)
const summonerName = ref([])

const emits = defineEmits(['summonerId','changePage'])

onMounted(() => {
  let colorTitle = document.querySelectorAll('.n-color-picker-trigger__value')
  // @ts-ignore
  for (const colorTitleElement of colorTitle) {
    colorTitleElement.remove()
  }

})
const handleChangePosition = () => {
  console.log('handleChangePosition')
}
const closeWindow = async () => {
  cube.windows.close((await cube.windows.getCurrentWindow()).id)
}
const handleMin = () => {
  console.log('handleMin')
}
const sendToChat = () => {
  console.log('sendToChat')
  // if (summonerName.value.length ===0){sendPopover.value = !sendPopover.value; return}
  // let sendMessage = 'Powered By Frank \n'
  // for (const summonerDatum of summonerName.value) {
  //   const currentSummonerIndex = echartsData.value.name.indexOf(summonerDatum)
  //   let sendInfo = `${summonerDatum}: [ ${echartsData.value['horse'][currentSummonerIndex]} ] score:${echartsData.value['data'][currentSummonerIndex]} recent record:${echartsData.value['kdaHistory'][currentSummonerIndex]}`
  //   sendMessage += sendInfo + '\n'
  // }
  // if (sendMessage.length > 18) {
  //   sendMessageToChat(appConfig.get('credentials'), sendMessage)
  // }
  // sendPopover.value = !sendPopover.value
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
const handleUpdateValue = (value:any) => {
  summonerName.value = value
}

// 改变马匹类型共用函数
const changeHorse = (type:string, horse:string) => {
  config.horseType[type] = horse
  localStorage.setItem('config',JSON.stringify(config))
  location.reload()
}

// 改变马匹类型
const changeHorseType = (type:string, horse:string) => {
  if (type === 'top') {
    changeHorse('top',horse)
  } else if (type === 'mid') {
    changeHorse('mid',horse)
  } else if (type === 'bot') {
    changeHorse('bot',horse)
  } else if (type === 'trash') {
    changeHorse('trash',horse)
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

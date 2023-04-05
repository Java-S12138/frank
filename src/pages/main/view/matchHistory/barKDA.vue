<template>
  <div>
    <n-space>
      <n-card class="boxShadow mainCard">
        <v-chart style="margin-top: 10px"
                 @click="onClick" class="chart" :key="refresh" :option="option"/>
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
                            @confirm="(value) => {changeBarColor(value,'topHorse')}"
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
                            @confirm="(value) => {changeBarColor(value,'midHorse')}"
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
                            @confirm="(value) => {changeBarColor(value,'bottomHorse')}"
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
                            @confirm="(value) => {changeBarColor(value,'trashHorse')}"
                            class="pickerWidth"/>
          </n-space>

          <n-button type="info" size="small" style="height:34px ;"
                    strong secondary @click="sendToChat">
            复制发送
          </n-button>

        </n-space>

        <n-modal v-model:show="sendPopover" :auto-focus="false">
          <n-card
            style="width: 600px"
            :bordered="false"
            size="medium"
            role="dialog"
            aria-modal="true"
          >
            <n-space :size="[0,20]">
              <n-space style="align-items: center"
                       v-for="index in [0,1,2,3,4]">
                <n-input
                  v-model:value="summonerMatchList[index]"
                  autosize
                  type="textarea"
                  placeholder="基本的 Textarea"
                  style="width: 450px;"
                />

                <n-button type="success" dashed @click="copyContent(summonerMatchList[index])">复制内容</n-button>
              </n-space>
            </n-space>

          </n-card>
        </n-modal>

        <div class="suspension">
          <n-space>
            <n-tag :bordered="false"
                   style="font-size: 12px">点击右侧图标可查看队友战绩</n-tag>
            <n-button
              text
              @click="() => {pageCount=1}" class="textButtonColor">
              <n-icon size="25">
                <PictureInPictureTop/>
              </n-icon>
            </n-button>

            <n-button
              text
              @click="handleMin" class="textButtonColor">
              <n-icon size="25">
                <ChevronsDownLeft/>
              </n-icon>
            </n-button>

            <n-popconfirm @positive-click="closeWindow" :show-icon="false"
                          negative-text="取消" positive-text="确认">
              <template #trigger>
                <n-button text circle class="textButtonColor">
                  <n-icon size="24">
                    <circle-x/>
                  </n-icon>
                </n-button>
              </template>
              是否关闭当前页面
            </n-popconfirm>

            <n-popover :show-arrow="false"  trigger="hover" :delay="1000">
              <template #trigger>
                <n-icon size="24"  class="textButtonColor" @mousedown="handleChangePosition">
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
  NCard, NSpace, NTag, NIcon, NInput,useMessage,
  NButton, NColorPicker, NPopover, NPopconfirm,NModal
} from 'naive-ui'
import {onMounted, reactive, Ref, ref} from "vue"
import {ChevronsDownLeft, CircleX, Ballon,PictureInPictureTop} from '@vicons/tabler'
import {matchStore} from "../../store";
import {storeToRefs} from "pinia";

const message = useMessage()
const config = JSON.parse(<string>(localStorage.getItem('config')))
const store = matchStore()

const {echartsData,summonerInfo,pageCount}:any = storeToRefs(store)
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
const summonerMatchList:Ref<any[]> = ref([])

const option = reactive({
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
    data: echartsData.value.name,
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
      data: echartsData.value.data,
      type: 'bar',
      itemStyle: {
        color: function(params:any){
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
})

const emits = defineEmits(['summonerId','changePage'])

onMounted(() => {
  let colorTitle = document.querySelectorAll('.n-color-picker-trigger__value')
  // @ts-ignore
  for (const colorTitleElement of colorTitle) {
    colorTitleElement.remove()
  }

})
const handleChangePosition = () => {
  cube.windows.current.dragMove()
}
const closeWindow = async () => {
  cube.windows.close((await cube.windows.getCurrentWindow()).id)
}
const handleMin =async () => {
  cube.windows.minimize( (await cube.windows.getCurrentWindow()).id)
}
const sendToChat = () => {
  sendPopover.value = true
  summonerMatchList.value.length = 0
  for (const summonerDatum of echartsData.value.name) {
    const currentSummonerIndex = echartsData.value.name.indexOf(summonerDatum)
    let sendInfo = `${summonerDatum}: [ ${echartsData.value['horse'][currentSummonerIndex]} ] 评分:${echartsData.value['data'][currentSummonerIndex]} 最近战绩:${echartsData.value['kdaHistory'][currentSummonerIndex]}`
    summonerMatchList.value.push(sendInfo)
  }
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
  emits('summonerId', {summonerId:echartsData.value.summonerId[index],
    name:echartsData.value.name[index]})
}

const changeBarColor = (value:string,type:string) => {
  config.horseColor[type] = value
  localStorage.setItem('config',JSON.stringify(config))
  refresh.value +=1
}

const copyContent = (content:string) => {
  cube.utils.placeOnClipboard(content)
  message.success('复制召唤师信息成功 !')
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

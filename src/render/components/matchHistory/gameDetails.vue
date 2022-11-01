<template>
  <div>
    <n-card class="mainCard boxShadow" content-style="padding-top:30px">
      <n-space vertical>
        <n-grid :cols="7">
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">对局日期</span>
              <span style="font-size: 15px">{{titleList[0]}}</span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">对局类型</span>
              <span style="font-size: 15px">{{titleList[2]}}</span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">开始时间</span>
              <span style="font-size: 15px">{{titleList[1]}}</span>
            </n-space>
          </n-gi>

          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">数据显示</span>
              <n-tag :bordered="false" type="success" style="cursor:pointer"
                     @click="changeShowWay">{{otherDataText}}</n-tag>
            </n-space>
          </n-gi>

          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">双方比分</span>
              <span style="font-size: 15px;display: flex">
                <p style="color: #d03050">{{titleList[4]}}</p>  &nbsp;/&nbsp;
                <p style="color: #4098fc">{{titleList[5]}}</p>
              </span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">对局时长</span>
              <span style="font-size: 15px">{{titleList[3]}}分钟</span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">经济差距</span>
              <span style="font-size: 15px;display: flex">
                <p v-if="titleList[6]>titleList[7]" style="color: #d03050">{{ (titleList[6]-titleList[7] ).toFixed(1)}} K</p>
                <p v-else style="color: #4098fc">{{ (titleList[7]-titleList[6] ).toFixed(1)}} K</p>
              </span>
            </n-space>
          </n-gi>
        </n-grid>
      </n-space>
      <n-space vertical  style="margin-top: 25px" :size="[2,25]" >
        <!--        队伍一-->
        <n-space justify="space-around" v-for="(singleData,index) in summonersDataList">
          <n-space vertical :size="[2,0]">
            <n-space>
              <n-badge :value="singleData[0].champLevel" type="error" v-if="singleData[0].teamType == 100">
                <!--              头像-->
                <n-avatar
                  round
                  :bordered="false"
                  :size="50"
                  :src="singleData[0].champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block;margin-right: -6px"
                />
              </n-badge>
              <n-badge :value="singleData[0].champLevel" type="info" v-else>
                <!--              头像-->
                <n-avatar
                  round
                  :bordered="false"
                  :size="50"
                  :src="singleData[0].champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block;margin-right: -6px"
                />
              </n-badge>
              <!--            物品-->
              <n-space vertical :size="[10,1]" style="margin-left: 8px">
                <n-space :size="[5]">
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item0" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item1" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item2" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item3" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item4" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item5" >
                  <img class="itemClass" :onerror="slnotimg" :src="singleData[0].item6" >
                </n-space>
                <n-space>
                  <!--                召唤师技能-->
                  <n-space :size="[5]" style="margin-top: 1px">
                    <img class="itemClassSecond" :src="singleData[0].spell1Id" alt="">
                    <img class="itemClassSecond" :src="singleData[0].spell2Id" alt="">
                  </n-space>
                  <!--                召唤师昵称-->
                  <n-ellipsis style="max-width: 110px;color: #9AA4AF;font-size: 13px;width: 110px;"
                              v-if="singleData[0].name!=currentSummonerName">
                    {{ singleData[0].name }}
                  </n-ellipsis>
                  <n-ellipsis style="max-width: 110px;color: #18a058;font-size: 13px;width: 110px;"
                              v-else>
                    {{ singleData[0].name }}
                  </n-ellipsis>
                  <div style="color: #666F75;font-size: 13px">
                    {{singleData[0].kills}}/{{singleData[0].deaths}}/{{singleData[0].assists }}
                  </div>
                </n-space>
              </n-space>
            </n-space>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <p class="scale-in-hor-left"  :key="otherDataCount"
                   :style="'width:'+otherDataPercent[index][0][otherDataKey]"  style="height: 7px;border-radius: 2px;
            background-color:#ff6666;"></p>
              </template>
              <span>{{otherDataText}}: {{otherData[index][0][otherDataKey]}}</span>
            </n-popover>

          </n-space>
          <!--       中间数据展示 -->

          <!--        队伍二-->
          <n-space >
            <n-space vertical  :size="[2,0]">
              <n-space style="flex-direction: row-reverse">
                <n-badge :value="singleData[1].champLevel" type="error" v-if="singleData[1].teamType == 100">
                  <!--              头像-->
                  <n-avatar
                    round
                    :bordered="false"
                    :size="50"
                    :src="singleData[1].champImgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    style="display: block;margin-right: -6px"
                  />
                </n-badge>
                <n-badge :value="singleData[1].champLevel" type="info" v-else>
                  <!--              头像-->
                  <n-avatar
                    round
                    :bordered="false"
                    :size="50"
                    :src="singleData[1].champImgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    style="display: block;margin-right: -6px"
                  />
                </n-badge>
                <!--            物品-->
                <n-space vertical :size="[10,1]" style="margin-right: 8px">
                  <n-space :size="[5]">
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item0" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item1" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item2" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item3" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item4" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item5" >
                    <img class="itemClass" :onerror="slnotimg" :src="singleData[1].item6" >

                  </n-space>
                  <n-space>
                    <!--                召唤师技能-->
                    <n-space :size="[5]" style="margin-top: 1px">
                      <img class="itemClassSecond" :src="singleData[1].spell1Id" alt="">
                      <img class="itemClassSecond" :src="singleData[1].spell2Id" alt="">

                    </n-space>
                    <!--                召唤师昵称-->
                    <n-ellipsis style="max-width: 110px;color: #9AA4AF;font-size: 13px;width: 110px;"
                                v-if="singleData[1].name!=currentSummonerName">
                      {{ singleData[1].name }}
                    </n-ellipsis>
                    <n-ellipsis style="max-width: 110px;color: #18a058;font-size: 13px;width: 110px;"
                                v-else>
                      {{ singleData[1].name }}
                    </n-ellipsis>
                    <div style="color: #666F75;font-size: 13px">
                      {{singleData[1].kills}}/{{singleData[1].deaths}}/{{singleData[1].assists }}
                    </div>
                  </n-space>
                </n-space>
              </n-space>

              <n-popover trigger="hover" :show-arrow="false">
                <template #trigger>
                  <div style="width: 98%;">
                    <p class="scale-in-hor-left" :key="otherDataCount"
                       :style="'width:'+otherDataPercent[index][1][otherDataKey]"
                       style="height: 7px;border-radius: 2px;background-color:#4098fc;"></p>
                  </div>
                </template>
                <span>{{otherDataText}}: {{otherData[index][1][otherDataKey]}}</span>
              </n-popover>
            </n-space>

          </n-space>

        </n-space>

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
          <n-popover :show-arrow="false" trigger="hover" :delay="1000">
            <template #trigger>
              <n-button text circle color="black" @click="backPageSencond">
                <n-icon size="24">
                  <ArrowBackUp/>
                </n-icon>
              </n-button>
            </template>
            返回上一级页面
          </n-popover>
          <n-popover :show-arrow="false" trigger="hover" :delay="2000">
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
  </div>
</template>

<script>
import {
  NCard, NAvatar, NSpace, NTag, NIcon, NButton, NColorPicker,
  NPopover,NList, NListItem,NScrollbar,NGrid,NGi,NBadge,NEllipsis
} from 'naive-ui'
import {ThumbUp,World,ThumbDown,ChevronsDownLeft, ArrowBackUp, Ballon} from '@vicons/tabler'
import {onMounted,ref} from "vue";
import {matchStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {appConfig} from "@/utils/main/config";
import {queryGameDetailsData} from "@/utils/main/queryDetailedGame";
import {ipcRenderer} from "electron";

export default {
  name: "gameDetails",
  components:{
    NCard, NAvatar, NSpace, NTag, NIcon, NButton, NColorPicker,NEllipsis,
    NPopover,NList, NListItem,NScrollbar,NGrid,NGi,NBadge,ThumbUp,World,ThumbDown,ChevronsDownLeft, ArrowBackUp, Ballon
  },
  props: {
    lastPage: {
      type: Number
    }
  },
  setup(props){
    let gameDetalisList = []
    const store = matchStore()
    const {currentQueryGameId,currentSummonerName,pageCount} = storeToRefs(store)
    let titleList = ref([])
    let summonersDataList = ref([])
    let otherData = ref(null)
    const otherDataKey = ref('tddtc')
    const otherDataText = ref('输出伤害')
    let otherDataCount = ref(1)
    const otherDataPercent = []


    onMounted( async () => {
      gameDetalisList = await queryGameDetailsData(currentQueryGameId.value,appConfig.get('credentials'))
      queryOtherMax(gameDetalisList)
      titleList.value = gameDetalisList[5]
      summonersDataList.value = gameDetalisList.slice(0,5)
    })


    // 改变数据显示的方式
    const changeShowWay = () => {
      otherDataCount.value += 1
      if (otherDataCount.value > 5){
        otherDataKey.value = 'tddtc'
        otherDataText.value = '输出伤害'
        otherDataCount.value = 1
      }else if (otherDataCount.value ===2){
        otherDataKey.value = 'tdt'
        otherDataText.value = '承受伤害'
      }else if (otherDataCount.value ===3){
        otherDataKey.value = 'ge'
        otherDataText.value = '商店存款'
      }else if (otherDataCount.value ===4){
        otherDataKey.value = 'vs'
        otherDataText.value = '视野得分'
      }else if (otherDataCount.value ===5){
        otherDataKey.value = 'tmk'
        otherDataText.value = '击杀小兵'
      }

    }

    // 根据最高数据算出百分比
    const computePercent = (max,cur) => {
        if (max == 0 || cur == 0){
          return '0%'
        }
        return Math.round(cur/max*10000) / 100 + "%"
      }

    // 求出每项额外数据中,每个队伍中数据最高的
    const queryOtherMax = (gameDetalisList) => {
      otherData.value = getOtherData(gameDetalisList)
      const maxList = [
        {maxTddtc:0,maxTdt:0,maxGe:0,maxVs:0,maxTmk:0},{maxTddtc:0,maxTdt:0,maxGe:0,maxVs:0,maxTmk:0}
      ]
      // 求出最大数据
      for (const otherDatum of otherData.value ) {
        for (let i = 0; i < 2; i++) {
          maxList[i].maxTddtc = otherDatum[i].tddtc>maxList[i].maxTddtc ? otherDatum[i].tddtc : maxList[i].maxTddtc
          maxList[i].maxTdt = otherDatum[i].tdt>maxList[i].maxTdt ? otherDatum[i].tdt : maxList[i].maxTdt
          maxList[i].maxGe = otherDatum[i].ge>maxList[i].maxGe ? otherDatum[i].ge : maxList[i].maxGe
          maxList[i].maxVs = otherDatum[i].vs>maxList[i].maxVs ? otherDatum[i].vs : maxList[i].maxVs
          maxList[i].maxTmk = otherDatum[i].tmk>maxList[i].maxTmk ? otherDatum[i].tmk : maxList[i].maxTmk
        }
      }
      // 求出百分比值
      for (const otherDatum of otherData.value ) {
        const tempList=[]
        for (let i = 0; i < 2; i++) {
          const tempJson = {tddtc:computePercent(maxList[i].maxTddtc,otherDatum[i].tddtc),
            tdt:computePercent(maxList[i].maxTdt,otherDatum[i].tdt),ge:computePercent(maxList[i].maxGe,otherDatum[i].ge),
            vs:computePercent(maxList[i].maxVs,otherDatum[i].vs),tmk:computePercent(maxList[i].maxTmk,otherDatum[i].tmk)
          }
          tempList.push(tempJson)
        }
        otherDataPercent.push(tempList)
      }
    }

    // 获取伤害总和,承伤,金钱,视野得分,补刀数
    const getOtherData = (gameDetalisList) => {
      const detalisList = gameDetalisList.slice(0,5)
      const otherList = []
      for (const rowData of detalisList) {
        const tempList=[]
        for (const rowElement of rowData) {
          const tempJson = {tddtc:rowElement.totalDamageDealtToChampions,
          tdt:rowElement.totalDamageTaken,ge:rowElement.goldEarned,
            vs:rowElement.visionScore,tmk:rowElement.totalMinionsKilled
          }
          tempList.push(tempJson)
        }
        otherList.push(tempList)
      }
      return otherList
    }

    const handleChangePosition = (pos) => {
      ipcRenderer.send('move-match-history-window', {
        x: pos.x,
        y: pos.y,
      })
    }
    const backPageSencond = () => {
      if (props.lastPage===1){
        pageCount.value = 1
      }else {
        pageCount.value = 2
      }
    }
    const handleMin = () => {
      ipcRenderer.send('match-history-window-min')
    }

    // 图片不存在显示默认图片
    function slnotimg(event) {
      var img = event.srcElement
      img.src = "https://gw.alipayobjects.com/zos/rmsportal/wYnHWSXDmBhiEmuwXsym.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng"
      img.onerror = null
    }
    return {
      titleList,summonersDataList,gameDetalisList,otherDataCount,
      currentSummonerName,otherDataPercent,otherData,otherDataKey,otherDataText,
      handleChangePosition,handleMin,backPageSencond,slnotimg,changeShowWay
    }
  }
}
</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  height: 556px;
  width: 720px;
}

.spanTitle {
  color: #9AA4AF;
  font-size: 13px;
}
.alignCent {
  align-items: center;
}
.itemClass{
  width: 25px;
  height: 25px;
  border-radius: 3px;
}
.itemClassSecond{
  width: 15px;
  height: 15px;
  border-radius: 3px;
}
.suspension {
  position: absolute;
  top: 7px;
  right: 3px;
}
.scale-in-hor-left {
  -webkit-animation: scale-in-hor-left 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-hor-left 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes scale-in-hor-left {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

</style>

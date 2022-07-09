<template>
  <div>
    <n-card class="mainCard boxShadow">
      <n-space vertical>
        <n-grid :cols="6">
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">日期</span>
              <span style="font-size: 15px">{{titleList[0]}}</span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">类型</span>
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
              <span class="spanTitle">人头</span>
              <span style="font-size: 15px;display: flex">
                <p style="color: #d03050">{{titleList[4]}}</p>  &nbsp;/&nbsp;
                <p style="color: #4098fc">{{titleList[5]}}</p>
              </span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">时长</span>
              <span style="font-size: 15px">{{titleList[3]}}分钟</span>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical class="alignCent">
              <span class="spanTitle">金钱</span>
              <span style="font-size: 15px;display: flex">
                <p style="color: #d03050">{{titleList[6]}}</p>  &nbsp;/&nbsp;
                <p style="color: #4098fc">{{titleList[7]}}</p>
              </span>
            </n-space>
          </n-gi>
        </n-grid>

      </n-space>

      <n-space vertical  style="margin-top: 25px" :size="[2,30]" >
        <!--        头像 技能 模式-->
        <n-space justify="space-around" v-for="singleData in summonersDataList">
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
                <img class="itemClass" :src="singleData[0].item0" >
                <img class="itemClass" :src="singleData[0].item1" >
                <img class="itemClass" :src="singleData[0].item2" >
                <img class="itemClass" :src="singleData[0].item3" >
                <img class="itemClass" :src="singleData[0].item4" >
                <img class="itemClass" :src="singleData[0].item5" >
                <img class="itemClass" :src="singleData[0].item6" >

              </n-space>
              <n-space>
<!--                召唤师技能-->
                <n-space :size="[5]" style="margin-top: 1px">
                  <img class="itemClassSecond" :src="singleData[0].spell1Id" alt="">
                  <img class="itemClassSecond" :src="singleData[0].spell2Id" alt="">
                </n-space>
<!--                召唤师昵称-->
                <p style="color: #9AA4AF;font-size: 13px;width: 110px" v-if="singleData[0].name!=currentSummonerName">{{ singleData[0].name }}</p>
                <p style="color: #ff6666;font-size: 13px;width: 110px" v-else>{{ singleData[0].name }}</p>
                <div style="color: #666F75;font-size: 13px">
                  {{singleData[0].kills}}/{{singleData[0].deaths}}/{{singleData[0].assists }}
                </div>
              </n-space>
            </n-space>
          </n-space>
<!--            <div>-->
<!--              <img src="@/render/assets/tLevel/mid.svg">-->
<!--            </div>-->


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
                <img class="itemClass" :src="singleData[1].item0" >
                <img class="itemClass" :src="singleData[1].item1" >
                <img class="itemClass" :src="singleData[1].item2" >
                <img class="itemClass" :src="singleData[1].item3" >
                <img class="itemClass" :src="singleData[1].item4" >
                <img class="itemClass" :src="singleData[1].item5" >
                <img class="itemClass" :src="singleData[1].item6" >

              </n-space>
              <n-space>
                <!--                召唤师技能-->
                <n-space :size="[5]" style="margin-top: 1px">
                  <img class="itemClassSecond" :src="singleData[1].spell1Id" alt="">
                  <img class="itemClassSecond" :src="singleData[1].spell2Id" alt="">

                </n-space>
                <!--                召唤师昵称-->
                <p style="color: #9AA4AF;font-size: 13px;width: 110px" v-if="singleData[1].name!=currentSummonerName">{{ singleData[1].name }}</p>
                <p style="color: #ff6666;font-size: 13px;width: 110px" v-else>{{ singleData[1].name }}</p>
                <div style="color: #666F75;font-size: 13px">
                  {{singleData[1].kills}}/{{singleData[1].deaths}}/{{singleData[1].assists }}
                </div>
              </n-space>
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
                <Hanger/>
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
  NPopover,NList, NListItem,NScrollbar,NGrid,NGi,NBadge
} from 'naive-ui'
import {ThumbUp,World,ThumbDown,ChevronsDownLeft, ArrowBackUp, Hanger} from '@vicons/tabler'
import {onMounted,ref} from "vue";
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {appConfig} from "@/utils/main/config";
import {queryGameDetailsData} from "@/utils/main/lcu";
import {ipcRenderer} from "electron";

export default {
  name: "gameDetails",
  components:{
    NCard, NAvatar, NSpace, NTag, NIcon, NButton, NColorPicker,
    NPopover,NList, NListItem,NScrollbar,NGrid,NGi,NBadge,ThumbUp,World,ThumbDown,ChevronsDownLeft, ArrowBackUp, Hanger
  },
  setup(props,{emit}){
    let gameDetalisList = []
    const store = useStore()
    const {currentQueryGameId,currentSummonerName} = storeToRefs(store)
    let titleList = ref([])
    let summonersDataList = ref([])
    onMounted( async () => {
      gameDetalisList = await queryGameDetailsData(currentQueryGameId.value,appConfig.get('credentials'))
      titleList.value = gameDetalisList[5]
      summonersDataList.value = gameDetalisList.slice(0,5)
    })

    const handleChangePosition = (pos) => {
      ipcRenderer.send('move-main', {
        x: pos.x,
        y: pos.y,
        isWindow:'horse'
      })
    }
    const backPageSencond = () => {
      emit('changePageSencond')
    }
    const handleMin = () => {
      ipcRenderer.send('mainwin-min')
    }
    return {
      titleList,summonersDataList,gameDetalisList,currentSummonerName,
      handleChangePosition,handleMin,backPageSencond
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

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
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
  border-radius: 50px;
}
.suspension {
  position: absolute;
  bottom: 10px;
  right: 60px;
}
</style>

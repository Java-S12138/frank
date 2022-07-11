<template>
  <div>
    <n-card class="mainCard boxShadow">
      <n-space>
        <n-list style="margin-left: 20px;margin-top: 20px;width: 440px">
        <n-scrollbar style="max-height: 460px">
          <n-list-item v-for="match in matchData.slice(0,matchData.length-1)" >
            <n-space vertical style="margin-top: 10px" >
              <!--        头像 技能 模式-->
              <n-space>
                <n-avatar
                  round
                  :bordered="false"
                  :size="50"
                  :src="match.champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block"
                  @click="toGameDetailsPage(match.gameId)"
                />
                <n-space vertical :size="[10,-3.4]">
                  <n-space :size="[5]">
                    <n-tag type="success" :bordered="false" v-if="match.isWin == '胜利'">{{match.isWin}}</n-tag>
                    <n-tag type="error" :bordered="false" v-else>{{match.isWin}}</n-tag>
                    <img class="itemClass"
                         :src="match.spell1Id" alt="">
                    <img class="itemClass"
                         :src="match.spell2Id" alt="">
                  </n-space>
                  <span style="color: #9AA4AF;font-size: 13px">{{match.queueId}}</span>
                </n-space>
                <!--          装备 战绩 补兵 经济-->
                <n-space style="" :size="[2,-2]" vertical>
                  <n-space :size="[2]">
                    <img class="itemClass"
                         :src="match.item0" >
                    <img class="itemClass"
                         :src="match.item1" >
                    <img class="itemClass"
                         :src="match.item2" >
                    <img class="itemClass"
                         :src="match.item3" >
                    <img class="itemClass"
                         :src="match.item4" >
                    <img class="itemClass"
                         :src="match.item5" >
                    <img class="itemClass"
                         :src="match.item6" >
                  </n-space>
                  <n-space :size="[9]">
                    <span style="color: #2080f0">{{ match.lane }}</span>
                    <n-icon size="19" color="#18a058" v-if="(match.kills+match.assists)/match.deaths >=5" >
                      <ThumbUp/>
                    </n-icon>
                    <n-icon size="19" color="#ff6666" v-else >
                      <ThumbDown/>
                    </n-icon>
                    <div style="color: #9AA4AF;font-size: 13px;width:32px">{{match.kills }}/{{match.deaths }}/{{match.assists }}</div>
                    <n-space style="margin-left: 8px" :size="[1]">
                      <n-icon size="19" color="#9AA4AF" >
                        <World/>
                      </n-icon>
                      <span style="color: #9AA4AF;font-size: 13px">{{match.matchTime}}</span>
                    </n-space>
                  </n-space>
                </n-space>
              </n-space>
            </n-space>
          </n-list-item>
        </n-scrollbar>
        </n-list>

<!--        召唤师绝活英雄展示-->
        <n-space vertical style="margin-top: 42px;margin-left: 20px" :size="[2,44.5]">
          <n-space v-for="superChamp in matchData[matchData.length-1]">
            <n-avatar
              round
              :bordered="false"
              :size="50"
              :src="superChamp.champImgUrl"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display: block"
            />
            <n-space vertical :size="[2,4]">
              <n-tag size="small" round type="warning" :bordered="false">
                熟练度: {{ superChamp.championPoints }}
              </n-tag>
              <n-tag size="small" round type="default" :bordered="false" style="">
                <p style="color: #9AA4AF"> 英雄等级: {{ superChamp.champLevel }}</p>
              </n-tag>
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
              <n-button text circle color="black" @click="backPage">
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
  NPopover,NList, NListItem,NScrollbar,
} from 'naive-ui'
import {ThumbUp,World,ThumbDown,ChevronsDownLeft, ArrowBackUp, Ballon} from '@vicons/tabler'
import {ipcRenderer} from "electron";
export default {
  name: "standing",
  components: {
    NCard, NAvatar, NSpace, NTag, NIcon, NButton, NColorPicker,
    NPopover,ThumbUp,ThumbDown,World,NList, NListItem,NScrollbar,ChevronsDownLeft, ArrowBackUp, Ballon
  },
  props: {
    matchData: {
      type: Array
    }
  },
  setup(props,{emit}){
    const handleChangePosition = (pos) => {
      ipcRenderer.send('move-main', {
        x: pos.x,
        y: pos.y,
        isWindow:'horse'
      })
    }
    const backPage = () => {
      emit('changePage')
    }
    const toGameDetailsPage = (gameId) => {
      emit('toGameDetailsPage',gameId)
    }
    const handleMin = () => {
      ipcRenderer.send('mainwin-min')
    }
    return {
      handleChangePosition,backPage,handleMin,toGameDetailsPage
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
.itemClass{
  width: 28px;
  height: 28px;
  border-radius: 3px;
}
.suspension {
  position: absolute;
  top: 20px;
  right: 25px;
}
</style>

<template>
  <div>
    <n-card v-if="isSubscribe ==='t'" class="mainCard boxShadow" content-style="padding-right:0px">
      <n-space>
        <n-list  style="margin-left: 20px;
        margin-top: 20px;width: 440px;" >
          <n-scrollbar style="max-height: 485px">
            <n-list-item style="padding: 0px;width: 390px;"
            v-for="match in props.matchData.slice(0,props.matchData.length-1)" >
            <n-space vertical style="margin-top: 10px;padding-bottom: 5px" >
              <!--        头像 技能 模式-->
              <n-space  @click="toGameDetailsPage(match.gameId)" >
                <n-avatar
                  :bordered="false"
                  :size="50"
                  :src="match.champImgUrl"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block"

                />
                <n-space vertical :size="[10,0]">
                  <n-space :size="[5,0]">
                    <n-tag type="success" :bordered="false" v-if="match.isWin == '胜利'">{{match.isWin}}</n-tag>
                    <n-tag type="error" :bordered="false" v-else>{{match.isWin}}</n-tag>
                    <img class="itemClass"
                         :src="match.spell1Id" alt="">
                    <img class="itemClass"
                         :src="match.spell2Id" alt="">
                  </n-space>
                  <div style="margin-top: -5px">
                    <span  style="color: #9AA4AF;font-size: 13px;">{{match.queueId}}</span>
                  </div>
                </n-space>
                <!--          装备 战绩 补兵 经济-->
                <n-space :size="[2,0]" vertical>
                  <n-space :size="[2,0]">
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
                  <n-space :size="[9,0]" justify="space-between" style="margin-top: -5px" >
                    <span style="color: #2080f0">{{ match.lane }}</span>
                    <n-icon size="17" color="#18a058" class="thumbDiv"
                            v-if="((match.kills+match.assists)/match.deaths)*3 >=10" >
                      <div>
                        <ThumbUp/>
                      </div>

                    </n-icon>
                    <n-icon class="thumbDiv" size="17" color="#ff6666" v-else >
                      <div style="position: absolute;">
                        <ThumbDown />
                      </div>

                    </n-icon>
                    <div class="kdadiv">{{match.kills }}/{{match.deaths }}/{{match.assists }}</div>
                    <n-space style="margin-left: 8px" :size="[1,0]">
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
        <n-list  style="margin-left: 22px;" >
          <n-scrollbar style="max-height: 485px;margin-top: 20px;padding-right: 13px">
              <n-list-item style="height: 70px;width: 162px"
                v-for="superChamp in props.matchData[props.matchData.length-1]">
                <n-space>
                  <n-avatar
                    :bordered="false"
                    :size="50"
                    :src="superChamp.champImgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    style="display: block"
                  />
                  <n-space vertical :size="[2,2.5]">
                    <n-tag style="width: 100px;justify-content: center"
                      size="small" type="warning" :bordered="false">
                      熟练度: {{ superChamp.championPoints }}
                    </n-tag>
                    <n-tag size="small"  style="width: 100px;justify-content: center"
                           type="default" :bordered="false">
                      <p style="color: #9AA4AF"> 英雄等级: {{ superChamp.champLevel }}</p>
                    </n-tag>
                  </n-space>
                </n-space>
              </n-list-item>
          </n-scrollbar>
        </n-list>
      </n-space>
      <div class="suspension">
        <n-space>
          <n-tag :bordered="false" :color="{ color: '#fafafc', textColor: '#9AA4AF' }"
                 style="font-size: 12px">点击英雄头像可查看完整战绩</n-tag>
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
              <n-icon size="24" @mousedown="handleChangePosition">
                <Ballon/>
              </n-icon>
            </template>
            移动窗口位置
          </n-popover>
        </n-space>
      </div>
    </n-card>
    <n-card v-else class="mainCard boxShadow" content-style="padding-right:0px;padding-top:110px">
      <n-result size="large" status="404" title="召唤师最近20场对局"
                description="需要订阅服务 订阅说明请在主页查看">
        <template #footer>
          <n-space justify="center">
            <n-button @click="backPage">返回上页</n-button>
            <n-button @click="openSubscribePage">支持一下</n-button>
          </n-space>
        </template>
      </n-result>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  NCard, NAvatar, NSpace, NTag, NIcon, NButton, NPopover,NList, NListItem,NScrollbar,NResult,
} from 'naive-ui'
import {ThumbUp,ThumbDown,ChevronsDownLeft, ArrowBackUp, Ballon} from '@vicons/tabler'

const props = defineProps({
  matchData: {
    type: Array
  }
})
const emits = defineEmits(['changePage','toGameDetailsPage'])
const isSubscribe =  localStorage.getItem('isSubscribe')
const handleChangePosition = () => {
  cube.windows.current.dragMove()
}
const backPage = () => {
  emits('changePage')
}
const toGameDetailsPage = (gameId:any) => {
  emits('toGameDetailsPage',{gameId:gameId,lastPage:2})
}
const handleMin =async () => {
  cube.windows.minimize((await cube.windows.getCurrentWindow()).id)
}
const openSubscribePage = () => {
  cube.profile.subscriptions.inapp.subscribe('1627551195412164610')
}
</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  height: 556px;
  width: 720px;
}

.itemClass{
  width: 28px;
  height: 28px;
  border-radius: 3px;
}
.suspension {
  position: absolute;
  top: 7px;
  right: 3px;
}
.kdadiv {
  background-color: #eee;
  height: 18px;
  color: #000;font-size: 13px;
  padding:0px 5px 0px 5px;
  border-radius: 3px;
}

.thumbDiv{
  position: relative;
}
.thumbDiv>div {
  position: absolute;
  top: 1px;
}
</style>

<template>
  <div v-if="runeDataListFor.length !==0">
    <n-card class="boxShadow" size="small">
      <n-space justify="space-between">
        <n-badge :value="isAutoRune" color="#ff6666">
          <n-avatar
            round
            :bordered="false"
            :size="50"
            :src="currentChampImgUrl"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display: block"
            @click="restraintActive = true"
          />
        </n-badge>

        <div class="buttonSwitch">
          <n-space >
            <n-button text style="font-size: 2em" @click="pageBack">
              <n-icon>
                <arrow-big-left-line></arrow-big-left-line>
              </n-icon>
            </n-button>
            <n-button text style="font-size: 2em" @click="pageNext">
              <n-icon>
                <arrow-big-right-line></arrow-big-right-line>
              </n-icon>
            </n-button>
          </n-space>
        </div>
        <n-select @update:value="changeRuneType($event)"
                  v-model:value="runeValue" :options="runeOptions" />
      </n-space>
    </n-card>
    <n-grid :cols="2" >
      <n-gi v-for="rune in runeDataListFor">
        <n-card class="boxShadow runeCard" size="small">
          <n-space :size=[-5] align="stretch">
            <n-space vertical style="width: 50px;" :size=[1,-5]>
              <img :src="getImaUrl(rune.selectedPerkIds[0])" alt="" class="runImg">
              <img :src="getImaUrl(rune.selectedPerkIds[1])" alt="" class="runImg">
              <img :src="getImaUrl(rune.selectedPerkIds[2])" alt="" class="runImg">
              <img :src="getImaUrl(rune.selectedPerkIds[3])" alt="" class="runImg">
              <n-tag :bordered="false" type="error" size="medium" style="margin-top: 6px">
                {{ getPosition(rune.position) }}
              </n-tag>

            </n-space>
            <n-space vertical style="width: 50px" :size=[1,-5]>
              <img :src="getImaUrl(rune.selectedPerkIds[4])" alt="" class="runImg">
              <img :src="getImaUrl(rune.selectedPerkIds[5])" alt="" class="runImg">
              <n-space vertical :size=[1,-6]>
                <img :src="getImaUrl(rune.selectedPerkIds[6])" alt="" class="runImgseSondary">
                <img :src="getImaUrl(rune.selectedPerkIds[7])" alt="" class="runImgseSondary">
                <img :src="getImaUrl(rune.selectedPerkIds[8])" alt="" class="runImgseSondary">
              </n-space>
              <div style="margin-top: 12px">
                <n-tag :bordered="false" type="success"
                       size="medium" @click="applyRune(rune)">
                  应用
                </n-tag>
              </div>
            </n-space>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
    <n-card class="boxShadow bottomTip" size="small">
      <n-space :size="[44]">
        <div class="skillDiv slide-in-bottom" v-for="skills in skillsAndItems[0]">
          <img class="itemImg" :src="skills[0]">
          <strong class="skillText">{{ skills[1] }}</strong>
        </div>
        <div class="skillDiv slide-in-bottom" v-for="items in skillsAndItems[itemCount]">
          <img :src="items" class="itemImg">
        </div>
      </n-space>
      <div class="itemsTotal slide-in-bottom" v-if="skillsAndItems.length !=0">
        <n-space>
          <n-button size="tiny" text text-color="#9aa4af" @click="changeItemsImg">
            切换装备
          </n-button>

          <div style="width: 32px;">
            <span>{{ itemCount }}</span>
            <span>/</span>
            <span>{{ skillsAndItems.length - 1 }}</span>
          </div>
        </n-space>
      </div>
      <div class="runesTotal slide-in-bottom" v-if="skillsAndItems.length !=0">
        <n-space>
          <n-button size="tiny" text text-color="#9aa4af">
            符文数量
            <p style="font-size: 14px;margin-left: 8px">{{runeDataCount}}</p>
          </n-button>
        </n-space>
      </div>
    </n-card>

    <n-drawer :auto-focus="false" v-model:show="restraintActive"
              style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="546" placement="bottom">
      <n-drawer-content >
        <restraint :champ="currentChamp" @autoRune="autoRune"></restraint>
      </n-drawer-content>
    </n-drawer>
  </div>

  <div v-else>
    <n-card class="boxShadow" size="small">
      <n-space justify="center" vertical>
        <p style="color: #9aa4af;">符文来源 OP.GG or 101.QQ.com</p>
        <p style="color: #9aa4af;">英雄选择阶段才可以使用符文配置功能</p>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import {ipcRenderer} from "electron"
import {
  NCard, NAvatar, NSpace, NTag, NGrid, NGi, NIcon,
  NBadge, NButton, useMessage,NDrawer, NDrawerContent,NSelect
} from 'naive-ui'
import {ref} from "vue";
import {champDict, mapNameFromUrl} from '../../../utils/render/lolDataList'
import {appConfig} from '../../../utils/main/config'
import {ArrowBigRightLine, ArrowBigLeftLine} from '@vicons/tabler'
import {request} from "../../../utils/render/request"
import {applyRunePage} from "@/utils/main/lcu";
import Restraint from "./restraint.vue";
import {get101Runes} from "@/utils/render/get101Runes";

const currentChamp = ref(null)
const currentChampImgUrl = ref('')
const currentChampAlias = ref('')
let runeDataList = []
const runeDataCount = ref(0)
const runeDataListFor = ref([])
let pageStart = 0
let pageEnd = 0
const isAutoRune = ref(0)
const loading = ref(true)
const skillsAndItems = ref([])
const itemCount = ref(1)
const credentials = appConfig.get('credentials')
let currentGameMode = ''
const restraintActive = ref(false)
const runeValue =  ref(appConfig.get('runeType'))
const runeOptions =  [
  {
    label: '国服数据',
    value: '国服数据'
  },
  {
    label: "韩服数据",
    value: '韩服数据',
  }]

const message = useMessage()

ipcRenderer.on('show-other-summoner', () => {
  runeDataListFor.value.length = 0
  currentChamp.value=null
})
ipcRenderer.on('query-other-summoner', () => {
  currentGameMode = ''
})

ipcRenderer.on('current-champ-select', (event, data) => {
  if (data.champId === 0 || data.champId.httpStatus === 404) {
    return
  }
  if (data.champId != currentChamp.value) {
    runeDataList = []
    skillsAndItems.value = []
    itemCount.value = 1
    isAutoRune.value = appConfig.has(`autoRune.${data.champId}`) == true ? 'auto' : 0
    currentChamp.value = data.champId
    mapChamp(data.champId)
    getRuneData(data.mode)
  }
  // 设置当前游戏模式
  if (currentGameMode === ''){currentGameMode = data.mode}
})


// 获取英雄数据
const getChampInfo = async (gameMode) => {
  if (gameMode === 'aram' && currentGameMode === 'aram') {
    return (await request({
      url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg-aram/${currentChampAlias.value}.json`,
      method: 'GET',
    })).data
  } else {
    return  (await request({
      url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg/${currentChampAlias.value}.json `,
      method: 'GET',
    })).data
  }
}

// 获取符文数据
const getRuneData = async (gameMode) => {
  // 判断当前英雄是否配置看自动符文
  if (appConfig.has(`autoRune.${currentChamp.value}` )){
    applyRunePage(credentials,appConfig.get(`autoRune.${currentChamp.value}`))
  }

  try {
    const champInfo = await getChampInfo(gameMode)
    // 技能
    getSkillsImgUrl(champInfo[0].skillsImg, champInfo[0].skills)

    for (const champ of champInfo) {
      // 符文
      for (const rune of champ.runes) {
        if (gameMode == 'aram' && currentGameMode === 'aram') {
          rune.position = 'aram'
        }
        runeDataList.push(rune)
      }
      // 装备
      getItemImgUrl(champ.itemBuilds[0].blocks)
    }
    if (runeValue.value ==='国服数据' && gameMode !== 'aram'){
      runeDataList = await get101Runes(currentChamp.value)
    }
    runeDataCount.value = runeDataList.length
    pageStart = 0
    pageEnd = runeDataList.length > 4 ? 4 : runeDataList.length
    runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)

    if (appConfig.has(`autoRune.${currentChamp.value}`)) {
      message.success('自动配置符文成功')
    }

  } catch (e) {
    console.log(e)
  }

}

// 切换不同服务器的符文数据
const changeRuneType = (type) => {
  if (type==='国服数据'){
    runeValue.value ='国服数据'
    appConfig.set('runeType','国服数据')
  }else {
    runeValue.value ='韩服数据'
    appConfig.set('runeType','韩服数据')
  }
  runeDataList =[]
  runeDataListFor.value = []
  skillsAndItems.value = []
  itemCount.value = 1
  getRuneData(currentGameMode)
}

// const test = () => {
//   currentChampAlias.value = 'Viktor'
//   currentChamp.value = 112
//   currentChampImgUrl.value = `https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png`
//   getRuneData('')
// }
// test()

// 切换不同的装备进行显示
const changeItemsImg = () => {
  if (itemCount.value < skillsAndItems.value.length - 1) {
    itemCount.value += 1
  } else {
    itemCount.value = 1
  }
}

// 获取装备图片链接数组
const getItemImgUrl = (blocks) => {
  for (const blocksElement of blocks) {
    if (blocksElement.type.indexOf('Core')!==-1) {
      var currentItemList = []
      if (blocksElement.items.length > 3){blocksElement.items = blocksElement.items.slice(1)}
      for (const items of blocksElement.items) {
        const itemImgUrl = `https://game.gtimg.cn/images/lol/act/img/item/${items.id}.png`
        currentItemList.push(itemImgUrl)
      }
      skillsAndItems.value.push(currentItemList)
    }
  }

}
// 获取技能图片链接数组
const getSkillsImgUrl = (skillsImg, skills) => {
  let skillsList = []

  for (let i = 0; i < skillsImg.length; i++) {
    const skillImgUrl = `https://game.gtimg.cn/images/lol/act/img/spell/${skillsImg[i]}`
    skillsList.push([skillImgUrl, skills[i]])
  }
  skillsAndItems.value.push(skillsList)
}

// 获取图片地址
const getImaUrl = (imgId) => {
  return require(`../../assets/runes/${imgId}.png`)
}
// 获取位置信息
const getPosition = (pos) => {
  switch (pos) {
    case 'middle':
      return '中单';
    case 'top':
      return '上单';
    case 'support':
      return '辅助';
    case 'jungle':
      return '打野';
    case 'bottom':
      return '射手';
    case 'aram':
      return '极地';
    case 'mid':
      return '中单';
  }
}
// 通过英雄ID获取部分信息
const mapChamp = (champId) => {
  currentChampImgUrl.value = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`
  currentChampAlias.value = champDict[champId].alias
}
// 应用符文
const applyRune = async (data) => {
  let tempData = JSON.parse(JSON.stringify(data))
  tempData.name = mapNameFromUrl[data.alias].name + " By Frank"
  const isApplySuccess = await applyRunePage(credentials,JSON.parse(JSON.stringify(tempData)))

  if (isApplySuccess){
    message.success('符文配置成功')
  }else {
    message.error('符文配置失败, 按Ctrl+R 再试试')
  }
}

// 上一页
const pageBack = () => {
  if (pageStart != 0 && pageEnd != runeDataList.length) {
    pageStart = pageStart - 4
    pageEnd = pageEnd - 4
    runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
  } else if (pageEnd == runeDataList.length && pageStart!==0) {
    pageEnd = pageStart
    pageStart = pageStart - 4
    runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
  } else {
    message.warning('当前是首页哦!')
  }

}
// 下一页
const pageNext = () => {
  const dataListLen = runeDataList.length
  if (pageEnd + 4 < dataListLen) {
    pageStart = pageEnd
    pageEnd = pageEnd + 4
    runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
  } else if (pageEnd < dataListLen) {
    pageStart = pageEnd
    pageEnd = dataListLen
    runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
  } else {
    message.warning('已经是最后一页咯!')
  }
}

const autoRune = (e) => {
  if (e){
    isAutoRune.value='auto'
  }else {
    isAutoRune.value=0
  }
}
</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}

.n-space {
  align-items: center;
}

.runImgPrimary {
  width: 50px;
  height: 50px;
}

.runImg {
  width: 30px;
  height: 30px;
}

.runImgseSondary {
  width: 25px;
  height: 25px;
  margin-bottom: -7px;
}

.n-card > .n-card__content > .runeCard {
  padding: 0 !important;
}

.buttonSwitch {
  margin-top: 10px;
}
.runeSelect {
  width: 95px;
  position: absolute;
  bottom: -25px;
  right: -10px;
}
.bottomTip {
  margin-bottom: 0px;
  height: 80px;
  padding-top: 10px;
  padding-left: 1px;
}

.itemImg {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  position: absolute;
}

.skillDiv {
  position: relative;
}

.skillText {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 19px;
  left: 19px;
  background: rgba(32, 45, 55, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  white-space: nowrap;
  color: rgb(0, 215, 176) !important;
  font-size: 11px !important;
}

.itemsTotal {
  position: absolute;
  right: 4px;
  bottom: -2px;
  color: #9aa4af
}
.runesTotal {
  position: absolute;
  left: 18px;
  bottom: -2px;
  color: #9aa4af
}

.slide-in-bottom {
  -webkit-animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}


</style>

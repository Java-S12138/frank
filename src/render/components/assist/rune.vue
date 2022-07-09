<template>
  <div>
    <n-card class="boxShadow" size="small" v-mouse-drag="handldDrge">
      <n-space justify="space-between">
        <n-popconfirm :show-icon="false" positive-text="确认" negative-text="取消"
                      @positive-click="setAutoRune" @negative-click="deleteAutoRune"
        >
          <template #trigger>
            <n-skeleton v-if="loading" circle size="medium" style="width: 50px;height: 50px;" />
            <n-badge v-else :value="isAutoRune" color="#ff6666">
              <n-avatar
                round
                :bordered="false"
                :size="50"
                :src="currentChampImgUrl"
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block"
              />

            </n-badge>
          </template>
          设置自动配置符文
        </n-popconfirm>

        <div>
          <n-tag type="success" :bordered="false" :round="true">
              {{ currentChampName }}
          </n-tag>
        </div>
        <div class="buttonSwitch" >
          <n-space>
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
      </n-space>
    </n-card>
    <n-grid :cols="2" v-if="loading" style="margin-left: 15px;margin-top: 30px">
      <n-gi>
        <n-skeleton style="border-radius: 10px;" :width="130" :height="190" :sharp="false" size="medium"/>
      </n-gi>
      <n-gi>
        <n-skeleton style="border-radius: 10px;" :width="130" :height="190" :sharp="false" size="medium"/>
      </n-gi>
      <n-gi style="margin-top: 30px">
        <n-skeleton style="border-radius: 10px;" :width="130" :height="190" :sharp="false" size="medium"/>
      </n-gi>
      <n-gi style="margin-top: 30px">
        <n-skeleton style="border-radius: 10px;" :width="130" :height="190" :sharp="false" size="medium"/>
      </n-gi>
    </n-grid>
    <n-grid :cols="2" v-else>
      <n-gi v-for="(rune,index) in runeDataListFor">
        <n-card class="boxShadow runeCard" size="small">
          <n-space :size=[-5] align="stretch">
            <n-space vertical style="width: 50px;"  :size=[1,-5]>
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
                <n-popover trigger="hover" placement="top-end" :delay="1000" >
                  <template #trigger>
                    <n-tag :bordered="false" type="success"
                           size="medium" @click="applyRune(rune)">
                      应用
                    </n-tag>
                  </template>
                  <span>Win {{ rune.winRate }} <br/>Pick {{ rune.pickCount }}</span>
                </n-popover>
              </div>

            </n-space>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>


  </div>
</template>

<script>
import {ipcRenderer} from "electron"
import {
  NCard, NAvatar, NSpace, NTag, NModal, NGrid, NGi, NIcon, NBadge, NSkeleton,
  NInput, NButton, NSelect, NPopover, NList, NListItem, NPopconfirm, useMessage
} from 'naive-ui'
import {ref} from "vue";
import {champDict, mapNameFromUrl} from '../../../utils/render/lolDataList'
import {appConfig} from '../../../utils/main/config'
import {ArrowBigRightLine, ArrowBigLeftLine} from '@vicons/tabler'
import {request} from "../../../utils/render/request"
import {sendMessageToChat} from "@/utils/main/lcu";

const fs = require('fs')

export default {
  name: "rune",
  components: {
    NCard, NAvatar, NSpace, NTag, NModal, NGrid, NGi, NIcon, NBadge, NPopconfirm, NSkeleton,
    NInput, NButton, NSelect, NPopover, NList, NListItem, ArrowBigRightLine, ArrowBigLeftLine
  },
  setup() {
    let currentChamp = ref(null)
    let currentChampImgUrl = ref('')
    let currentChampName = ref('请先选择英雄')
    let currentChampAlias = ref('')
    let runeDataList = []
    let runeDataListFor = ref([])
    let pageStart = ref(0)
    let pageEnd = ref(0)
    const limitCount = 1
    let count = 0
    let isAutoRune = ref(0)
    let loading = ref(true)

    const message = useMessage()

    ipcRenderer.on('current-champ-select', (event, data) => {
      if (data.champId == 0 || data.champId == undefined) {
        return
      }
      if (data.champId != currentChamp.value) {
        runeDataList = []
        count = 0
        isAutoRune.value = appConfig.has(`autoRune.${data.champId}`) == true ? 'auto' : 0
      }
      count += 1
      currentChamp.value = data.champId
      mapChamp(data.champId)
      getRuneData(data.mode)
    })

    const getRuneData = async (gameMode) => {
      if (limitCount == count) {
        ipcRenderer.send('show-assistWindow', currentChamp.value)
        let runeData
        try {
          // ${currentChampAlias.value}
          // let runeData = JSON.parse(fs.readFileSync(`${appConfig.get('gameDirectory')}\\runePage\\${currentChampAlias.value}.json`, 'utf-8'))
          // if (appConfig.get('haveLocalRune')==true){
          //   let lolClientDir = appConfig.get('gameDirectory')
          //   lolClientDir = lolClientDir.replace('\\Client.exe','')
          //   runeData = JSON.parse(fs.readFileSync(`${lolClientDir}\\runes\\${currentChampAlias.value}.json`, 'utf-8'))
          // }else {
          // }
          if (gameMode == 'aram'){
            runeData = (await request({
              url: `https://unpkg.com/@java_s/op.gg-aram/${currentChampAlias.value}.json`,
              method: 'GET',
            })).data
          }else {
            runeData = (await request({
              url: `https://unpkg.com/@java_s/op.gg/${currentChampAlias.value}.json`,
              method: 'GET',
            })).data
          }

          for (const runeDatum of runeData) {
            for (const rune of runeDatum.runes) {
              if (gameMode == 'aram'){
                rune.position = 'aram'
              }
              runeDataList.push(rune)
            }
          }
          pageStart = 0
          pageEnd = runeDataList.length > 4 ? 4 : runeDataList.length
          runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
          if (appConfig.has(`autoRune.${currentChamp.value}`) ) {
            message.success('自动配置符文成功')
            if (appConfig.get('isRecommend')){
              sendMessageToChat(appConfig.get('credentials'),
                `一款全新的LOL助手软件 永久免费\n${champDict[currentChamp.value].label}的符文 由Frank自动配置成功!\n了解更多功能: https://cdn.syjun.vip/frank.html`)
            }
          }

          loading.value = false
        } catch (e) {
          console.log(e)
        }
      } else {
        return
      }
    }
    // getRuneData()

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
      }
    }
    // 通过英雄ID获取部分信息
    const mapChamp = (champId) => {
          currentChampImgUrl.value = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`
          currentChampName.value = champDict[champId].label
          currentChampAlias.value = champDict[champId].alias
    }
    // 应用符文
    const applyRune = (data) => {
      try {
        let tempData = JSON.parse(JSON.stringify(data))
        tempData.name = data.alias + ' Powered By Frank'
        ipcRenderer.send('apply-rune-page', JSON.parse(JSON.stringify(tempData)))
        message.success('符文配置成功')
        if (appConfig.get('isRecommend')){
          sendMessageToChat(appConfig.get('credentials'),
            `一款全新的LOL助手软件 永久免费\n${mapNameFromUrl[data.alias].label}的符文 由Frank一键配置成功!\n了解更多功能: https://cdn.syjun.vip/frank.html`)
          }
        }
         catch (e) {
        message.error('符文配置失败')
      }
    }
    // 拖动顶部盒子 改变窗口位置
    const handldDrge = (pos) => {
      ipcRenderer.send('move-assistWindow', {
        x: pos.x,
        y: pos.y
      })
    }
    // 上一页
    const pageBack = () => {
      if (pageStart != 0 && pageEnd != runeDataList.length) {
        pageStart = pageStart - 4
        pageEnd = pageEnd - 4
        runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
      } else if (pageEnd == runeDataList.length) {
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
      if (pageEnd +4 < dataListLen) {
        pageStart = pageEnd
        pageEnd = pageEnd +4
        runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
      } else if (pageEnd < dataListLen) {
        pageStart = pageEnd
        pageEnd = dataListLen
        runeDataListFor.value = runeDataList.slice(pageStart, pageEnd)
      } else {
        message.warning('已经是最后一页咯!')
      }
    }

    // 设置自动配置符文
    const setAutoRune = () => {
      ipcRenderer.send('set-auto-rune', currentChamp.value)
      isAutoRune.value = 'auto'
    }
    // 删除自动配置符文
    const deleteAutoRune = () => {
      if (appConfig.has(`autoRune.${currentChamp.value}`)) {
        appConfig.delete(`autoRune.${currentChamp.value}`)
        isAutoRune.value = 0
      }
    }

    return {
      currentChamp, currentChampImgUrl, currentChampName, loading,
      runeDataList, pageStart, pageEnd, runeDataListFor, isAutoRune,
      getImaUrl, getPosition, applyRune, handldDrge, pageBack, pageNext, setAutoRune, deleteAutoRune
    }
  }
}
</script>

<style scoped>
.mainCard {
  width: 90%;
  display: flex;
  flex-direction: column;
}

.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}

.n-space {
  align-items: center;
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
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
/*.runeCard{*/
/*  margin-top: 45px!important;*/
/*}*/
.buttonSwitch {
  margin-top: 5px;
  margin-left: -5px;
}
</style>

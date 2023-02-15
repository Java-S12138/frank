<template>
  <div v-if="storeRune.runeDataList.length !==0">
    <rune-header/>
    <rune-main/>
  </div>

  <div v-else>
    <n-card class="boxShadow" size="small">
      <n-space justify="center" vertical>
        <p style="color: #9aa4af;">符文来源 OP.GG or 101.QQ.com</p>
        <p style="color: #9aa4af;">英雄选择完毕才可以使用符文配置功能</p>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  NCard, NAvatar, NSpace, NTag, NGrid, NGi, NIcon,
  NBadge, NButton, useMessage,NDrawer, NDrawerContent,NSelect
} from 'naive-ui'
import Restraint from "./restraint.vue";
import RuneHeader from "./runeHeader.vue";
import RuneMain from "./runeMain.vue";
import {onMounted} from "vue";
import {request} from "../../../utils/request"
import {applyRunePage} from "../../../lcu/runeLcu";
import {isStoreageHas} from "../../../lcu/utils";
import {invokeLcu} from "../../../lcu";
import {OnlineRunes,RuneEventType} from "../../../interface/runeTypes";

import runeStore from "../../../store/runeStore";

const message = useMessage()
const storeRune = runeStore()
const emits = defineEmits(['changePage'])

onMounted(() => {
  const runeClass = new RuneClass()
  runeClass.setChampInfo(113)
  cube.windows.message.on('received',async (id, content) => {
    if (id==='champion'){
      const champ = JSON.parse(content.value) as RuneEventType
      if (champ.data === 0) {
        runeClass.resetChampInfo()
      }else if (champ.data !==  storeRune.currentChamp) {
        runeClass.setChampInfo(champ.data)
      }
    }
  })
})

class RuneClass {
  public currentGameMode = ''

  // 清空英雄信息
  public resetChampInfo = () => {
    this.currentGameMode = ''
    storeRune.resetStore()
    emits('changePage',false)
  }
  // 设置英雄信息
  public setChampInfo = async (champId:number) => {
    emits('changePage',true)
    storeRune.runeDataList = []
    storeRune.isAutoRune = isStoreageHas('autoRunes',String(champId)) == true ?
      'auto' : ''
    storeRune.mapChampInfo(champId)
    this.currentGameMode = this.currentGameMode===''?
      await this.getGameMode():this.currentGameMode
    this.getRuneData(this.currentGameMode)
  }
  // 获取游戏模式
  public getGameMode = async () => {
    const session = await invokeLcu('get','/lol-lobby/v1/parties/gamemode')
    if (session?.queueId === 450){
      return 'aram'
    }else {
      return 'other'
    }
  }
  // 获取英雄数据
  public getChampInfo = async (gameMode:string):Promise<OnlineRunes[]> => {
    const timestamp = new Date().getTime()
    if (gameMode === 'aram') {
      return (await request({
        url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg-aram/${storeRune.currentChampAlias}.json?date${timestamp}`,
        method: 'GET',
      })).data
    } else {
      return (await request({
        url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg/${storeRune.currentChampAlias}.json?date${timestamp}`,
        method: 'GET',
      })).data
    }
  }
  // 获取符文数据
  public getRuneData = async (gameMode:string) => {
    // 判断当前英雄是否配置看自动符文
    if (isStoreageHas('autoRunes',String(storeRune.currentChamp))){
      const runeData = JSON.parse(String(localStorage.getItem('autoRunes')))[String(storeRune.currentChamp)]
      applyRunePage(runeData)
    }

    try {
      const champInfo:OnlineRunes[] = await this.getChampInfo(gameMode)
      // 技能
      storeRune.getSkillsImgUrl(champInfo[0].skillsImg, champInfo[0].skills)

      for (const champ of champInfo) {
        // 符文
        for (const rune of champ.runes) {
          if (gameMode == 'aram') {
            rune.position = 'aram'
          }
          storeRune.runeDataList.push(rune)
        }
      }
      if (isStoreageHas('autoRunes',String(storeRune.currentChamp))) {
        message.success('自动配置符文成功')
      }
    } catch (e) {
      console.log(e)
    }
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
</style>

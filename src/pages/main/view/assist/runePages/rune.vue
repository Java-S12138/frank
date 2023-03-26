<template>
  <div v-if="storeRune.runeDataList.length !==0">
    <rune-header/>
    <rune-main/>
  </div>

  <div v-else>
    <n-card class="boxShadow" size="small">
      <n-space justify="center" vertical>
        <p style="color: rgb(102, 111, 117)">符文来源 OP.GG or Tencent</p>
        <p style="color: rgb(102, 111, 117)">英雄选择完毕才可使用符文配置功能</p>
        <n-space>
          <p style="color: rgb(102, 111, 117)">是否选择应用符文时自动应用装备</p>
          <n-switch style="margin-bottom: 2.5px" v-model:value="active" size="small"  @click="changeSetting" />
        </n-space>
      </n-space>
      <img style="height: 250px;margin-top: 15px" src="../../../../../assets/svg/runeNull.svg">
      <img style="height: 250px" src="../../../../../assets/svg/runeNull2.svg">
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NSpace,useMessage,NSwitch} from 'naive-ui'
import RuneHeader from "./runeHeader.vue";
import RuneMain from "./runeMain.vue";
import {onMounted, ref} from "vue";
import {request} from "../../../utils/request"
import {invokeLcu} from "../../../lcu";
import {Block, OnlineRunes, RuneEventType} from "../../../interface/runeTypes";
import runeStore from "../../../store/runeStore";
import {mapNameFromUrl} from "../../../resources/champList";

const message = useMessage()
const storeRune = runeStore()
const active = ref(JSON.parse(<string>(localStorage.getItem('config'))).autoWriteBlock)

class RuneClass {
  public currentGameMode = ''

  // 清空英雄信息
  public resetChampInfo = () => {
    this.currentGameMode = ''
    storeRune.resetStore()
  }
  // 设置英雄信息
  public setChampInfo = async (champId:number) => {
    storeRune.runeDataList = []
    storeRune.blockDataList = []
    storeRune.isAppleAutoRune = false
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
    try {
      const champInfo:OnlineRunes[] = await this.getChampInfo(gameMode)
      // 技能
      storeRune.getSkillsImgUrl(champInfo[0].skillsImg, champInfo[0].skills)
      for (const champ of champInfo) {
        // 符文
        for (const rune of champ.runes) {
          if (gameMode === 'aram') {
            rune.position = 'aram'
          }
          storeRune.runeDataList.push(rune)
        }
        // 出装
        const block = this.getBlocksData(JSON.parse(JSON.stringify(champ)))
        if (block!==null){
          storeRune.blockDataList.push(block)
        }
      }
    } catch (e) {
      message.error('当前英雄暂无符文数据')
    }
  }
  // 获取出装数据
  public getBlocksData = (champ: OnlineRunes) => {
    try {
      if (this.currentGameMode === 'aram') {
        champ.position = 'aram'
      }
      const position = this.getPosition(champ.position)
      const buildItems = champ.itemBuilds[0]
      const name = mapNameFromUrl[champ.alias].label +'-' +mapNameFromUrl[champ.alias].name
      buildItems.title = name + ' 推荐出装 ' + 'lolfrank.cn'
      buildItems.blocks = this.handleBlocks(buildItems.blocks)
      return {position:position as string,buildItems:buildItems,ps:champ.position}
    }catch (e) {
      return null
    }
  }
  // 处理出装字段
  public handleBlocks = (blocks:Block[]) => {
    const blocksResult:Block[] = []
    for (const block of blocks) {
      if (block.type.indexOf('Starter') !== -1){
        blocksResult.push(this.translateTitle(block,'Starter Items,','出门:'))
      }else if (block.type.indexOf('Core') !== -1) {
        blocksResult.push(this.translateTitle(block,'Core Items,','核心:'))
      }
    }
    return blocksResult
  }
  // 翻译中文
  public translateTitle = (block:Block,english:string,chinese:string) =>  {
    block.type = block.type.replace(english,chinese).
    replace('Pick','选择次数').
    replace('Win Rate','胜率')
    if (block.items.length>3){
      block.items = block.items.slice(0,3)
    }
    return block
  }
  // 获取位置信息
  public getPosition = (pos:string) => {
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
}
const runeClass = new RuneClass()

const changeSetting = () => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  config['autoWriteBlock'] = active.value
  localStorage.setItem('config',JSON.stringify(config))
}
const watchChampSelect = (champ:RuneEventType) => {
  if (champ.data === 0) {
    runeClass.resetChampInfo()
  }else if (champ.data !==  storeRune.currentChamp) {
    runeClass.setChampInfo(champ.data)
  }
}
defineExpose({watchChampSelect})
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

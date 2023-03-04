import {defineStore} from 'pinia'
import {champDict} from "../resources/champList";
import {Rune,ItemBuild} from "../interface/runeTypes";
import {isStoreageHas} from "../lcu/utils";

const runeStore = defineStore('runeStore', {
  state: () => {
    return {
      currentChamp: 0,
      currentChampImgUrl: '',
      currentChampAlias: '',
      currentChampTitle: '',
      runeDataList: [] as Rune[],
      blockDataList: [] as {position:string,buildItems:ItemBuild,ps:string} [],
      skillsList: [] as string[][],
      restraintActive: false,
      isAutoRune: '',
      isAppleAutoRune:false
    }
  },
  actions: {
    mapChampInfo(champId: number) {
      this.currentChamp = champId
      this.currentChampImgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`
      this.currentChampAlias = champDict[champId].alias
      this.currentChampTitle = `${champDict[champId].label} ${champDict[champId].title}`
      this.isAutoRune = isStoreageHas('autoRune',this.currentChampAlias) == true ?
        'auto' : ''
    },
    getSkillsImgUrl(skillsImg: any, skills: any) {
      this.skillsList = []
      for (let i = 0; i < skillsImg.length; i++) {
        const skillImgUrl = `https://game.gtimg.cn/images/lol/act/img/spell/${skillsImg[i]}`
        this.skillsList.push([skillImgUrl, skills[i]])
      }
    },
    resetStore() {
      this.currentChamp = 0
      this.runeDataList = []
      this.blockDataList = []
      this.skillsList = []
      this.isAutoRune = ''
      this.restraintActive = false
      this.isAppleAutoRune = false
    }
  }
})

export default runeStore

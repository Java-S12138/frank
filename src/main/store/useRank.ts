import {defineStore} from "pinia";

export const useRankStore = defineStore('useRank', {
  state: () => {
    return {
      champId: 0,
      lane: '',
      tier: 0,
      is101: false,
      selectedList: [] as string[],
    }
  },
  actions: {
    initStore(champId: number, lane: string, tier: number, is101: boolean, sel: string[]) {
      this.champId = champId
      this.lane = lane
      this.tier = tier
      this.is101 = is101
      this.selectedList = sel
    },
    clearStore(){
      this.champId = 0
      this.lane = ''
      this.tier = 0
      this.is101 = false
      this.selectedList = []
    },
  }
})

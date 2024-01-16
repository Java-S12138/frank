import {defineStore} from "pinia";

export const useCommonStore = defineStore('useCommon', {
  state: () => {
    return {
      curDraContent: 'setting',
      drawerHeight:415,
      isShowDrawer:false
    }
  },
  actions: {
    changeContent(name: string) {
      if (name === this.curDraContent) {
        return
      }
      this.curDraContent = name
    },
    showDrawer(height?:number) {
      if (height){
        this.drawerHeight = height
      }
      this.isShowDrawer=true
    }
  }
})

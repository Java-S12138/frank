<template>
  <header v-mouse-drag = "handldDrge" class="frankTitle">
    <n-space class="frankTitle">
      <img src="../../assets/icon/app-icon.png" alt="" width="40" @click="handleMin" v-if="isConnectSuccess !=''">
      <img src="../../assets/icon/app-icon-bw.png" alt="" width="40" @click="handleMin" v-else>
      <img src="../../assets/icon/Frank.png" style="margin-top: 4px">
    </n-space>

    <n-space class="rightCorner">
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button
            text
            @click="handleMinimize" color="black">
            <n-icon size="25">
              <chevrons-down-right/>
            </n-icon>
          </n-button>
        </template>
        最小化
      </n-popover>
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button text circle color="black" @click="toSettingPage">
            <n-icon size="24">
              <settings/>
            </n-icon>
          </n-button>
        </template>
        设置
      </n-popover>
      <n-popover :show-arrow="false" trigger="hover" :delay="1000">
        <template #trigger>
          <n-button text circle @click="handleClose" color="black">
            <n-icon size="24">
              <circle-x/>
            </n-icon>
          </n-button>
        </template>
        退出
      </n-popover>

    </n-space>
  </header>
</template>

<script>
import {NIcon, NSpace, NButton, NPopover} from 'naive-ui'
import {ChevronsDownRight, Settings, CircleX} from '@vicons/tabler'
import {useStore} from "@/render/store";
import {ipcRenderer} from 'electron'
import {ref} from "vue";
import {appConfig} from "@/utils/main/config";

export default {
  name: "Dashboard",
  components: {
    NIcon, NSpace, NButton, NPopover,
    ChevronsDownRight, Settings, CircleX
  },
  setup() {
    const store = useStore()
    let isConnectSuccess = ref(appConfig.get('credentials.port'))

    const toSettingPage = () => {
      store.pageIncrease()
    }

    const handldDrge = (pos) =>{
      ipcRenderer.send('move-main',{
        x:pos.x,
        y:pos.y
      })
    }

    const handleMinimize = () =>{
      ipcRenderer.send('mainwin-minimize')
    }

    const handleMin = () =>{
      ipcRenderer.send('mainwin-min')
    }

    const handleClose = () =>{
      ipcRenderer.send('mainwin-close')
    }

    ipcRenderer.once('client-connect-success',(event,res)  => {
      isConnectSuccess.value = true
      // 如果英雄联盟客户端是在Frank之后启动
      // 那么在与客户端连成功后 判断首页的显示方式 如果是本地获取 那么需要刷新一次首页获取数据
      if (res == 'noClient' && appConfig.get('homeShowWay')=='local'){
        location.reload()
      }
    })

    return {
      isConnectSuccess,toSettingPage,
      handldDrge,handleMinimize,handleMin,handleClose
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-top: 10px;
  margin-right: 16px;
  margin-left: 16px;
  margin-bottom: 10px;
}

.rightCorner {
  padding-top: 8px;
  margin-right: 3px;
}

.frankTitle {
  align-items: center
}

</style>

<template>
  <div class="mainCard">
    <n-card class="boxShadow">
      <n-space vertical :size="[2,20]">
<!--        秒选英雄-->
        <n-space>
          <n-tag :bordered="false">秒选英雄</n-tag>
          <n-select
            v-model:value="config.autoPickChampion.championId"
            filterable
            :disabled="!config.autoPickChampion.isAuto"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampion"
            @update:value="handleUpdatePick"
            style="width: 140px"
          />
          <n-switch v-model:value="config.autoPickChampion.isAuto" @click="changePick"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒禁英雄-->
        <n-space>
          <n-tag :bordered="false">秒禁英雄</n-tag>
          <n-select
            v-model:value="config.autoBanChampion.championId"
            filterable
            :disabled="!config.autoBanChampion.isAuto"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampion"
            @update:value="handleUpdateBan"
            style="width: 140px"
          />
          <n-switch v-model:value="config.autoBanChampion.isAuto" @click="changeBan"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        排位笔记-->
        <n-space>
          <n-tag :bordered="false">排位笔记</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">是否使用排位笔记</n-tag>

          <n-switch v-model:value="config.isSwitchBlacklist" @click="changeBlacklist"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        野怪计时-->
        <n-space>
          <n-tag :bordered="false">野怪计时</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">是否使用野怪计时</n-tag>
          <n-switch v-model:value="config.isJungleTime" @click="changeJungleTime"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        游戏窗口-->
        <n-space>
          <n-popover :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-tag :bordered="false">游戏窗口</n-tag>
            </template>
            游戏内显示战绩历史窗口 隐藏|显示 SHIFT+TAB
          </n-popover>
          <n-popover :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-tag :bordered="false" type="success"
                     style="width: 140px;justify-content: center">自动打开游戏窗口</n-tag>
            </template>
            修改快捷键  请到Cube平台里面设置
          </n-popover>

          <n-switch v-model:value="config.isGameInWindow" @click="changeAutoGameInWin"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒接对局-->
        <n-space>
          <n-popover :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-tag :bordered="false">秒接对局</n-tag>
            </template>
            数值=50-->秒接, 数值=60-->延迟2秒, 以此类推
          </n-popover>
          <n-slider v-model:value="config.autoAccept" :step="10" @update:value="handleUpdateAccept"
                    style="width: 213px;margin-top: 5px"/>
        </n-space>
<!--        赞助发电-->
        <n-space>
          <n-tag :bordered="false" >赞助发电</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="() => {showModal = true}">赞助作者持续开发
          </n-button>
        </n-space>
        <!--Cube平台-->
        <n-space>
          <n-tag :bordered="false" >插件平台</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="openCubeSite">CUBE 为改善游戏体验而生
          </n-button>
        </n-space>
<!--        回到首页-->
        <n-space>
          <n-tag :bordered="false">回到首页</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="toHomePage">Frank On Cube BY: Java_S
          </n-button>
        </n-space>
      </n-space>
    </n-card>
    <n-modal v-model:show="showModal" >
      <n-card
        style="width: 356px"
        :bordered="false"
        size="small"
        role="dialog"
      >

        <div>
          <n-space justify="space-between" style="padding: 0px 4px 0px 4px">
            <n-tag type="success" :bordered = false style="width: 142px;justify-content: center">
              微信 ٩(◕‿◕｡)۶
            </n-tag>
            <n-tag type="info" :bordered = false style="width: 142px;justify-content: center">
              支付宝(●'◡'●)
            </n-tag>
          </n-space>
          <n-space justify="space-between">
            <img style="width: 150px;" src="@/assets/pay/wxpay.jpg">
            <img style="width: 150px;" src="@/assets/pay/zfbpay.jpg">
          </n-space>
        </div>
        <template #footer>
         <div style="margin-left: 4px">
           <p>
             Frank 全新的 LOL助手软件 [永久免费 代码开源]
           </p>
           <p>
             您的赞助会使作者越做越好 感谢您的大力支持❤️
           </p>
         </div>
        </template>
      </n-card>
    </n-modal>
  </div>

</template>

<script setup lang="ts">
import {NCard, NSpace, NTag, NButton, NSelect, NSwitch, NSlider,NModal,NPopover} from 'naive-ui'
import {optionsChampion} from '../../resources/champList'
import {ref,reactive} from "vue";

const emits = defineEmits(['changePage'])
const config = reactive(JSON.parse(String(localStorage.getItem('config'))))
const showModal = ref(false)

const toHomePage = () => {
  emits('changePage')
}

// 设置是否选项共用函数
const commoneChnage = (option:string) => {
  if (config[option] !== true) {
    config[option] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config[option] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}
const commoneChnageSecond = (option:string,second:string) => {
  if (config[option][second] !== true) {
    config[option][second] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config[option][second] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}

// 设置是否自动选择英雄
const changePick = () => {
  commoneChnageSecond('autoPickChampion','isAuto')
}
// 设置是否自动禁用英雄
const changeBan = () => {
  commoneChnageSecond('autoBanChampion','isAuto')
}
// 设置是否开启排位日记
const changeBlacklist = () => {
  commoneChnage('isSwitchBlacklist')
}
// 设置是否开启野怪计时
const changeJungleTime = () => {
  commoneChnage('isJungleTime')
}
// 设置是否开启自动打开游戏内窗口
const changeAutoGameInWin = () => {
  commoneChnage('isGameInWindow')
}
// 通过选择器选择英雄后, 执行的函数 选择
const handleUpdatePick = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
// 通过选择器选择英雄后, 执行的函数 禁用
const handleUpdateBan = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
// 是否自动接受对局
const handleUpdateAccept = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
const openCubeSite = () => {
  cube.utils.openUrlInDefaultBrowser('https://cubedao.cn/')
}
</script>

<style scoped>
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
}


.alignCent {
  align-items: center;
}
.carousel-img {
  width: 100%;
  height: 172px;
  object-fit: cover;

}
</style>

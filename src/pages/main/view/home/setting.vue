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
        <n-space v-if="isSubscribe !== 'f'">
          <n-popover :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-tag :bordered="false">秒接对局</n-tag>
            </template>
            数值=50-->秒接, 数值=60-->延迟2秒, 以此类推
          </n-popover>
          <n-slider v-model:value="config.autoAccept" :step="10" @update:value="handleUpdateAccept"
                    style="width: 213px;margin-top: 5px"/>
        </n-space>
        <n-space v-else>
          <n-space>
            <n-tag :bordered="false" >订阅服务</n-tag>
            <n-button size="small" type="warning" style="width: 214px;"
                      secondary @click="openSubscribePage">自动接收对局 需要订阅服务
            </n-button>
          </n-space>
        </n-space>
        <n-space v-if="isSubscribe !== 'f'">
          <n-tag :bordered="false">远程协助</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 214px;justify-content: center">一对一解决问题 V: lol_frank</n-tag>
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
  </div>

</template>

<script setup lang="ts">
import {NCard, NSpace, NTag, NButton, NSelect, NSwitch, NSlider,NPopover} from 'naive-ui'
import {optionsChampion} from '../../resources/champList'
import {reactive} from "vue";

const emits = defineEmits(['changePage'])
const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))
const isSubscribe = localStorage.getItem('isSubscribe')
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
  cube.windows.getWindowByName('assist').then((v) => {
    cube.windows.message.send(v.id,'refresh','')
  })

  commoneChnage('isSwitchBlacklist')
}
// 设置是否开启野怪计时
const changeJungleTime = () => {
  commoneChnage('isJungleTime')
  alert('目前野怪计时还不太稳定, 开启后请重启Frank~~~')
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

const openSubscribePage = () => {
  cube.profile.subscriptions.inapp.subscribe('1627551195412164610')
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

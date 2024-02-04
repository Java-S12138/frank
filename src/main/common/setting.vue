<script setup lang="ts">
import {Ref, ref} from "vue";
import {ConfigSettingTypes} from "@/background/utils/backgroundTypes";
import {optionsChampion, keywordsList} from "@/resources/champList";
import {NDrawerContent, NSpace, NTag, NSelect, NSwitch, NSlider, NRadio, useDialog,} from 'naive-ui'

const config:Ref<ConfigSettingTypes> = ref(JSON.parse(localStorage.getItem('configSetting') as string))
const theme = localStorage.getItem('theme')  || 'light'
const dialog = useDialog()

const saveConfig = () => {
  localStorage.setItem('configSetting',JSON.stringify(config.value))
}
// 切换主题
const handleThemeChange = () => {
  dialog.warning({
    title: 'Tips',
    content: '主题切换将重启Frank, 是否执行操作o.O?',
    showIcon:true,
    positiveText: '确认',
    negativeText: '取消',
    maskClosable:true,
    closable:false,
    autoFocus:false,
    style:'margin:8px;max-width:334px',
    onPositiveClick: () => {
      if (theme !== 'dark') {
        localStorage.setItem('theme','dark')
      } else {
        localStorage.setItem('theme','light')
      }
      cube.extensions.relaunch()
    }
  })
}
const commoneChnageSecond = (option:string,second:string) => {
  if (config.value[option][second] !== true) {
    config.value[option][second] = false
    saveConfig()
  } else {
    config.value[option][second] = true
    saveConfig()
  }
}
// 设置是否选项共用函数
const commoneChnage = (option:string) => {
  if (config.value[option] !== true) {
    config.value[option] = false
    localStorage.setItem('configSetting',JSON.stringify(config.value))
  } else {
    config.value[option] = true
    localStorage.setItem('configSetting',JSON.stringify(config.value))
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
// 搜索英雄
const searchChamp = (pattern: string, option: object) => {
  if (pattern==='' || pattern ===null){
    return false
  }
  const keyword = pattern.toLowerCase()
  const renderList = keywordsList.filter(item => item.keywords.toLowerCase().includes(keyword))

  if (renderList.length > 5 || renderList.length===0){
    return false
  }

  for (const renderListElement of renderList) {
    if (renderListElement.name === option.label){
      return true
    }
  }
}
// 设置是否开启自动打开游戏内窗口
const changeAutoGameInWin = () => {
  commoneChnage('isGameInWindow')
}
</script>

<template>
  <n-drawer-content body-style='padding:4px 17px 0px 17px'>
    <n-space vertical :size="[0,18]">
      <!--        切换主题-->
      <n-space vertical>
        <n-space align="center">
          <n-tag :bordered="false">主题样式</n-tag>
          <n-radio
            :checked="theme === 'light'"
            value="light"
            name="basic-demo"
            @click="handleThemeChange"
          >
            白羽清风
          </n-radio>
          <n-radio
            :checked="theme === 'dark'"
            value="dark"
            name="basic-demo"
            @click="handleThemeChange"
          >
            幽黑星空
          </n-radio>
        </n-space>
      </n-space>
      <!--        秒选英雄-->
      <n-space>
        <n-tag :bordered="false">秒选英雄</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <n-select
            v-model:value="config.autoPickChampion.championId"
            filterable
            size="small"
            :filter="searchChamp"
            :options="optionsChampion"
            :disabled="!config.autoPickChampion.isAuto"
            @update:value="saveConfig"
            placeholder="选择英雄"
            style="width: 126px"
          />
          <n-switch v-model:value="config.autoPickChampion.isAuto" @click="changePick"/>
        </div>

      </n-space>
      <!--        秒禁英雄-->
      <n-space>
        <n-tag :bordered="false">秒禁英雄</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <n-select
            v-model:value="config.autoBanChampion.championId"
            filterable
            size="small"
            :filter="searchChamp"
            :options="optionsChampion"
            :disabled="!config.autoBanChampion.isAuto"
            @update:value="saveConfig"
            placeholder="选择英雄"
            style="width: 126px"
          />
          <n-switch v-model:value="config.autoBanChampion.isAuto" @click="changeBan"/>
        </div>
      </n-space>
      <!--        秒选/秒禁英雄 是否使用一次关闭-->
      <n-space :size="[12,6]">
        <n-tag :bordered="false">昙花一现</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <n-tag
            :disabled="!config.autoIsOne"
            :type="config.autoIsOne?'success':'default'">
            使用一次后会禁用</n-tag>
          <n-switch v-model:value="config.autoIsOne" @click="saveConfig"
                    style="margin-top: 0px"/>
        </div>
        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">
          秒选/秒禁英雄 功能使用一次后关闭</n-tag>
      </n-space>
      <!--        游戏窗口-->
      <n-space>
        <n-tag :bordered="false">游戏窗口</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <n-tag type="success">自动打开游戏窗口</n-tag>
          <n-switch v-model:value="config.isGameInWindow" @click="changeAutoGameInWin"/>
        </div>

        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">游戏内显示战绩窗口 隐藏|显示 SHIFT+TAB</n-tag>
        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">更改快捷键 请到 Cube 平台的设置里面修改</n-tag>
      </n-space>
      <!--        秒接对局-->
      <n-space>
        <n-tag :bordered="false">秒接对局</n-tag>
        <n-slider v-model:value="config.autoAccept" :step="10" @update:value="saveConfig"
                  style="width: 188px;margin-top: 5px"/>
        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">滑块的值: [ {{'<'}}50  关闭 ] [ =50 开启 ]</n-tag>
        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">滑块的值: [ {{'='}}60  延迟两秒 ] 以此类推</n-tag>
      </n-space>
    </n-space>
  </n-drawer-content>
</template>

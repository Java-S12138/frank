<script setup lang="ts">
import {Ref, ref} from "vue";
import {ConfigSettingTypes} from "@/background/utils/backgroundTypes";
import {optionsChampion, keywordsList} from "@/resources/champList";
import {NDrawerContent, NTag,NButton, NSelect, NSwitch, NSlider, NRadio,NList,NListItem, useDialog} from 'naive-ui'

const config:Ref<ConfigSettingTypes> = ref(JSON.parse(localStorage.getItem('configSetting') as string))
const theme = localStorage.getItem('theme')  || 'light'
const subscribe = localStorage.getItem('subscribe')
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
const openWeb = (isSYJ:boolean) => {
  if (isSYJ){
    cube.utils.openUrlInDefaultBrowser('https://syjun.vip')
  }else {
    cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank')
  }
}
const restart = () => {
  cube.extensions.relaunch()
}
</script>

<template>
  <n-drawer-content body-style='padding:20px 22px' body-content-style="padding:0px">
      <n-list>
        <!--        切换主题-->
        <n-list-item style="padding-top: 0px;">
          <div class="flex gap-x-5 justify-between items-center">
            <n-tag :bordered="false">主题样式</n-tag>
            <div class="flex flex-grow justify-between">
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
            </div>
          </div>
        </n-list-item>
        <!--        秒选英雄-->
        <n-list-item>
          <div class="gap-x-5 flex justify-between">
            <n-tag :bordered="false">秒选英雄</n-tag>
            <div class="flex flex-grow items-center justify-between">
              <n-select
                v-model:value="config.autoPickChampion.championId"
                filterable
                spellcheck="false"
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
          </div>
        </n-list-item>
        <!--        秒禁英雄-->
        <n-list-item>
          <div class="flex gap-x-5 justify-between">
            <n-tag :bordered="false">秒禁英雄</n-tag>
            <div class="flex flex-grow items-center justify-between">
              <n-select
                v-model:value="config.autoBanChampion.championId"
                filterable
                spellcheck="false"
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
          </div>
        </n-list-item>
        <!--        秒选/秒禁英雄 是否使用一次关闭-->
        <n-list-item>
          <div class="gap-x-5 flex justify-between">
            <n-tag :bordered="false">昙花一现</n-tag>
            <div class="flex flex-grow items-center justify-between">
              <n-tag
                :disabled="!config.autoIsOne"
                :type="config.autoIsOne?'success':'default'">
                使用一次后会禁用</n-tag>
              <n-switch v-model:value="config.autoIsOne" @click="saveConfig"
                        style="margin-top: 0px"/>
            </div>
          </div>
          <n-tag class="mt-1.5 w-full justify-center"  :disabled="true" :bordered="false" size="small">
            秒选/秒禁英雄 功能使用一次后关闭</n-tag>
        </n-list-item>
        <!--        游戏窗口-->
        <n-list-item>
          <div class="gap-x-5 flex  justify-between">
            <n-tag :bordered="false">游戏窗口</n-tag>
            <div class="flex flex-grow items-center justify-between">
              <n-tag :type="config.isGameInWindow?'success':'default'"
                     :disabled="!config.isGameInWindow">
                自动打开游戏窗口</n-tag>
              <n-switch v-model:value="config.isGameInWindow" @click="saveConfig"/>
            </div>
          </div>
          <n-tag class="mt-1.5 w-full justify-center"  :disabled="true" :bordered="false" size="small">
            游戏内显示战绩窗口 隐藏|显示 SHIFT+TAB</n-tag>
        </n-list-item>
        <!--        秒接对局-->
        <n-list-item v-if="subscribe">
          <div class="gap-x-5 flex justify-between items-center">
            <n-tag :bordered="false">秒接对局</n-tag>
            <n-slider v-model:value="config.autoAccept" :step="10" @update:value="saveConfig"/>
          </div>
          <n-tag class="mt-1.5 w-full justify-center" :disabled="true" :bordered="false"
          size="small">数值: [ {{'<'}}50  关闭 ] [ =50 开启 ] [ {{'='}}60  延迟两秒 ]</n-tag>
        </n-list-item>
        <n-list-item v-else>
          <n-tag type="warning" :bordered="false" class="w-full justify-center">
            秒接对局，订阅后即可使用
          </n-tag>
          <n-tag class="mt-1.5 w-full justify-center" :disabled="true" :bordered="false"
                 size="small">订阅成功后，请重启Frank，更新订阅资源</n-tag>
        </n-list-item>
        <n-list-item style="padding-bottom: 0px;">
          <div class="flex justify-between items-center">
            <n-button
              size="small" secondary type="tertiary" @click="openWeb(false)">
              使用手册
            </n-button>
            <n-button
              size="small" secondary type="tertiary" @click="openWeb(true)">
              By Java_S
            </n-button>
            <n-button
              size="small" secondary type="tertiary" @click="restart">
              重启软件
            </n-button>
          </div>
        </n-list-item>
      </n-list>
  </n-drawer-content>
</template>

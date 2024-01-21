<script setup lang="ts">
import {computed, h, Ref, ref, VNodeChild} from "vue";
import {
  NDrawerContent,
  NCard,
  NSpace,
  NTag,
  NButton,
  NSelect,
  NSwitch,
  NSlider,
  NPopover,
  NRadio,
  NTreeSelect,
  useDialog,
  NAutoComplete, SelectOption, NAvatar
} from 'naive-ui'
import {ConfigSettingTypes} from "@/background/utils/configTypes";
import {champDict, aliasToId} from "@/resources/champList";
import SearchChamp from "@/main/pages/assist/common/searchChamp.vue";

const config:Ref<ConfigSettingTypes> = ref(JSON.parse(localStorage.getItem('configSetting') as string))
const theme = localStorage.getItem('theme')  || 'light'
console.log(config.value)
const dialog = useDialog()

const saveConfig = () => {
  localStorage.setItem('configSetting',JSON.stringify(config.value))
}

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
// 通过英雄ID获取英雄昵称
const champIdToName = (champId:string) => {
  return champDict[champId].label
}

//改变英雄数据
const changeChamp = (alias:string) => {
  config.value.autoPickChampion.championId = String(aliasToId[alias])
}
</script>

<template>
  <n-drawer-content body-style='padding:4px 17px'>
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
      <!--        秒选/秒禁英雄 是否使用一次关闭-->
      <n-space :size="[12,6]">
        <n-tag :bordered="false">昙花一现</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <n-tag
            :disabled="!config.autoIsOne"
            :type="config.autoIsOne?'success':'default'">
            使用一次后关闭</n-tag>
          <n-switch v-model:value="config.autoIsOne" @click="saveConfig"
                    style="margin-top: 0px"/>
        </div>
        <n-tag :disabled="true" :bordered="false"
               size="small" style="width: 270px;justify-content: center">
          秒选/秒禁英雄 功能使用一次后关闭</n-tag>
      </n-space>
      <!--        秒选英雄-->
      <n-space>
        <n-tag :bordered="false">秒选英雄</n-tag>
        <div style="width: 188px;" class="flex items-center justify-between">
          <search-champ
            :key="config.autoPickChampion.championId"
            :is-icon="false"
            :is-use="!config.autoPickChampion.isAuto"
            :select-func="changeChamp"
            :input-val="''"
            width="width: 112px;"
            :placeholder="champIdToName(config.autoPickChampion.championId)"/>
          <n-switch v-model:value="config.autoPickChampion.isAuto" @click="changePick"/>
        </div>

      </n-space>
    </n-space>
  </n-drawer-content>
</template>

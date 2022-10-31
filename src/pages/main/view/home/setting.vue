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
<!--        关闭WeGame-->
        <n-space>
          <n-tag :bordered="false">关闭助手</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">自动关闭腾讯助手</n-tag>

          <n-switch v-model:value="config.isAutoDeleteWGProcess" @click="changeAutoDeleteWG"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒接对局-->
        <n-space>
          <n-tag :bordered="false">秒接对局</n-tag>
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

<!--        回到首页-->
        <n-space>
          <n-tag :bordered="false">回到首页</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="toHomePage">因为热爱 所以联盟 BY: Java_S
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
import {
  NCard, NSpace, NTag, NButton, NSelect, NSwitch, NSlider,NModal
} from 'naive-ui'
import {optionsChampion} from '../../resources/champList'
import {ref,reactive} from "vue";

const emits = defineEmits(['changePage'])
// @ts-ignore
const config = reactive(JSON.parse(localStorage.getItem('config')))
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
// 设置是否开启自动关闭wegame进程
const changeAutoDeleteWG = () => {
  commoneChnage('isAutoDeleteWGProcess')
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

</style>

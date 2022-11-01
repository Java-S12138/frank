<template>
  <div class="mainCard">
    <n-card class="boxShadow">
      <n-space vertical :size="[2,20]">
<!--        秒选英雄-->
        <n-space>
          <n-tag :bordered="false">秒选英雄</n-tag>
          <n-select
            v-model:value="pickChampion"
            filterable
            :disabled="!isAutoPick"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampionPick"
            @update:value="handleUpdatePick"
            style="width: 140px"
          />
          <n-switch v-model:value="isAutoPick" @click="changePick"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒禁英雄-->
        <n-space>
          <n-tag :bordered="false">秒禁英雄</n-tag>
          <n-select
            v-model:value="banChampion"
            filterable
            :disabled="!isAutoBan"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampionBan"
            @update:value="handleUpdateBan"
            style="width: 140px"
          />
          <n-switch v-model:value="isAutoBan" @click="changeBan"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        排位笔记-->
        <n-space>
          <n-tag :bordered="false">排位笔记</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">是否使用排位笔记</n-tag>

          <n-switch v-model:value="isSwitchBlacklist" @click="changeBlacklist"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        关闭WeGame-->
        <n-space>
          <n-tag :bordered="false">关闭助手</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">自动关闭腾讯助手</n-tag>

          <n-switch v-model:value="isAutoDeleteWGProcess" @click="changeAutoDeleteWG"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒接对局-->
        <n-space>
          <n-tag :bordered="false">秒接对局</n-tag>
          <n-slider v-model:value="isAccept" :step="10" @update:value="handleUpdateAccept"
                    style="width: 213px;margin-top: 5px"/>
        </n-space>
<!--        默认设置-->
        <n-space>
          <n-tag :bordered="false">默认设置</n-tag>
          <n-popconfirm
            @positive-click="toReset"
            positive-text="确认"
            negative-text="取消"
            :show-icon="false"
          >
            <template #trigger>
              <n-button size="small" type="success" style="width: 214px;"
                        secondary>点击恢复默认设置
              </n-button>
            </template>
            一切都将一去杳然
          </n-popconfirm>
        </n-space>
<!--        赞助发电-->
        <n-space>
          <n-tag :bordered="false" >赞助发电</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="() => {showModal = true}">赞助作者持续开发
          </n-button>
        </n-space>
<!--        运行文件-->
        <n-space class="alignCent">
          <n-tag :bordered="false">运行文件</n-tag>

          <n-popover trigger="hover" v-if="!isExist">
            <template #trigger>
              <n-button size="small" type="success"
                        dashed @click="getGameDirectory" style="width: 214px;">
                <input type="file" id="file" hidden>
                选择LOL启动文件 Client.exe
              </n-button>
            </template>
            <span>例如 C:\LOL\英雄联盟\TCLS\Client.exe</span>
          </n-popover>


          <n-popover trigger="hover" v-else>
            <template #trigger>
              <n-tag :bordered="false" type="success" style="line-height: 28px !important;" @click="getGameDirectory">
                <input type="file" id="file" hidden>
                <n-ellipsis style="max-width: 200px" :tooltip="false">
                  {{ directory }}
                </n-ellipsis>
              </n-tag>
            </template>
            <span>再次点击可重新设置</span>
          </n-popover>

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
            <img style="width: 150px;" src="../../../render/assets/pay/wxpay.jpg">
            <img style="width: 150px;" src="../../../render/assets/pay/zfbpay.jpg">
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

<script setup>
import {
  NCard, NSpace, NTag, NButton, NEllipsis, NPopover,
  NSelect, NSwitch, NSlider, useMessage, NPopconfirm,NModal
} from 'naive-ui'
import {optionsChampion} from '@/utils/render/lolDataList'
import {ref} from "vue";
import {appConfig} from "@/utils/main/config"
import {ipcRenderer} from "electron";

const emits = defineEmits(['changePage'])
let isExist = ref(false)
let directory = ref('')
let isAutoPick = ref(appConfig.get('autoPickChampion.isAuto'))
let pickChampion = ref(appConfig.get('autoPickChampion.championId'))
const optionsChampionPick = optionsChampion
let isAutoBan = ref(appConfig.get('autoBanChampion.isAuto'))
const isSwitchBlacklist = ref(appConfig.get('isSwitchBlacklist'))
const isAutoDeleteWGProcess = ref(appConfig.get('isAutoDeleteWGProcess'))
let banChampion = ref(appConfig.get('autoBanChampion.championId'))
const optionsChampionBan = optionsChampion
let isAccept = ref(appConfig.get('autoAccept'))
const message = useMessage()
const showModal = ref(false)


const toHomePage = () => {
  emits('changePage')
}

// 判断是否已经获取路径
if (appConfig.get('gameDirectory') != '') {
  isExist.value = true
  directory.value = appConfig.get('gameDirectory')
}
// 获取英雄联盟客户端安装路径
const getGameDirectory = () => {
  const fu = document.getElementById('file')
  fu.click()
  fu.addEventListener('change', (event) => {
    const files = event.target.files[0].path
    appConfig.set('gameDirectory', files)
    directory.value = files
    isExist.value = true
  })
}

// 设置是否自动选择英雄
const changePick = () => {
  if (appConfig.get('autoPickChampion.isAuto') != true) {
    appConfig.set('autoPickChampion.isAuto', true)
  } else {
    appConfig.set('autoPickChampion.isAuto', false)
  }
}


// 设置是否自动禁用英雄
const changeBan = () => {
  if (appConfig.get('autoBanChampion.isAuto') != true) {
    appConfig.set('autoBanChampion.isAuto', true)
  } else {
    appConfig.set('autoBanChampion.isAuto', false)
  }
}
// 设置是否开启排位日记
const changeBlacklist = () => {
  if (appConfig.get('isSwitchBlacklist') != true) {
    appConfig.set('isSwitchBlacklist', true)
  } else {
    appConfig.set('isSwitchBlacklist', false)
  }
  ipcRenderer.send('setting-page-refresh-assist')
}
// 设置是否开启自动关闭wegame进程
const changeAutoDeleteWG = () => {
  if (appConfig.get('isAutoDeleteWGProcess') != true) {
    appConfig.set('isAutoDeleteWGProcess', true)
  } else {
    appConfig.set('isAutoDeleteWGProcess', false)
  }
}

// 通过选择器选择英雄后, 执行的函数 选择
const handleUpdatePick = () => {
  appConfig.set('autoPickChampion.championId', pickChampion.value)
}
// 通过选择器选择英雄后, 执行的函数 禁用
const handleUpdateBan = () => {
  appConfig.set('autoBanChampion.championId', banChampion.value)
}
// 是否自动接受对局
const handleUpdateAccept = () => {
  appConfig.set('autoAccept', isAccept.value)
}


// 恢复默认设置
const toReset = async () => {
  const blacklist = appConfig.get('blacklist')
  appConfig.clear()
  appConfig.set('blacklist',blacklist)
  message.success('设置已恢复默认, 建议重启Frank')
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

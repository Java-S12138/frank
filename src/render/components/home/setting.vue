<template>
  <div class="mainCard">
    <n-card class="boxShadow">
      <n-space vertical :size="[2,20]">
        <n-space class="alignCent" justify="space-between">
          <n-tag :bordered="false">首页数据</n-tag>

          <n-radio-group :default-value="homeWay"
                         style="display: flex;width: 218px;justify-content: space-between"
                         name="radiobuttongroup" size="medium">
            <n-radio
              :value="showHomeDataWay[0].label" @click="changeHomeShowWay(showHomeDataWay[0].label)">数据抓取
            </n-radio>
            <n-radio
              :value="showHomeDataWay[1].label" @click="changeHomeShowWay(showHomeDataWay[1].label)">本地获取
            </n-radio>
          </n-radio-group>
        </n-space>
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
        <n-space>
          <n-tag :bordered="false">秒接对局</n-tag>
          <n-slider v-model:value="isAccept" :step="10" @update:value="handleUpdateAccept"
                    style="width: 213px;margin-top: 5px"/>
        </n-space>

        <n-space class="alignCent">
          <n-tag :bordered="false">下载符文</n-tag>
          <n-tag :bordered="false" type="success"
                 v-if="haveLocalRune" style="width: 214px;justify-content: center">符文已导入成功
          </n-tag>
          <n-button v-else size="small" type="success" style="width: 214px;"
                    secondary @click="runDowRuneMission"> {{ currentDowChamp }}
          </n-button>

        </n-space>
        <n-space class="alignCent">
          <n-tag :bordered="false">安装目录</n-tag>
          <n-button size="small" type="success" v-if="!isExist"
                    dashed @click="getGameDirectory">点击获取LOL安装目录
          </n-button>
          <n-tag v-else :bordered="false" type="success" >
            <n-ellipsis style="max-width: 200px" :tooltip="false">
              {{ directory }}
            </n-ellipsis>
          </n-tag>
        </n-space>
        <n-space>
          <n-tag :bordered="false">回到首页</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="toHomePage">因为热爱 所有联盟 BY: Java_S
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script>
import {
  NCard, NSpace, NTag, NButton, NEllipsis, NAlert, NSpin,
  NSelect, NSwitch, NSlider, useMessage, NRadioGroup, NRadio
} from 'naive-ui'
import {ipcRenderer} from 'electron'
import {mapNameFromUrl, optionsChampion} from '@/utils/render/lolDataList'
import {ref,onMounted} from "vue";
import {appConfig} from "@/utils/main/config"
import {useStore} from "@/render/store";
import {getRuneFileByUrl,request} from "@/utils/render/request";


export default {
  name: "setting",
  components: {
    NCard, NSpace, NTag, NButton, NSlider, NAlert, NSpin,
    NEllipsis, NSelect, NSwitch, NRadioGroup, NRadio
  },
  setup() {
    let isExist = ref(false)
    let directory = ref('')
    const store = useStore()
    let isAutoPick = ref(appConfig.get('autoPickChampion.isAuto'))
    let pickChampion = ref(appConfig.get('autoPickChampion.championId'))
    const optionsChampionPick = optionsChampion
    let isAutoBan = ref(appConfig.get('autoBanChampion.isAuto'))
    let banChampion = ref(appConfig.get('autoBanChampion.championId'))
    const optionsChampionBan = optionsChampion
    let isAccept = ref(appConfig.get('autoAccept'))
    const message = useMessage()
    let homeWay = ref(appConfig.get('homeShowWay'))
    let currentDowChamp = ref('一键导入符文到本地 OP.GG')
    let showHomeDataWay = [
      {
        value: "网页抓取",
        label: "web"
      },
      {
        value: "本地获取",
        label: "local"
      }]
    let countShow = 0
    let messageReactive = null
    let haveLocalRune = ref(appConfig.get('haveLocalRune'))
    let runesVersion
    // https://unpkg.com/@java_s/op.gg@12.12.1-v1656323450582/Kled.json

    onMounted(async () => {
      runesVersion = (await request({
        url:'https://unpkg.com/@java_s/op.gg/package.json'
      })).data.version
      if (runesVersion != appConfig.get('runesVersion')){
        currentDowChamp.value = '符文有更新, 请点击下载'
        appConfig.set('haveLocalRune', false)
      }
    })


    // 下载符文到本地
    const runDowRuneMission = async () => {
      if (appConfig.get('gameDirectory') == '') {
        currentDowChamp.value = '请先获取客户端安装目录'
        return
      }
      let champNameList = Object.keys(mapNameFromUrl)
      messageReactive = message.loading("符文下载中......", {
        duration: 0
      })
      try {
        for (const champ of champNameList) {
          let url = `https://unpkg.com/@java_s/op.gg/${champ}.json`
          await getRuneFileByUrl(url)
          currentDowChamp.value = `${mapNameFromUrl[champ].label} 下载成功`
        }
        currentDowChamp.value = '符文导入成功 !'
        messageReactive.destroy()
        messageReactive = null
        appConfig.set('haveLocalRune', true)
        appConfig.set('runesVersion', runesVersion)
      } catch (e) {
        currentDowChamp.value = '符文导入失败 !'
        messageReactive.destroy()
        messageReactive = null
        message.error('导入失败, 请使用在线符文')
        appConfig.set('haveLocalRune', false)
      }
    }


    // 判断是否已经获取路径
    if (appConfig.get('gameDirectory') != '') {
      isExist.value = true
      directory.value = appConfig.get('gameDirectory')
    }
    // 获取英雄联盟客户端安装路径
    const getGameDirectory = () => {
      ipcRenderer.send('get-game-directory')
      ipcRenderer.once('reply-game-directory', (e, res) => {
        if (res != 'error-unstart') {
          appConfig.set('gameDirectory', res)
          directory.value = res
          isExist.value = true
        } else {
          message.error('英雄联盟客户端未启动 !')
        }
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
    // 改变首页数据获取获取方式
    const changeHomeShowWay = (way) => {
      countShow += 1
      if (countShow == 1) {
        appConfig.set('homeShowWay', way)
        location.reload()
      }
    }
    // 回到首页
    const toHomePage = () => {
      store.pageIncrease()
    }

    return {
      isExist, directory, optionsChampionPick, isAutoPick, pickChampion, haveLocalRune,
      optionsChampionBan, isAutoBan, banChampion, isAccept, showHomeDataWay, homeWay, currentDowChamp,
      getGameDirectory, changePick, handleUpdatePick, changeBan, handleUpdateBan, handleUpdateAccept,
      changeHomeShowWay, toHomePage, runDowRuneMission
    }

  }
}
</script>

<style scoped>
.mainCard {
  width: 90%;
  display: flex;
  flex-direction: column;
}

.n-card {
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 10px;
  padding: 5px;
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}

.alignCent {
  align-items: center;
}

</style>

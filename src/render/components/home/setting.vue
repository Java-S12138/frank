<template>
  <div class="mainCard">
    <n-card class="boxShadow">
      <n-space vertical :size="[2,20]">
        <!--        是否推荐frank-->
        <n-space>
          <n-tag :bordered="false">是否推荐</n-tag>
          <n-space justify="space-between" style="width: 214px">
            <n-tag :bordered="false" style="width: 140px;">聊天界面推荐Frank</n-tag>
            <n-switch v-model:value="isRecommend" @click="changeRecommend"
                      style="margin-left:22px;margin-top: 3px"/>
          </n-space>
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




        <n-space class="alignCent">
          <n-tag :bordered="false">运行文件</n-tag>

          <n-popover trigger="hover" v-if="!isExist">
            <template #trigger>
              <n-button size="small" type="success"
                        dashed @click="getGameDirectory" style="width: 214px">
                <input type="file" id="file" hidden>
                选择LOL启动文件 Client.exe
              </n-button>
            </template>
            <span>例如 C:\LOL\英雄联盟\TCLS\Client.exe</span>
          </n-popover>

          <n-popover trigger="hover" v-else>
            <template #trigger>
              <n-tag  :bordered="false" type="success" @click="getGameDirectory" >
                <input type="file" id="file" hidden>
                <n-ellipsis style="max-width: 200px" :tooltip="false">
                  {{ directory }}
                </n-ellipsis>
              </n-tag>
            </template>
          <span>再次点击可重新设置</span>
          </n-popover>

        </n-space>
        <n-space>
          <n-tag :bordered="false">回到首页</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="toHomePage">因为热爱 所以联盟 BY: Java_S
          </n-button>
        </n-space>


      </n-space>
    </n-card>


  </div>
</template>

<script>
import {
  NCard, NSpace, NTag, NButton, NEllipsis, NAlert, NSpin,NPopover,
  NSelect, NSwitch, NSlider, useMessage,NPopconfirm
} from 'naive-ui'
import {mapNameFromUrl, optionsChampion} from '@/utils/render/lolDataList'
import {ref,onMounted} from "vue";
import {appConfig} from "@/utils/main/config"
import {useStore} from "@/render/store";
import {getRuneFileByUrl,request} from "@/utils/render/request";


export default {
  name: "setting",
  components: {
    NCard, NSpace, NTag, NButton, NSlider, NAlert, NSpin,
    NEllipsis, NSelect, NSwitch,NPopover,NPopconfirm
  },
  setup() {
    let isExist = ref(false)
    let directory = ref('')
    const store = useStore()
    let isAutoPick = ref(appConfig.get('autoPickChampion.isAuto'))
    let isRecommend = ref(appConfig.get('isRecommend'))
    let pickChampion = ref(appConfig.get('autoPickChampion.championId'))
    const optionsChampionPick = optionsChampion
    let isAutoBan = ref(appConfig.get('autoBanChampion.isAuto'))
    let banChampion = ref(appConfig.get('autoBanChampion.championId'))
    const optionsChampionBan = optionsChampion
    let isAccept = ref(appConfig.get('autoAccept'))
    const message = useMessage()
    let currentDowChamp = ref('一键导入符文到本地 OP.GG')

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
      const fu = document.getElementById('file')
      fu.click()
      fu.addEventListener('change', (event) => {
        const files = event.target.files[0].path
        appConfig.set('gameDirectory',files)
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
    // 设置是否向队友推荐frank
    const changeRecommend = () => {
      if (appConfig.get('isRecommend') != true) {
        appConfig.set('isRecommend', true)
      } else {
        appConfig.set('isRecommend', false)
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

    // 回到首页
    const toHomePage = () => {
      store.pageIncrease()
    }

    // 恢复默认设置
    const toReset = async () => {
      message.success('设置已恢复默认, 建议重启Frank')
      appConfig.clear()
    }


    return {
      isExist, directory, optionsChampionPick, isAutoPick, pickChampion, haveLocalRune, optionsChampionBan,
      isAutoBan, banChampion, isAccept, currentDowChamp,isRecommend,
      getGameDirectory, changePick, handleUpdatePick, changeBan, handleUpdateBan, handleUpdateAccept,
      toHomePage, runDowRuneMission,toReset,changeRecommend
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

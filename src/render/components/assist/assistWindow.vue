<template>
  <n-tabs type="segment" :animated=true ref="tabsInstRef" :value="transValue">
    <n-tab name="champRank" tab="英雄数据" @click="transValue='champRank'"></n-tab>
    <n-tab name="match" tab="查看战绩" @click="showMatch"></n-tab>
    <n-tab name="rune" tab="符文配置" @click="transValue='rune'"></n-tab>
  </n-tabs>
  <champ-rank v-show="transValue=='champRank'" class="slide-in-right"></champ-rank>
  <rune v-show="transValue=='rune'" class="slide-in-left"></rune>
</template>

<script>
import {
  NTabs, NTab, useMessage
} from "naive-ui";
import Rune from './rune.vue'
import ChampRank from './champRank.vue'
import {onMounted, ref} from "vue";
import {ipcRenderer} from "electron";
import router from "@/render/router";

export default {
  name: "assistWindow",
  components: {NTabs, NTab, Rune, ChampRank},
  setup() {
    onMounted(() => {
      let nTabsRail = document.querySelector('.n-tabs-rail')
      let champRank = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(1) > div')
      let rune = document.querySelector('#app > div.n-tabs.n-tabs--segment-type.n-tabs--medium-size > div > div > div:nth-child(2) > div.n-tabs-tab')
      nTabsRail.style.margin = "12px 12px 0 12px"
      champRank.style['border-radius'] = '5px'
      champRank.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' +
        ' color 1s var(--n-bezier),\n' +
        ' background-color 1s var(--n-bezier),\n' +
        ' border-color 1s var(--n-bezier)'
      rune.style['border-radius'] = '5px'
      rune.style['transition'] = 'box-shadow 1s var(--n-bezier),\n' +
        ' color 1s var(--n-bezier),\n' +
        ' background-color 1s var(--n-bezier),\n' +
        ' border-color 1s var(--n-bezier)'
    })
    const tabsInstRef = ref(['champRank', 'rune'])
    const transValue = ref('champRank')
    const message = useMessage()
    ipcRenderer.on('current-champ-select', () => {
      transValue.value = 'rune'
    })

    ipcRenderer.on('refresh-assisit-window', () => {
      router.go(0)
    })

    const showMatch = () => {
      ipcRenderer.send('showCharts')
      ipcRenderer.once('error-unchat', (event, args) => {
        if (args == 'unchat') {
          message.error('请先开始一局游戏哟 !')
        } else {
          message.success('获取战绩成功 !')
        }
      })
    }
    return {
      tabsInstRef, transValue, showMatch
    }
  }
}
</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);

.n-tab-pane {
  padding: 0px;
  margin-top: -2px;
}
</style>

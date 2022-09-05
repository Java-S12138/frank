<template>
  <div>
    <n-modal v-model:show="showSummonerInfoModal"
             :mask-closable="false"
             :auto-focus="false">
      <n-card
        class="summonerInfoDiv"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
        content-style="padding: 0"
      >

        <n-tabs animated
                type="line"
                :tabs-padding="20"
                pane-style="padding: 20px;">
          <n-tab-pane name="我方召唤师" tab="我方召唤师" style="width: 280px">
            <n-space vertical :size="[2,18]" style="width:100% ">
              <n-space justify="space-between" class="alignItemCenter"  v-for="summoner in summonersList">
                <n-avatar
                  round
                  :size="50"
                  :src="summoner[2]"
                  style="display: block"
                />
                <n-tag type="success" :bordered="false" style="width: 145px;" class="alignCenter">{{ summoner[0] }}</n-tag>
                <n-button size="small" type="error" @click="preAddBlacklist(summoner[0],summoner[1])">拉黑</n-button>
              </n-space>
            </n-space>
          </n-tab-pane>
          <n-tab-pane name="敌方召唤师" tab="敌方召唤师" style="width: 280px">
            <n-space vertical :size="[2,18]">
              <n-space justify="space-between" class="alignItemCenter" v-for="summoner in enemySummonersList">
                <n-avatar
                  round
                  :size="50"
                  :src="summoner[2]"
                  style="display: block"
                />
                <n-tag type="success" :bordered="false" style="width: 145px;" class="alignCenter">{{ summoner[0] }}</n-tag>
                <n-button size="small" type="error"  @click="preAddBlacklist(summoner[0],summoner[1])">拉黑</n-button>
              </n-space>
            </n-space>
          </n-tab-pane>
        </n-tabs>

        <div class="iconDiv">

          <n-popconfirm @positive-click="closeModal"
                        :show-icon="false" positive-text="确定" negative-text="取消">
            <template #trigger>
              <n-icon size="25">
                <circle-x></circle-x>
              </n-icon>
            </template>
            是否关闭此窗口
          </n-popconfirm>
        </div>
      </n-card>

    </n-modal>

    <n-drawer v-model:show="active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus="false">
      <add-blacklist @closeDrawer="closeDrawer"
                     :name="blacklistName" :summonerId="blacklistId"></add-blacklist>
    </n-drawer>
  </div>
</template>

<script setup>
import {
  NCard, NModal, NSpace, NTag, NButton,NAvatar,
  NDrawer,NTabs,NTabPane,NIcon,NPopconfirm
} from "naive-ui"
import {CircleX} from '@vicons/tabler'
import AddBlacklist from './addBlacklist.vue'
import {ref} from "vue";
import {ipcRenderer} from "electron";
import {assistStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";


const active = ref(false)
const summonersList = ref([])
const enemySummonersList = ref([])
const store = assistStore()
const {endGameAfterInfo, showSummonerInfoModal} = storeToRefs(store)
const blacklistName = ref('')
const blacklistId = ref('')
const emits = defineEmits(['refreshList'])

ipcRenderer.on('show-other-summoner', () => {
  if (endGameAfterInfo.value[0].length !== 0) {
    summonersList.value = []
    for (const summoner of endGameAfterInfo.value[0]) {
      summonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp,summoner.position])
    }
  }
  if (endGameAfterInfo.value[1]!== 0) {
    enemySummonersList.value = []
    for (const summoner of  endGameAfterInfo.value[1]) {
      enemySummonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp,summoner.position])
    }
  }
  showSummonerInfoModal.value = true
})
// setTimeout(() => {
//   if (endGameAfterInfo.value[0].length !== 0) {
//     summonersList.value = []
//     for (const summoner of endGameAfterInfo.value[0]) {
//       summonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp])
//     }
//   }
//   if (endGameAfterInfo.value[1]!== 0) {
//     enemySummonersList.value = []
//     for (const summoner of  endGameAfterInfo.value[1]) {
//       enemySummonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp])
//     }
//   }
//   showSummonerInfoModal.value = true
// },2000)

const closeModal = () => {
  showSummonerInfoModal.value = false
}

const preAddBlacklist = (summonerName, summonerId) => {
  blacklistName.value = summonerName
  blacklistId.value = summonerId
  active.value = true
}
const closeDrawer = () => {
  emits('refreshList')
  active.value = false
}

</script>

<style scoped>
.alignCenter {
  justify-content: center;
}
.alignItemCenter {
  align-items: center;
}
.iconDiv {
  position: absolute;
  top: 9px;
  right: 32px;
}
.summonerInfoDiv {
  width: 320px;
  position: fixed;
  bottom: 0px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px
}
</style>

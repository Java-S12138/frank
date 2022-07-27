<template>
  <div>
    <n-modal v-model:show="showSummonerInfoModal">
      <n-card
        style="width: 290px"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"

      >
        <n-space vertical :size="[2,15]">
          <n-space justify="space-between" v-for="summonerName in summonersList">
            <n-tag type="success" :bordered="false">{{summonerName}}</n-tag>
            <n-button size="small" type="error" @click="preAddBlacklist(summonerName)">拉黑</n-button>
          </n-space>
        </n-space>
      </n-card>
    </n-modal>

    <n-drawer v-model:show="active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus="false">
      <add-blacklist @closeDrawer="closeDrawer" :name="blacklistName"></add-blacklist>
    </n-drawer>
  </div>
</template>

<script setup>
import {
  NCard, NModal, NSpace, NTag, NButton, NDrawer
} from "naive-ui"
import AddBlacklist from './addBlacklist.vue'
import {ref} from "vue";
import {ipcRenderer} from "electron";
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";


const active = ref(false)
const options = [
  {
    label: "摆烂",
    value: 'BL',
  },{
    label: '牛马',
    value: 'NM'
  },{
    label: "演员",
    value: 'YY',
  },{
    label: "脏兵",
    value: 'ZB',
  },{
    label: "挂机",
    value: 'GJ',
  }
]
const summonersList = ref([])
const store = useStore()
const {summonerInfo,showSummonerInfoModal} = storeToRefs(store)
const blacklistName = ref('')
const emits = defineEmits(['refreshList'])

ipcRenderer.on('show-other-summoner',() => {
  summonersList.value = []
  for (const summoner of summonerInfo.value) {
    summonersList.value.push(summoner.name)
  }
  showSummonerInfoModal.value = true
})

const preAddBlacklist = (summonerName) => {
  blacklistName.value = summonerName
  active.value=true
}
const closeDrawer =() => {
  emits('refreshList')
  active.value=false
}

</script>

<style scoped>

</style>

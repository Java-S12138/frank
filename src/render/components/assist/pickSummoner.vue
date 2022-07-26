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
              :height="475" placement="bottom" :auto-focus="false">
      <n-drawer-content>
        <template #header>
          <n-space justify="space-between" style="width: 142%">
            <p style="font-size: 15px">{{addBlackDatum.name}}</p>
            <p style="font-size: 15px">{{addBlackDatum.date}}</p>
          </n-space>
        </template>
        <template #footer>
          <n-button type="error" size="small" @click="confirmShielding">拉黑一下</n-button>
        </template>
        <n-space vertical>
          <n-input
            v-model:value="addBlackDatum.content"
            type="textarea"
            autosize
            placeholder="请输入拉黑原因"
            :bordered="false"
          />
          <n-space>
            <n-tag :bordered="false" type="info" style="margin-left: 5px">拉黑标签</n-tag>
            <n-select
              v-model:value="selectValue"
              :options="options"
              style="width: 162px;"
              size="small"
              tag
              filterable
            />
          </n-space>

        </n-space>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import {
  NCard, NModal, NSpace, NTag, NButton, NDrawer, NDrawerContent,
  NInput, NSelect,useMessage
} from "naive-ui"
import {ref,reactive} from "vue";
import {ipcRenderer} from "electron";
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";
import {appConfig} from "@/utils/main/config";

const active = ref(false)
const selectValue = ref('摆烂')
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
let addBlackDatum = reactive({name:'',date:'',content:'',tag:''})
const message = useMessage()

ipcRenderer.on('show-other-summoner',() => {
  summonersList.value = []
  for (const summoner of summonerInfo.value) {
    summonersList.value.push(summoner.name)
  }
  showSummonerInfoModal.value = true
})

const queryCurrenDate = () => {
  var myDate = new Date()
  return myDate.toLocaleDateString()
}

const preAddBlacklist = (summonerName) => {
  addBlackDatum.name = summonerName
  addBlackDatum.date = queryCurrenDate()
  addBlackDatum.content = ''
  active.value=true

}
const confirmShielding = () => {
  addBlackDatum.tag = selectValue.value
  appConfig.set(`blacklist.${addBlackDatum.name}`,{
    date:addBlackDatum.date,
    content:addBlackDatum.content,
    tag:addBlackDatum.tag
  })
  active.value = false
  message.success(`${addBlackDatum.name}---拉入黑名单成功 !`)
}

</script>

<style scoped>

</style>

<template>
  <n-drawer-content>
    <template #header>
      <n-space justify="space-between" style="width: 272px;align-items: center">
        <n-tree-select
          :show-checkmark="false" :show-path="false"
          :menu-props="{style:'width:130px'}"
          @update:value="handleUpdateArea($event)"
          v-model:value="areaSetting" :options="areaOptions" >
        </n-tree-select>
        <n-tag size="large" v-if="props.name!=''"  :bordered="false">{{props.name}}</n-tag>
        <n-input
          v-else
          style="width: 125px;"
          v-model:value="blacklistName"
          placeholder="输入召唤师昵称"
        />

      </n-space>
    </template>
    <template #footer>
      <n-space style="width: 280px" justify="space-between">
        <n-space>
          <n-tag :bordered="false" type="success" style="margin-left: 5px">标签</n-tag>
          <n-select
            v-model:value="selectValue"
            :options="options"
            style="width: 123px;"
            size="small"
            tag
            filterable
          />

        </n-space>
        <n-button :disabled="isCommit" type="error" size="small" @click="confirmShielding">拉黑一下</n-button>
      </n-space>
    </template>
    <n-space vertical>
      <n-input
        v-model:value="blacklistContent"
        type="textarea"
        autosize
        placeholder="请输入拉黑原因 ( 请选择当前所在大区 )"
        maxlength="250"
      />

    </n-space>
  </n-drawer-content>
</template>

<script setup lang="ts">
import {NSpace,NInput,NSelect,NTag,NButton,NDrawerContent,useMessage,NTreeSelect} from 'naive-ui'
import {ref,onBeforeMount} from "vue";
import {isStoreageHas} from "../../../lcu/utils";
import {invokeLcu} from "../../../lcu";
import {blacklistServe} from "../../../utils/request";
import assistStore from "../../../store/assistStore";
import {areaOptions} from "../../../resources/areaList";

const areaSetting = ref(localStorage.getItem('currentArea') as string)
let localBlacklist:any = JSON.parse(String(localStorage.getItem('blacklist'))) === null ? {}: JSON.parse(String(localStorage.getItem('blacklist')))
const props:any = defineProps({
  name:{
    type:String,
    default:''
  },
  summonerId:{
    type:String,
    default:''
  },
  gameAfterId:{
    type:Number,
    default:0
  },
  isHandAdd:{
    type:Boolean,
    default:true
  }
})
const selectValue = ref('摆烂')
const options = [
  {
    label: "摆烂",
    value: '摆烂',
  },{
    label: '牛马',
    value: '牛马'
  },{
    label: "演员",
    value: '演员',
  },{
    label: "脚本",
    value: '脚本',
  },{
    label: "挂机",
    value: '挂机',
  }
]
const blacklistContent = ref('')
const blacklistName = ref('')
const store = assistStore()
// const {onlinePlayerInfo,localSummonerInfo,addHater}: any= storeToRefs(store)
const message = useMessage()
const emits = defineEmits(['closeDra'])
const isCommit = ref(false)

// 判断当前召唤师是否存在于黑名单中
onBeforeMount(() => {
  if (props.summonerId !== '' && isStoreageHas('blacklist',props.summonerId)){
    const currentSummoner = localBlacklist[props.summonerId]
    blacklistContent.value = currentSummoner.content
    selectValue.value = currentSummoner.tag
  }
})


// 更新玩家信息
const updatePlayerInfo = async (haterSumId:string,areaSetting:string,playerSumId:string) => {
  if (store.onlinePlayerInfo.haterIdList[areaSetting]===undefined){
    store.onlinePlayerInfo.haterIdList[areaSetting]={}
  }
  if (store.onlinePlayerInfo.haterIdList[areaSetting][playerSumId]===undefined){
    store.onlinePlayerInfo.haterIdList[areaSetting][playerSumId]={
      sumIdList:[],
      nickname:store.localSummonerInfo.playerSumName
    }
  }
  const tempBlacklist = store.onlinePlayerInfo.haterIdList
  if (tempBlacklist[areaSetting][playerSumId]?.sumIdList.includes(haterSumId)){
    return true
  }
  tempBlacklist[areaSetting][playerSumId].sumIdList.push(haterSumId)
  const res = await blacklistServe({
    url:'/player/updatePlayer',
    method:'PUT',
    data:{
      ID: store.onlinePlayerInfo.ID,
      CreatedAt:store.onlinePlayerInfo.CreatedAt,
      playerId: store.onlinePlayerInfo.playerId,
      haterIdList: JSON.stringify(tempBlacklist)
    }
  })
  return res?.data?.code===0 ? true : false
}
// 更新Hater信息
const updateHaterInfo = async (summonerId:string,areaSetting:string,currentName:string) => {
  const gameId = props.gameAfterId !== 0 ? String(props.gameAfterId):""
  const haterStruct = {
    "sumId":summonerId,
    "area":areaSetting,
    "nickName":currentName,
    "signCount":1,
    "isShow":true
  }
  const blacklistStruct =[{
    "playerSumName": store.localSummonerInfo.playerSumName,
    "PlayerSumId": store.localSummonerInfo.playerSumId,
    "matchId": gameId,
    "sumId": summonerId,
    "tag": selectValue.value,
    "content": blacklistContent.value,
    "handAdd": props.isHandAdd,
    "isShow": true
  }]
  const res = await blacklistServe({
    url:'/hater/createHaterByFrank',
    method:'POST',
    data: {hater:haterStruct,blacklist:blacklistStruct}
  })
  return res?.data?.code===0 ? true : false
}

const confirmShielding = async () => {
  const currentName = props.name !== '' ? props.name : blacklistName.value

  if (areaSetting.value==='othercom' || areaSetting.value==='netcom' || areaSetting.value==='telecom'){
    message.error('请选择大区')
    return
  }
  if (currentName ===''){
    message.error('召唤师昵称不能为空 !')
    return
  }
  const summonerId = props.summonerId !== '' ?props.summonerId : await querySummonerId(currentName)

  if (summonerId === null){
    message.error('哎呀 召唤师不存在 !')
    return
  }
  if (blacklistContent.value ===''){
    message.error('拉黑原因不能为空 !')
    return
  }
  emits('closeDra','closeDra')

  const updatePlayer = await updatePlayerInfo(String(summonerId),areaSetting.value,store.localSummonerInfo.playerSumId)
  const updateHater = await updateHaterInfo(String(summonerId),areaSetting.value,currentName)
  if (updateHater && updatePlayer){
    message.success(`${currentName}   拉黑成功😡`)
    store.addHater += 1
  }else {
    message.error(`${currentName}   拉黑失败`)
  }

}

const querySummonerId = async (nickname:string) => {
  const res = await invokeLcu('get','/lol-summoner/v1/summoners',[nickname])
  if (res.success === false){
    return null
  }else
    return String(res.summonerId)
}

// 改变当前大区
const handleUpdateArea = (value:string) => {
  areaSetting.value = value
  localStorage.setItem('currentArea',value)
}
</script>

<style scoped>

</style>

<template>
  <n-drawer-content>
    <template #header>
      <n-space justify="space-between" style="width: 272px;align-items: center">
        <n-tag size="large" v-if="props.name!=''"  :bordered="false">{{props.name}}</n-tag>
        <n-input
          v-else
          style="width: 125px;"
          v-model:value="blacklistName"
          placeholder="输入召唤师昵称"
        />
        <n-tag size="large" :color="{ color: '#fafafc', textColor: '#9AA4AF' }"  :bordered="false">{{queryCurrenDate()}}</n-tag>
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
        <n-button type="error" size="small" @click="confirmShielding">拉黑一下</n-button>
      </n-space>
    </template>
    <n-space vertical>
      <n-input
        v-model:value="blacklistContent"
        type="textarea"
        autosize
        placeholder="请输入拉黑原因"
        maxlength="250"
      />

    </n-space>
  </n-drawer-content>
</template>

<script setup lang="ts">
import {NSpace,NInput,NSelect,NTag,NButton,NDrawerContent,useMessage} from 'naive-ui'
import {ref,onBeforeMount} from "vue";
import {isStoreageHas} from "../../lcu/utils";
import {invokeLcu} from "../../lcu";
import {PlayerInfo} from "../../interface/blacklistTypes";
import {blacklistServe} from "../../utils/request";
import {assistStore} from "../../store";
import {storeToRefs} from "pinia";

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
const {onlinePlayerInfo,localSummonerInfo}: any= storeToRefs(store)
const message = useMessage()
const emits = defineEmits(['closeDrawer'])

// 判断当前召唤师是否存在于黑名单中
onBeforeMount(() => {
  if (props.summonerId !== '' && isStoreageHas('blacklist',props.summonerId)){
    const currentSummoner = localBlacklist[props.summonerId]
    blacklistContent.value = currentSummoner.content
    selectValue.value = currentSummoner.tag
  }
})

const queryCurrenDate = () => {
  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1;
  let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate();
  return  year + "-" + month + "-" + day;
}

// 更新玩家信息
const updatePlayerInfo = async (haterSumId:string,areaSetting:string) => {
  const tempBlacklist = onlinePlayerInfo.value.haterIdList
  if (tempBlacklist[areaSetting].sumIdList.includes(haterSumId)){
    return true
  }
  tempBlacklist[areaSetting].sumIdList.push(haterSumId)
  onlinePlayerInfo.value.haterIdList = tempBlacklist
  const res = await blacklistServe({
    url:'/player/updatePlayer',
    method:'PUT',
    data:{
      ID: onlinePlayerInfo.value.ID,
      CreatedAt:onlinePlayerInfo.value.CreatedAt,
      playerId: onlinePlayerInfo.value.playerId,
      haterIdList: JSON.stringify(tempBlacklist)
    }
  })
  return res?.data?.code===0 ? true : false
}
// 更新Hater信息
const updateHaterInfo = async (summonerId:string,areaSetting:string,currentName:string) => {
  const haterStruct = {
    "sumId":summonerId,
    "area":areaSetting,
    "nickName":currentName,
    "signCount":1
  }
  const blacklistStruct =[{
    "playerSumName": localSummonerInfo.value.playerSumName,
    "PlayerSumId": localSummonerInfo.value.playerSumId,
    "matchId": "",
    "sumId": summonerId,
    "tag": selectValue.value,
    "content": blacklistContent.value,
    "handAdd": true,
    "isShow": false
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
  const areaSetting = JSON.parse(String(localStorage.getItem('config'))).currentArea
  if (currentName ===''){
    message.error('召唤师昵称不能为空 !')
    return
  }
  // const summonerId = props.summonerId !== '' ?props.summonerId : await querySummonerId(currentName)
  // const summonerId = String(Math.floor(Math.random() * 10000000))
  const summonerId = String(2022010)

  if (summonerId === null){
    message.error('哎呀 召唤师不存在 !')
    return
  }
  if (blacklistContent.value ===''){
    message.error('拉黑原因不能为空 !')
    return
  }

  const [updateHater,updatePlayer] = await Promise.all([
    updatePlayerInfo(summonerId,areaSetting),
    updateHaterInfo(String(summonerId),areaSetting,currentName)
  ])

  if (updateHater && updatePlayer){
    emits('closeDrawer','closeDrawer') //向父组件发送消息关闭抽屉
    message.success(`${currentName}   拉黑成功😡`)
  }else {
    message.error(`${currentName}   拉黑失败`)
  }

}

const querySummonerId = async (nickname:string) => {
  const res = await invokeLcu('get','/lol-summoner/v1/summoners',[nickname])
  if (res.success === false){
    return null
  }else
    return res.summonerId
}
</script>

<style scoped>

</style>

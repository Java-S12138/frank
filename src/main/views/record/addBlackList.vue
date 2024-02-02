<script setup lang="ts">
import {NDivider, NEllipsis, NInput, NTag, NButton, NAlert, NPopconfirm,useMessage} from "naive-ui";
import {onMounted, ref} from "vue";
import {HateIdListType, HaterStructTypes, UserInfos} from "@/main/views/record/blackListTypes";
import {sumInfoTypes} from "@/background/utils/backgroundTypes";
import {createHaterContent, updatePlayerRecord} from "@/main/utils/request";
import {useRecordStore} from "@/main/store/useRecord";

const {isHater,hInfo,platformId,gameId,backSelectState} = defineProps<{
  isHater:boolean,
  hInfo:{name:string,sumId:string,teamType:number},
  platformId:string,
  gameId:number,
  backSelectState:(teamType:number) => void
}>()

const recordStore = useRecordStore()
const content = ref('')
const message = useMessage()
const ThumbUp = ['玩得好，就得夸','超厉害，超喜欢','人品好，操作棒','节奏好，不拖沓','稳得很，绝不浪']
const ThumbDown = ['太抽象，人直吃','抢人头，不礼貌','不听劝，怪脾气','急急急，急先锋','害怕怕，离远点']
const tagIndex = ref( Math.floor(Math.random()*(4+1)) )
const localSumInfo:sumInfoTypes = JSON.parse((localStorage.getItem('sumInfo') as string))

const changeTagIndex = () => {
  tagIndex.value = (tagIndex.value += 1) % 5
}

const updateHaterInfo = async () => {
  const haterStruct:HaterStructTypes = {
    "sumId":hInfo.sumId,
    "area":platformId,
    "nickName":hInfo.name,
    "signCount":1,
    "isShow":true
  }
  const tagDetails = isHater ? ThumbDown[tagIndex.value]: ThumbUp[tagIndex.value]
  const conDetails = content.value=== '' ? tagDetails:content.value

  const blacklistStruct =[{
    "playerSumName": localSumInfo.name,
    "playerSumId": String(localSumInfo.summonerId),
    "matchId": String(gameId),
    "sumId": hInfo.sumId,
    "tag": isHater ?'气愤':'愉快',
    "content": conDetails,
    "handAdd": false,
    "isShow": isHater
  }]
  const res = await createHaterContent({
    url:'/hater/createHaterByFrank',
    method:'POST',
    data: {hater:haterStruct,blacklist:blacklistStruct}
  })
  return res
}
const updatePlayerInfo = async () => {
  const userInfos:UserInfos = JSON.parse(JSON.stringify(recordStore.userInfos))
  const tempHaterIdList:HateIdListType = JSON.parse(userInfos.haterIdList)

  tempHaterIdList[platformId] ||= {}
  tempHaterIdList[platformId][localSumInfo.summonerId] ||= {
    sumIdList: [],
    nickname: hInfo.name
  }
  if (tempHaterIdList[platformId][localSumInfo.summonerId].sumIdList.includes(hInfo.sumId)){
    return true
  }
  tempHaterIdList[platformId][localSumInfo.summonerId].sumIdList.push(hInfo.sumId)
  userInfos.haterIdList = JSON.stringify(tempHaterIdList)

  const res = await updatePlayerRecord({
    url:'/player/updatePlayer',
    method:'PUT',
    data:{
      ID: userInfos.ID,
      CreatedAt:userInfos.CreatedAt,
      playerId: userInfos.playerId,
      haterIdList: JSON.stringify(tempHaterIdList)
    }
  })
  return res
}

const handleAddData = async (teamType:number) => {
  backSelectState(teamType)
  if (await updatePlayerInfo()){
    if (await updateHaterInfo()){
      recordStore.init()
      message.success('数据添加成功')
    }else {
      message.error('数据添加失败')
    }
  }else {
    message.error('数据添加失败')
  }

}
const getData = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('0' + (now.getMonth() + 1)).slice(-2)
  const day = ('0' + now.getDate()).slice(-2)

  return year + '-' + month + '-' + day
}
</script>

<template>
  <div class="pb-2">
    <div class="flex justify-between">
      <n-tag size="large" :bordered="false">
        <n-ellipsis :tooltip="false" style="max-width: 170px">
          {{ hInfo.name }}
        </n-ellipsis>
      </n-tag>
      <n-tag :bordered="false" size="large" :disabled="true">
        {{ getData() }}
      </n-tag>
    </div>
    <n-divider style="margin: 16px 0;"/>
    <n-input
      v-model:value="content"
      type="textarea" spellcheck="false"
      autosize show-count
      maxlength="200"
      placeholder="请输入点赞原因，如果不想输入内容。自动填充左下角信息，点击标签，顺序切换内容"
      style="height: 120px;"
    />
    <n-divider dashed style="margin: 16px 0;"/>
    <div class="flex justify-between">
      <n-tag
        @click="changeTagIndex" class="cursor-pointer"
        :bordered="false" :type="isHater?'error':'success'">
        {{isHater? ThumbDown[tagIndex]: ThumbUp[tagIndex]}}
      </n-tag>

      <n-popconfirm
        :show-icon="false"
        @positive-click="handleAddData(hInfo.teamType)"
      >
        <template #trigger>
          <n-button
            :type="isHater?'error':'success'"
            :bordered="false" size="small" type="success">
            点赞一下
          </n-button>
        </template>
        是否添加到排位笔记
      </n-popconfirm>

    </div>
    <n-alert style="margin-top: 26px;" type="info">
      营造良好游戏环境从你我做起, Thanks !
    </n-alert>
  </div>
</template>



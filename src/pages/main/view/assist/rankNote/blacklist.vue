<template>
  <div>

    <n-card class="boxShadow listCard" size="small" content-style="padding:0px">
      <n-space v-if="onlineListStatus===0" style="margin: 10px 0px 10px 0px"
               justify="center" :size="[0,0]">
          <p style="color: #666F75;">当前大区暂无你的排位笔记哟</p>
          <p style="color: #666F75">愿你的排位笔记永远没有笔记</p>
      </n-space>
      <n-scrollbar v-else-if="onlineListStatus===1" style="height: 545px;margin-bottom: 5px">
        <n-list style="margin-right:13px;margin-left: 13px"
                class="fade-in-bottom" :key="blacklist.length">
          <div v-if="currentBlacklistStatus">
            <n-list-item v-for="blackSummoner in currentBlackList" >
              <n-space justify="space-between" class="alignCenter">
                <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #ff6666;"
                >
                  {{ blackSummoner.nickName }}
                </n-ellipsis>
                <p style="color: #ff6666"> {{ formatDate(blackSummoner.blacklist.UpdatedAt) }}</p>
                <n-button size="small" type="error"
                          :secondary="localSummonerInfo.playerSumId===blackSummoner.blacklist.playerSumId ? false : true"
                          @click="getDetails(blackSummoner.nickName,blackSummoner.blacklist)">
                  {{ showTagContent(blackSummoner.blacklist.tag) }}
                </n-button>
              </n-space>
            </n-list-item>
          </div>

          <n-list-item v-for="blackSummoner in blacklist">
            <n-space justify="space-between" class="alignCenter">
              <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #9aa4af;"
              >
                {{ blackSummoner.nickName }}
              </n-ellipsis>

              <p style="color: #9aa4af;"> {{ formatDate(blackSummoner.blacklist.UpdatedAt) }}</p>
              <n-button size="small" type="error"
                        :secondary="localSummonerInfo.playerSumId===blackSummoner.blacklist.playerSumId ? false : true"
                        @click="getDetails(blackSummoner.nickName,blackSummoner.blacklist)">
                        {{ showTagContent(blackSummoner.blacklist.tag) }}
              </n-button>
            </n-space>
          </n-list-item>
        </n-list>
      </n-scrollbar>
      <n-tag type="warning"  style="margin: 12px 0px 12px 23px"
             v-else-if="onlineListStatus===2" :bordered="false">
        服务器接口出现异常 请稍后再次尝试</n-tag>
    </n-card>

    <n-card class="boxShadow"  size="small" content-style="padding:10px 0px 5px 0px">
      <n-space justify="center" :size="[0,5]">
        <n-space style="width: 215px;" justify="space-between" >
          <n-tree-select
            size="small" :show-checkmark="false" :show-path="false"
            :menu-props="{style:'width:130px'}"
            @update:value="handleUpdateArea($event)"
            v-model:value="areaSetting" :options="areaOptions" >
          </n-tree-select>
          <n-button @click="addBlacklistActive=true" size="small">新增</n-button>
        </n-space>

        <div>
          <p style="color: #9aa4af;">营造良好游戏环境从你我做起
            <span style="color: #666F75;cursor: pointer">教程</span></p>

        </div>
      </n-space>
    </n-card>

    <n-drawer v-model:show="active"
              style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus = "false">
      <n-drawer-content body-content-style="padding-left:10px;padding-right:6px" >
        <template #header>
          <n-space justify="space-between" style="width: 272px;">
            <n-popover trigger="hover" :show-arrow="false" placement="right">
              <template #trigger>
                <n-tag size="large" style="cursor: pointer" @click="toMatch(undefined,detialsJson.sumId)"
                       :bordered="false" type="error" >{{detialsNickname}}</n-tag>
              </template>
              <p>点击查看此召唤师战绩</p>
            </n-popover>

            <n-popover v-if="detialsJson.isShow" trigger="hover" :show-arrow="false" placement="left">
              <template #trigger>
                <n-tag  size="large" :bordered="false" type="info">同舟共济</n-tag>
              </template>
              <p>此数据已共享给其他玩家使用</p>
            </n-popover>
            <n-tag :color="{ color: '#fafafc', textColor: '#9AA4AF' }" :bordered="false"
                   size="large" v-else>{{formatDate(detialsJson.UpdatedAt)}}</n-tag>

          </n-space>
        </template>
        <template #footer>
          <n-space v-if="localSummonerInfo.playerSumId===detialsJson.playerSumId" style="width: 270px;" justify="space-between">

            <n-popconfirm
              @positive-click="reviseContent"

              :show-icon="false" positive-text="修改" negative-text="取消"
            >
              <template #trigger>
                <n-tag type="error" :bordered="false"
                       style="font-size: 15px;cursor: pointer">{{detialsJson.tag}}</n-tag>
              </template>
              <n-input v-model:value="detialsJson.tag"
                       placeholder="输入标签"
                       type="text" style="width: 104px" />
            </n-popconfirm>
            <n-button secondary type="info" @click="toMatch(detialsJson.matchId,detialsJson.sumId)"
                      size="small" v-if="detialsJson.matchId!==''">查看对局</n-button>
            <n-space>
              <n-popconfirm
                :show-icon="false"
                @positive-click="reviseContent"
                negative-text="取消"
                positive-text="确定"
                placement="top-end"
              >
                <template #trigger>
                  <n-button secondary type="info" size="small">修改</n-button>
                </template>
                  <p>是否修改当前黑名单内容</p>

              </n-popconfirm>
              <n-popconfirm
                :show-icon="false"
                @positive-click="deleteBlackElement"
                negative-text="取消"
                positive-text="确定"
              >
                <template #trigger>
                  <n-button secondary type="info"  size="small">删除</n-button>
                </template>
                是否将当前召唤师移除黑名单
              </n-popconfirm>

            </n-space>

          </n-space>
          <n-space v-else style="width: 270px;" justify="space-between">
            <n-tag type="error" :bordered="false"
                   >{{detialsJson.tag}}
            </n-tag>
            <n-button secondary type="info" @click="toMatch(detialsJson.matchId,detialsJson.sumId)"
                      size="small" v-if="detialsJson.matchId!==''">查看对局</n-button>
            <n-popover trigger="hover" :show-arrow="false" placement="left">
              <template #trigger>
                <n-tag  :bordered="false" style="cursor: pointer"
                        @click="toMatch(undefined,detialsJson.playerSumId)"
                        type="info">{{detialsJson.playerSumName}}</n-tag>
              </template>
              <p>当前数据由此用户提供</p>
            </n-popover>

          </n-space>

        </template>
          <n-scrollbar style="max-height: 250px;">
            <n-input
              v-model:value="detialsJson.content"
              type="textarea"
              autosize
              placeholder="请输入拉黑原因"
              :bordered="false"
              style="padding-left: 6.5px"
            />
          </n-scrollbar>

        <p class="tipText" v-if="localSummonerInfo.playerSumId===detialsJson.playerSumId">点击文字区域可以修改黑名单内容</p>
      </n-drawer-content>
    </n-drawer>

    <pick-summoner @refreshList="addBlacklistFunc"></pick-summoner>

    <n-drawer v-model:show="addBlacklistActive"
              style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus="false">
      <add-blacklist
        @closeDrawer="addBlacklistFunc"
      ></add-blacklist>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import {NCard,NSpace,NList,NPopover,NInput,NTag,NPopconfirm,NTreeSelect,
  NListItem,NButton,NScrollbar,NEllipsis,NDrawer,NDrawerContent,useMessage} from 'naive-ui'
import {onMounted, Ref, ref, watch} from "vue"
import PickSummoner from "./pickSummoner.vue"
import AddBlacklist from "./addBlacklist.vue"
import {assistStore} from "../../../store";
import {storeToRefs} from "pinia";
import {blacklistServe} from "../../../utils/request";
import {OnlineBlacklistTpye, HaterItem} from "../../../interface/blacklistTypes";
import {areaOptions} from "../../../resources/areaList";
import {handleHaterListBySumId} from "../../../utils/blacklistUtils";
import {lcuSummonerInfo} from "../../../lcu/types/homeLcuTypes";
import {invokeLcu} from "../../../lcu";

const active = ref(false)
const addBlacklistActive = ref(false)
const blacklist:Ref<any> = ref([])
const detialsJson:Ref<HaterItem> = ref({
  "ID": 0,
  "CreatedAt": "",
  "UpdatedAt": "",
  "hId": 0,
  "playerSumName": "",
  "playerSumId": "",
  "matchId": "",
  "sumId": "",
  "tag": "",
  "content": "",
  "handAdd": false,
  "isShow": true
})
const detialsNickname = ref('')
const message = useMessage()
const areaSetting = ref(JSON.parse(<string>(localStorage.getItem('config'))).currentArea)
const store = assistStore()
const {currentBlackList,onlinePlayerInfo,localSummonerInfo}: any= storeToRefs(store)
const cubeUserId = ref('')
const onlineListStatus = ref(0)
const currentBlacklistStatus = ref(false)

watch(currentBlackList,() => {
  if (currentBlackList.value === 'add'){
    findHaterByHaterId(onlinePlayerInfo.value.haterIdList[areaSetting.value][localSummonerInfo.value.playerSumId].sumIdList)
    currentBlackList.value = []
    return
  }
  if (currentBlackList.value.length !== 0){
    currentBlacklistStatus.value = true
    onlineListStatus.value = 1
    if (currentBlackList.value.length === 1){
      const haterItem = currentBlackList.value[0]
      getDetails(haterItem.nickName,haterItem.blacklist)
    }
  }else {
    currentBlacklistStatus.value = false
    if (blacklist.value.length === 0){
      onlineListStatus.value = 0
    }
  }
})

onMounted(async () => {
  await queryLocalSummonerInfo()
  cubeUserId.value =(await cube.profile.getCurrentUser()).userId
  queryBlacklist()
})

// 从本地查询黑名单列表
const queryBlacklist = async () => {
  if (areaSetting.value==='othercom' || areaSetting.value==='netcom' || areaSetting.value==='telecom'){
    message.warning('请选择大区')
    return
  }
  const res = await  blacklistServe({
    url:'/player/findPlayerByPlayerId',
    params:{'playerId':cubeUserId.value},
    method:'GET'
  })

  console.log(res.data)
  if (res.data.code !== 0){
    onlineListStatus.value=2
    message.error('接口出现异常')
    return
  }
  onlinePlayerInfo.value = res.data.data
  onlinePlayerInfo.value.haterIdList = JSON.parse(res.data.data.haterIdList)
  if (onlinePlayerInfo.value.haterIdList[areaSetting.value] === undefined){
    return
  }
  const onlineBlacklist:OnlineBlacklistTpye = onlinePlayerInfo.value.haterIdList[areaSetting.value][localSummonerInfo.value.playerSumId]
  if (onlineBlacklist?.sumIdList?.length > 0){
    findHaterByHaterId(onlineBlacklist.sumIdList)
  }else {
    onlineListStatus.value = 0
  }
}

// 通过HaterId查询数据
const findHaterByHaterId = async (haterIdList:string[]) => {

  const res = await  blacklistServe({
    url:'/hater/findHaterBySumId',
    data:{'sumIdList':haterIdList,'area':areaSetting.value},
    method:'POST'
  })
  if (res.data.code !== 0){
    onlineListStatus.value=2
    blacklist.value.length = 0
    message.error('接口出现异常')
    return
  }
  if (res.data.data?.length !== 0){
    const hater = await handleHaterListBySumId(res.data.data,localSummonerInfo.value.playerSumId)
    blacklist.value = hater.blackList
    if (hater.existHater.length !== haterIdList.length){
      console.log('玩家的haterList长度发生变化改变')
      // 玩家的haterList长度发生变化改变
      changePlayerSumIdList(hater.existHater)
    }
    blacklist.value.sort((x:any,y:any) => {return y.blacklist.ID-x.blacklist.ID})
    onlineListStatus.value = 1
  }else {
    changePlayerSumIdList([])
    blacklist.value.length = 0
    onlineListStatus.value = 0
  }

}

// 玩家的haterList长度发生变化改变
const changePlayerSumIdList =async (list:any[]) => {
  onlinePlayerInfo.value.haterIdList[areaSetting.value][localSummonerInfo.value.playerSumId].sumIdList = list
  blacklistServe({
    url: '/player/updatePlayer',
    method: 'PUT',
    data: {
      ID: onlinePlayerInfo.value.ID,
      playerId: onlinePlayerInfo.value.playerId,
      haterIdList: JSON.stringify(onlinePlayerInfo.value.haterIdList)
    }
  })
}

// 格式化数据库时间格式
const formatDate = (dateStr:string) => {
  return dateStr.split('T')[0]
}

const queryCurrenDate = () => {
  let nowDate = new Date()
  let year = nowDate.getFullYear()
  let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1
  let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate()
  return  year + "-" + month + "-" + day
}

// 获取单个召唤师的详细信息
const getDetails = (nickname:string,haterItem:HaterItem) => {
  detialsJson.value = haterItem
  detialsNickname.value = nickname
  active.value = true
}
// 修改黑名单内容
const reviseContent = async () => {
  active.value = false
  const res = await blacklistServe({
    url:'/blacklist/updateBlacklist',
    data:detialsJson.value,
    method:'PUT'
  })
  if (res.data?.code===0){
    detialsJson.value.UpdatedAt = queryCurrenDate()
    message.success('修改内容成功')
  }else {
    message.error('提交修改内容失败')
    queryBlacklist()
  }

}

// 删除某个黑名单
const deleteBlackElement = async () => {
  active.value = false
  // 根据黑名单的内容 删除对应的黑名单
  const res = await blacklistServe({
    url:'/blacklist/deleteBlacklist',
    data:detialsJson.value,
    method:'DELETE'
  })
  if (res.data?.code===0){
    if (await isHavaItem(detialsJson.value.sumId,detialsJson.value.hId)){
      const haterIdList:OnlineBlacklistTpye =  onlinePlayerInfo.value.haterIdList[areaSetting.value][localSummonerInfo.value.playerSumId]
      message.success('删除成功')
      findHaterByHaterId(haterIdList.sumIdList)
    }else {
      message.error('删除失败')
    }
  }else {
    message.error('删除失败')
    queryBlacklist()
  }
}
// 判断当前召唤师删除的Hater是否还有剩余内容
const isHavaItem = async (sumId:string,hId:number) => {
  try {
    // 根据Hater的召唤师 查询当前Hater的黑名单数据
    const res = await blacklistServe({
      url:'blacklist/getBlacklistList',
      params:{sumId:sumId,hId:hId},
      method:'GET'
    })
    if (res.data?.code===0) {
      // 判断Hater的黑名单中是否还存在 本地召唤师添加的数据
      // 如果不存在, 需要更新Player里面的数据
      const isHasLocal = res.data?.data?.list.find(
        (i: HaterItem) => (i.playerSumId === localSummonerInfo.value.playerSumId))
      if (isHasLocal === undefined) {
        const tempBlacklist = onlinePlayerInfo.value.haterIdList
        const index = tempBlacklist[areaSetting.value][localSummonerInfo.value.playerSumId].sumIdList.indexOf(sumId)
        if (index > -1) {
          tempBlacklist[areaSetting.value][localSummonerInfo.value.playerSumId].sumIdList.splice(index, 1)
        }
        blacklistServe({
          url: '/player/updatePlayer',
          method: 'PUT',
          data: {
            ID: onlinePlayerInfo.value.ID,
            playerId: onlinePlayerInfo.value.playerId,
            haterIdList: JSON.stringify(tempBlacklist)
          }
        })
      }
      // 如果Hater的黑名单数据为空, 删除当前的Hater
      if (res.data?.data?.list.length === 0) {
        blacklistServe({
          url: '/hater/deleteHater',
          method: 'DELETE',
          data: {ID: hId}
        })
      }
      return true
    }else {
      return false
    }
  }catch (e) {
    return false
  }
}
// 通过字数判断展示标签的内容
const showTagContent = (tag:string) => {
  return tag.length === 2 ? tag : '原因'
}
// 新增黑名单
const addBlacklistFunc = () => {
  findHaterByHaterId((onlinePlayerInfo.value.haterIdList)[areaSetting.value][localSummonerInfo.value.playerSumId].sumIdList)
  addBlacklistActive.value=false
}
// 更新排位日记
cube.windows.message.on('received',(id:any) => {
  if (id==='updataBL'){
    queryBlacklist()
  }
})
// 改变当前大区
const handleUpdateArea = (value:string) => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  blacklist.value.length = 0
  areaSetting.value = value
  config.currentArea = value
  localStorage.setItem('config', JSON.stringify(config))
  queryBlacklist()
}
// 查看对局
const toMatch = async (matchId:string,summonerId:string) => {
  localStorage.setItem('initQueryMatch',JSON.stringify({matchId:matchId,summonerId:summonerId}))
  const queryMatch = await cube.windows.obtainDeclaredWindow('queryMatch')
  if (queryMatch!==undefined){
    cube.windows.message.send(queryMatch.id,'refresdh-window','')
  }
}
// 获取本地召唤师信息
const queryLocalSummonerInfo = async () => {
  const summonerInfo:lcuSummonerInfo = await invokeLcu('get','/lol-summoner/v1/current-summoner')
  localSummonerInfo.value.playerSumId = `${summonerInfo.summonerId}`
  localSummonerInfo.value.playerSumName = summonerInfo.displayName
}
</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}

.alignCenter {
  align-items: center;
}
.n-scrollbar > .n-scrollbar-rail.n-scrollbar-rail--vertical {
  right: 15px !important;
  position: absolute;
}
.tipText{
  position: absolute;
  bottom: 65px;
  left: 22%;
  font-size: 12px;
  color: #9aa4af;
}
.fade-in-bottom{-webkit-animation:fade-in-bottom .6s cubic-bezier(.39,.575,.565,1.000) both;animation:fade-in-bottom .6s cubic-bezier(.39,.575,.565,1.000) both}

@keyframes fade-in-bottom{0%{-webkit-transform:translateY(50px);transform:translateY(50px);opacity:0}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}
</style>

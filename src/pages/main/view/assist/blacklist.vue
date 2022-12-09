<template>
  <div>

    <n-card class="boxShadow listCard" size="small" content-style="padding:0px">
      <n-space v-if="blacklist.length=== 0" style="margin: 10px 0px 10px 0px"
               justify="center" :size="[0,0]">
          <p style="color: #666F75;">当前大区暂无你的排位笔记哟</p>
          <p style="color: #666F75">愿你的排位笔记永远没有笔记</p>
      </n-space>
      <n-scrollbar v-else style="max-height: 525px;">
        <n-list style="margin-right:13px;margin-left: 13px" >
          <n-list-item v-for="blackSummoner in blacklist">
            <n-space justify="space-between" class="alignCenter">
              <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #ff6666;"
                          v-if="currentBlackList.indexOf(blackSummoner.sumId) !=-1"
              >
                {{ blackSummoner.nickName }}
              </n-ellipsis>
              <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #9aa4af;" v-else
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
            <n-tag size="large" :bordered="false" type="error" >{{detialsNickname}}</n-tag>
            <n-popover v-if="detialsJson.isShow" trigger="hover" :show-arrow="false" placement="left">
              <template #trigger>
                <n-tag  size="large" :bordered="false" type="success">净化</n-tag>
              </template>
              <p>当前数据已共享给其他召唤师使用</p>
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
                       style="font-size: 15px">{{detialsJson.tag}}</n-tag>
              </template>
              <n-input v-model:value="detialsJson.tag"
                       placeholder="输入标签"
                       type="text" style="width: 104px" />
            </n-popconfirm>

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
                   >{{detialsJson.tag}}</n-tag>
              <n-popover trigger="hover" :show-arrow="false" placement="left">
                <template #trigger>
                  <n-tag  :bordered="false" type="success">{{detialsJson.playerSumName}}</n-tag>
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

    <pick-summoner @refreshList="queryBlacklist"></pick-summoner>

    <n-drawer v-model:show="addBlacklistActive"
              style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus="false">
      <add-blacklist
        @closeDrawer="addBlacklistFunc"
        :onlinePlayerInfo="onlinePlayerInfo"
        :localSummonerInfo="localSummonerInfo"
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
import {assistStore} from "../../store";
import {storeToRefs} from "pinia";
import {blacklistServe} from "../../utils/request";
import {OnlineBlacklistTpye,HaterItem,Hater,PlayerInfo} from "../../interface/blacklistTypes";
import {areaOptions} from "../../resources/areaList";

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
let localBlacklist:any = JSON.parse(String(localStorage.getItem('blacklist')))
const areaSetting = ref(JSON.parse(String(localStorage.getItem('config'))).currentArea)
const store = assistStore()
const {currentBlackList}:any = storeToRefs(store)
const localSummonerInfo = ref({playerSumId:'2001001',playerSumName:'多元函数积分学'})
const cubeUserId = ref('')
const onlinePlayerInfo:Ref<PlayerInfo>|Ref<null> = ref(null)

watch(currentBlackList.value,() => {
  if (currentBlackList.value.length === 1){
    // getDetails(currentBlackList.value[0])
  }
  if (currentBlackList.value.value !==0){
    const loaclBlacklistSummonerId: any[] = []
    for (const blacklistElement of blacklist.value) {
      loaclBlacklistSummonerId.push(blacklistElement[4])
    }
    for (const currentSummonerId of currentBlackList.value) {
      if (loaclBlacklistSummonerId.indexOf(currentSummonerId) !== -1){
        shiftFirst(currentSummonerId)
      }
    }
  }
})

onMounted(async () => {
  // TODO 获取本地召唤师信息 初步方案 luc连接成功后 再打开助手窗口
  cubeUserId.value =(await cube.profile.getCurrentUser()).userId
  queryBlacklist()
})

// 将某个元素移动到数组首位
const shiftFirst = (currentSummonerId:number) => {
  let tempArr:any[] = []
  blacklist.value.forEach((item:any,index:number)=>{
    if(item[4] === currentSummonerId){
      tempArr = item
      blacklist.value.splice(index,1)
      return
    }
  })
  blacklist.value.unshift(tempArr)
}

// 从本地查询黑名单列表
const queryBlacklist = async () => {
  onlinePlayerInfo.value = null
  if (areaSetting.value==='othercom' || areaSetting.value==='netcom' || areaSetting.value==='telecom'){
    message.warning('请选择大区')
    return
  }
  const res = await  blacklistServe({
    url:'/player/findPlayerByPlayerId',
    params:{'playerId':cubeUserId.value},
    method:'GET'
  })
  if (res.status !== 200 && res.data.code !== 0){
    message.error('接口出现异常')
    return
  }
  onlinePlayerInfo.value = res.data.data
  const onlineBlacklist:OnlineBlacklistTpye =  JSON.parse(res.data.data.haterIdList)[areaSetting.value]
  if (onlineBlacklist?.sumIdList?.length > 0){
    findHaterByHaterId(onlineBlacklist.sumIdList)
  }
}

// 通过HaterId查询数据
const findHaterByHaterId = async (haterIdList:string[]) => {
  blacklist.value.length = 0
  const res = await  blacklistServe({
    url:'/hater/findHaterBySumId',
    data:{'sumIdList':haterIdList},
    method:'POST'
  })
  if (res.status !== 200){
    message.error('接口出现异常')
    return
  }
  const haterList:Hater[] =  res.data.data
  for (const haterItem of haterList) {
    const blacklistHater:HaterItem[] = haterItem.blacklist
    for (const blacklistItem of blacklistHater) {
      if (localSummonerInfo.value.playerSumId===blacklistItem.playerSumId){
        blacklist.value.push({
          sumId:haterItem.sumId,nickName:haterItem.nickName,blacklist:blacklistItem
        })
      }else if (blacklistItem.isShow) {
        blacklist.value.push({
          sumId: haterItem.sumId, nickName: haterItem.nickName, blacklist: blacklistItem
        })
      }
    }
  }
  blacklist.value.sort((x:any,y:any) => {return y.blacklist.ID-x.blacklist.ID})
}

// 格式化数据库时间格式
const formatDate = (dateStr:string) => {
  return dateStr.split('T')[0]
}
const queryCurrenDate = () => {
  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1;
  let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate();
  return  year + "-" + month + "-" + day;
}

// 获取单个召唤师的详细信息
const getDetails = (nickname:string,haterItem:HaterItem) => {
  console.log(haterItem)
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
  if (res.status===200){
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
  const res = await blacklistServe({
    url:'/blacklist/deleteBlacklist',
    data:detialsJson.value,
    method:'DELETE'
  })
  if (res.status===200){
    isHavaItem(detialsJson.value.sumId,detialsJson.value.hId)
    message.success('修改内容成功')
    queryBlacklist()
  }else {
    message.error('删除名单失败')
    queryBlacklist()
  }
}
// 判断当前召唤师删除的Hater是否还有剩余内容
const isHavaItem = async (sumId:string,hId:number) => {
  const res = await blacklistServe({
    url:'blacklist/getBlacklistList',
    params:{sumId:sumId},
    method:'GET'
  })
  if (res.status===200){
    const localCount = res.data?.data?.list.find(
      (i:any) => (i.playerSumId===localSummonerInfo.value.playerSumId))
    if (localCount===undefined){
      const tempPlayerInfo = <PlayerInfo><unknown>onlinePlayerInfo.value
      const tempBlacklist = JSON.parse(tempPlayerInfo.haterIdList)
      let index = tempBlacklist[areaSetting.value].sumIdList.indexOf(sumId)
      if(index > -1) {
        tempBlacklist[areaSetting.value].sumIdList.splice(index,1)
      }
      tempPlayerInfo.haterIdList =  JSON.stringify(tempBlacklist)
      blacklistServe({
        url:'/player/updatePlayer',
        method:'PUT',
        data:tempPlayerInfo
      })
    }
    if (res.data?.data?.list.length===0){
      blacklistServe({
        url:'/hater/deleteHater',
        method:'DELETE',
        data: {ID:hId}
      })
    }
  }
}
// 通过字数判断展示标签的内容
const showTagContent = (tag:string) => {
  return tag.length === 2 ? tag : '原因'
}
// 新增黑名单
const addBlacklistFunc = () => {
  queryBlacklist()
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
  const config = JSON.parse(String(localStorage.getItem('config')))
  blacklist.value.length = 0
  areaSetting.value = value
  config.currentArea = value
  localStorage.setItem('config', JSON.stringify(config))
  queryBlacklist()
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
</style>

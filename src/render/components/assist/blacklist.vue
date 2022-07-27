<template>
  <div >
    <n-card class="boxShadow listCard"  size="small">
      <n-scrollbar style="max-height: 525px;">
        <n-list style="margin-right:13px;margin-left: 13px" >
          <n-list-item v-for="blackSummoner in blacklist">
            <n-space justify="space-between" class="alignCenter">
                <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #ff6666;"
                v-if="currentBlackList.indexOf(blackSummoner[0]) !=-1"
                >
                {{ blackSummoner[0] }}
              </n-ellipsis>
              <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #9aa4af;" v-else
              >
                {{ blackSummoner[0] }}
              </n-ellipsis>

              <p style="color: #9aa4af;"> {{ blackSummoner[1] }}</p>
              <n-button size="small" type="error" dashed @click="getDetails(blackSummoner[0])"> {{ showTagContent(blackSummoner[2]) }}</n-button>
            </n-space>
          </n-list-item>
      </n-list>
      </n-scrollbar>
    </n-card>
    <n-card class="boxShadow"  size="small" >
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-space justify="center" :size="[0,-1]" @click="addBlacklistActive=true">
            <p style="color: #9aa4af;">珍爱生命 远离摆烂</p>
            <p style="color: #9aa4af;">营造良好游戏环境从你我做起</p>
          </n-space>
        </template>
        <span>点击此处  新增黑名单</span>
      </n-popover>

    </n-card>

    <n-drawer v-model:show="active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus = "false" >
      <n-drawer-content >
        <template #header>
          <n-space justify="space-between" style="width: 272px;">
            <n-tag size="large"  :bordered="false">{{detialsJson.name}}</n-tag>
            <n-tag size="large"  :bordered="false">{{detialsJson.date}}</n-tag>

          </n-space>
        </template>
        <template #footer>
          <n-space style="width: 270px;" justify="space-between">
            <n-popconfirm
              @positive-click="reviseTag"
              :show-icon="false" positive-text="修改" negative-text="取消"
            >
              <template #trigger>
                <n-tag type="error" :bordered="false"
                       style="font-size: 15px">{{detialsJson.tag}}</n-tag>
              </template>
              <n-input v-model:value="detialsJson.tag"
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
        </template>
          <n-scrollbar style="max-height: 250px;">
            <n-input
              v-model:value="detialsJson.content"
              type="textarea"
              autosize
              placeholder="请输入拉黑原因"
              :bordered="false"
              style="padding-left: 6px"
            />
          </n-scrollbar>

        <p class="tipText">点击文字区域可以修改黑名单内容</p>
      </n-drawer-content>
    </n-drawer>

    <pick-summoner @refreshList="queryBlacklist"></pick-summoner>

    <n-drawer v-model:show="addBlacklistActive" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="420" placement="bottom" :auto-focus="false">
      <add-blacklist @closeDrawer="addBlacklistFunc"></add-blacklist>
    </n-drawer>
  </div>
</template>

<script setup>
import {NCard,NSpace,NList,NPopover,NInput,NTag,NPopconfirm,
  NListItem,NButton,NScrollbar,NEllipsis,NDrawer,NDrawerContent,useMessage} from 'naive-ui'
import {onMounted, reactive, ref} from "vue"
import PickSummoner from "./pickSummoner.vue"
import {appConfig} from "@/utils/main/config";
import AddBlacklist from "./addBlacklist.vue"
import {useStore} from "@/render/store";
import {storeToRefs} from "pinia/dist/pinia";

const active = ref(false)
const addBlacklistActive = ref(false)
const blacklist = ref([])
const detialsJson = reactive({name:'',date:'',content:'',tag:''})
const message = useMessage()
let localBlacklist
const store = useStore()
const {currentBlackList} = storeToRefs(store)



onMounted(() => {
  let divListCard = document.querySelectorAll("div.n-card.n-card--bordered.boxShadow.listCard > div")
  divListCard[0]['style'] = "padding-left:0px;padding-right:0px"
  queryBlacklist()
    if (currentBlackList.value.length === 1){
      getDetails(currentBlackList.value[0])
    }
    for (const blacklistElement of blacklist.value) {
      for (const currentName of currentBlackList.value) {
        if (blacklistElement.indexOf(currentName) != -1){
          shiftFirst(currentName)
        }
      }
    }
})
// 将某个元素移动到数组首位
const shiftFirst = (currentName) => {
  let tempArr = []
  blacklist.value.forEach((item,index)=>{
    if(item[0] === currentName){
      tempArr = item
      blacklist.value.splice(index,1)
      return
    }
  })
  blacklist.value.unshift(tempArr)
}

// 从本地查询黑名单列表
const queryBlacklist = () => {
  blacklist.value = []
  localBlacklist = appConfig.get('blacklist')
  // 获取黑名单数据
  for (const black in localBlacklist) {
    let tempList = [black,localBlacklist[black].date,
      localBlacklist[black].tag,localBlacklist[black].timestamp]
    blacklist.value.push(tempList)
  }
  blacklist.value.sort((x,y) => {return y[3]-x[3]})
  console.log(blacklist.value)
}
// 获取单个召唤师的详细信息
const getDetails = (summonerName) => {
  detialsJson.name = summonerName
  const currentData = localBlacklist[summonerName]
  detialsJson.date = currentData.date
  detialsJson.content = currentData.content
  detialsJson.tag = currentData.tag
  active.value = true
}
// 修改黑名单内容
const reviseContent = () => {
  appConfig.set(`blacklist.${detialsJson.name}.content`,detialsJson.content)
  queryBlacklist()
  active.value = false
  message.success('修改内容成功')
}
// 修改标签内容
const reviseTag = () => {
  appConfig.set(`blacklist.${detialsJson.name}.tag`,detialsJson.tag)
  queryBlacklist()
  active.value = false
  message.success('修改标签成功')
}
// 删除某个黑名单
const deleteBlackElement = () => {
  appConfig.delete(`blacklist.${detialsJson.name}`)
  queryBlacklist()
  active.value = false
}
// 通过字数判断展示标签的内容
const showTagContent = (tag) => {
  if (tag.length === 2){
    return tag
  }else {
    return '原因'
  }
}
// 新增黑名单
const addBlacklistFunc = () => {
  queryBlacklist()
  addBlacklistActive.value=false
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

<template>
  <div >
    <n-card class="boxShadow listCard"  size="small">
      <n-scrollbar style="max-height: 525px;">
        <n-list style="margin-right:13px;margin-left: 13px">
          <n-list-item v-for="blackSummoner in blacklist">
            <n-space justify="space-between" class="alignCenter">
                <n-ellipsis style="
                max-width: 112px;
                width:112px;
                color: #9aa4af;
                ">
                {{ blackSummoner[0] }}
              </n-ellipsis>

              <p style="color: #9aa4af;"> {{ blackSummoner[1] }}</p>
              <n-button size="small" type="error" dashed @click="getDetails(blackSummoner[0])"> {{ blackSummoner[2] }}</n-button>
            </n-space>
          </n-list-item>
      </n-list>
      </n-scrollbar>
    </n-card>
    <n-card class="boxShadow"  size="small" >
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-space justify="center" :size="[0,-1]">
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
          <n-space justify="space-between" style="width: 270px;">
            <p style="font-size: 15px">{{detialsJson.name}}</p>
            <p style="font-size: 15px">{{detialsJson.date}}</p>
          </n-space>
        </template>
        <template #footer>
          <n-space>
            <n-tag type="error" :bordered="false"
                   style="font-size: 15px;margin-right: 107px">{{detialsJson.tag}}</n-tag>
            <n-button type="default" size="small" @click="reviseContent">修改</n-button>
            <n-popconfirm
              :show-icon="false"
              @positive-click="deleteBlackElement"
              negative-text="取消"
              positive-text="确定"
            >
              <template #trigger>
                <n-button type="default" size="small">删除</n-button>
              </template>
              是否将当前召唤师移除黑名单
            </n-popconfirm>
          </n-space>
        </template>
        <n-input
          v-model:value="detialsJson.content"
          type="textarea"
          autosize
          placeholder="请输入拉黑原因"
          :bordered="false"
        />
      </n-drawer-content>
    </n-drawer>

    <pick-summoner></pick-summoner>
  </div>
</template>

<script setup>
import {NCard,NSpace,NList,NPopover,NInput,NTag,NPopconfirm,
  NListItem,NButton,NScrollbar,NEllipsis,NDrawer,NDrawerContent,useMessage} from 'naive-ui'
import {onMounted, reactive, ref} from "vue"
import PickSummoner from "./pickSummoner.vue"
import {appConfig} from "@/utils/main/config";

const active = ref(false)
const localBlacklist = appConfig.get('blacklist')
const blacklist = ref([])
const detialsJson = reactive({name:'',date:'',content:'',tag:''})
const message = useMessage()

onMounted(() => {
  let divListCard = document.querySelectorAll("div.n-card.n-card--bordered.boxShadow.listCard > div")
  divListCard[0]['style'] = "padding-left:0px;padding-right:0px"
  queryBlacklist()
})

const queryBlacklist = () => {
  blacklist.value = []
  // 获取黑名单数据
  for (const black in localBlacklist) {
    let tempList = [black,localBlacklist[black].date,localBlacklist[black].tag]
    blacklist.value.push(tempList)
  }
}

const getDetails = (summonerName) => {
  detialsJson.name = summonerName
  const currentData = appConfig.get(`blacklist.${summonerName}`)
  detialsJson.date = currentData.date
  detialsJson.content = currentData.content
  detialsJson.tag = currentData.tag
  active.value = true
}
const reviseContent = () => {
  const reviseJson = {date:detialsJson.date,content:detialsJson.content,tag:detialsJson.tag}
  appConfig.set(`blacklist.${detialsJson.name}`,reviseJson)
  message.success('修改内容成功')
}
const deleteBlackElement = () => {
  appConfig.delete(`blacklist.${detialsJson.name}`)
  queryBlacklist()
  active.value = false
}

</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}
.listCard {
  padding: 0px !important;
}
.alignCenter {
  align-items: center;
}
.n-scrollbar > .n-scrollbar-rail.n-scrollbar-rail--vertical {
  right: 15px !important;
  position: absolute;
}
</style>

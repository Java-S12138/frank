<script setup lang="ts">
import {ref} from "vue";
import {useMessage} from "naive-ui"
import {useRouter} from "vue-router";
import Dashboard from "./common/dashboard.vue"
import Navigation from "./common/navigation.vue";
import {useRuneStore} from "@/main/store/useRune";
import {useTeammateStore} from "@/main/store/useTeammate";
import {queryFriendInfo} from "@/main/pages/assist/views/teammate/utils";

const router = useRouter()
const curPos = ref(0)
const curFlow = ref('None')
const message = useMessage()
const teammateStore = useTeammateStore()
const runeStore = useRuneStore()

router.push({name:'home'})

cube.windows.message.on('received',(id,content) => {
  switch (id) {
    case 'None':
      teammateStore.clearStore()
      runeStore.clearStore()
      return changeState(id,'home',0)
    case 'ChampSelect':
      return
      // return changeState(id,'rank',1)
    case 'CSSession':
      return hanleCSSession(id,content)
    case 'Champion':
      return hanleChampion(id,content)
  }
})
// 处理Champion状态
const hanleChampion = (id:string,content:any) => {
  if (content===0){
    return
  }
  runeStore.initStore(content).then((res) => {
    if (res){
      message.error('当前英雄暂无符文数据')
    }else {
      changeState(id,'rune',3)
    }
  })

}
// 处理CSSession状态
const hanleCSSession = (id:string,content:any) => {
  queryFriendInfo(content).then((SummonerInfoList) => {
    teammateStore.initStore(SummonerInfoList,0)
    changeState(id,'teammate',2)
  })
}
// 改变页面
const changeState = (id:string,page:string,index:number) => {
  curFlow.value = id
  navigateToPage(page,index)
}
// 改变底部页面图标
const navigateToPage = (page:string,index:number) => {
  if ((index === 2 && curFlow.value === 'None') || (index === 3 && curFlow.value !== 'Champion')) {
    message.warning('当前状态无法查看此页面', {duration:1000})
    return
  }
  curPos.value = index
  router.push({name:page})
}

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard/>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <navigation :cur-pos="curPos" :navigate-to-page="navigateToPage"/>
  </div>
</template>

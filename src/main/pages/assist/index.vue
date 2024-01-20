<script setup lang="ts">
import {useRouter} from "vue-router";
import Dashboard from "./common/dashboard.vue"
import Navigation from "./common/navigation.vue";
import {useMessage} from "naive-ui"
import {ref} from "vue";
import {useTeammateStore} from "@/main/store/useTeammate";
import {queryFriendInfo} from "@/main/pages/assist/views/teammate/utils";

const router = useRouter()
const curPos = ref(0)
const curFlow = ref('None')
const message = useMessage()
const teammateStore = useTeammateStore()
router.push({name:'home'})

cube.windows.message.on('received',(id,content) => {
  switch (id) {
    case 'None':
      teammateStore.clearStore()
      return changeState(id,'home',0)
    case 'ChampSelect':
      getFriInfo()
      return changeState(id,'rank',1)
  }
})

// 获取队友数据 在ChampSelect状态中
const getFriInfo = () => {
  setTimeout(async() => {
    teammateStore.summonerInfo = await queryFriendInfo()
    setTimeout(() => {
      changeState('ChampSelect','teammate',2)
    },5000)
  },1500)
}
// 改变页面
const changeState = (id:string,page:string,index:number) => {
  curFlow.value = id
  navigateToPage(page,index)
}
// 改变底部页面图标
const navigateToPage = (page:string,index:number) => {
  switch (index) {
    case 2:
    case 3:
      if (curFlow.value !== 'ChampSelect'){
        message.warning('当前状态无法查看此页面')
        return
      }
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

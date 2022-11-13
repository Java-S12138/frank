<template>
  <div class="boxShadow match">
    <n-space style="margin: 12px" :style="props.isTeamOne===false?'flex-direction: row-reverse':''"
             v-for="match in props.matchList">
      <n-avatar
        :size="65"
        :src="match.championUrl"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        style="display:block;"
      />
      <n-space vertical :size="[0,6.5]">
        <n-space style="width:445px;margin-top: -4px"
                 :style="props.isTeamOne===false?'flex-direction: row-reverse':''" justify="space-between">
         <n-tag size="tiny" style="width: 122px;padding: 0px"
                :style="props.isTeamOne===false?'flex-direction: row-reverse':''"
                :bordered="false" :color="{ color: '#ffffff', textColor: '#2080f0' }">{{match.summonerName}}</n-tag>
         <n-tag size="tiny" :bordered="false" style="width: 96px;justify-content: center"
                :color="{ color: '#f5f5f5', textColor: '#9AA4AF' }">{{ match.rankPoint[0] }}</n-tag>
         <n-tag size="tiny" :bordered="false" style="width: 96px;justify-content: center"
                :color="{ color: '#f5f5f5', textColor: '#9AA4AF' }">{{ match.rankPoint[1] }}</n-tag>
         <n-tag size="tiny" :bordered="false"
                type="info">主玩位置  中单</n-tag>
        </n-space>
        <n-space :size="[5,0]" style="width: 445px;"
                 :style="props.isTeamOne===false?'flex-direction: row-reverse':''">
          <div class="avatarCommon" :class="champ.isWin===true? 'avatarWin' :'avatarDefeat'"
               v-for="champ in match.mathcHistory">
            <n-avatar
              :size="30"
              :src="champ.champImg"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display:block;"
            />
          </div>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,NAvatar,
  NInput,NTag,NSelect} from 'naive-ui'
import {watch} from "vue";

const props:any = defineProps({
  isTeamOne:{
    type:Boolean
  },
  matchList:{
    type:Array,
    default:[]
  }
})

watch(props,() => {
  console.log(props.matchList)
})


</script>

<style scoped>
.match {
  width: 546px;
  height: 397px;
  border-radius: 10px;
  background: #ffffff;
}
.avatarCommon{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 3px;
}
.avatarDefeat {
  border:2px solid rgba(255, 102, 102, 0.8);
  background-color: rgba(255, 102, 102, 0.5);
}
.avatarWin {
  border:2px solid rgba(24, 180, 120, 0.8);
  background-color: rgba(24, 180, 120, 0.5);
}
</style>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {queryGameDetailsData} from "../../lcu/queryDetailedGame";
import {NAvatar, NEllipsis, NGi, NGrid, NResult, NSpace, NTag} from "naive-ui";

const props = defineProps({
  currentGameIdProps: {
    type: Number
  }
})

const titleList = ref([])
const summonersDataList = ref([])
onMounted(async () => {
  // @ts-ignore
  const gameDetalisList:{groupedPlayers: any[], title: string[]} = await queryGameDetailsData(props.currentGameIdProps)
  titleList.value = gameDetalisList.title
  summonersDataList.value = gameDetalisList.groupedPlayers
})

function slnotimg(event:any) {
  var img = event.srcElement
  img.src = new URL("/src/assets/svg/image.png", import.meta.url).href
  img.onerror = null
}
</script>

<template>
  <div class="mainDiv" v-if="titleList.length !==0">
    <n-space vertical>
      <n-grid :cols="4" style="width: 623px;" >
        <n-gi>
          <n-space vertical class="alignCent">
            <span class="spanTitle">对局日期</span>
            <span style="font-size: 15px">{{ titleList[0] }}</span>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical class="alignCent">
            <span class="spanTitle">对局类型</span>
            <span style="font-size: 15px">{{ titleList[2] }}</span>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical class="alignCent">
            <span class="spanTitle">开始时间</span>
            <span style="font-size: 15px">{{ titleList[1] }}</span>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical class="alignCent">
            <span class="spanTitle">对局时长</span>
            <span style="font-size: 15px">{{ titleList[3] }}分钟</span>
          </n-space>
        </n-gi>
      </n-grid>
    </n-space>
    <n-space style="margin-top: 30px;" vertical :size="[0,33]">
      <n-space justify="space-between" v-for="champGroup in summonersDataList"
               style="margin-left: 20px;">
        <n-space v-for="champ in champGroup" >
          <n-space vertical>
             <n-space>
               <div class="champAvatar" >
                 <!--              头像-->
                 <n-avatar
                   :bordered="false"
                   :size="50"
                   :src="champ.champImgUrl"
                   fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                   style="display: block;"
                 />
                 <div class="champLevel champAvatarColorBlue">{{ champ.champLevel }}</div>
               </div>
               <!--            物品-->
               <n-space vertical :size="[10,1]" style="margin-left: 8px">
                 <n-space :size="[5,0]">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item0">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item1">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item2">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item3">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item4">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item5">
                   <img class="itemClass" :onerror="slnotimg" :src="champ.item6">
                 </n-space>
                 <div style="position: relative;margin-left: 7px">
                   <n-space>
                     <!--                召唤师昵称-->
                     <n-ellipsis style="max-width: 110px;color: #9AA4AF;font-size: 13px;width: 110px;margin-bottom: 2px;margin-left: -8px">
                       {{ champ.name.name }}
                     </n-ellipsis>
                       <div class="kdadiv winCountTheme">
                       {{ champ.kills }}-{{ champ.deaths }}-{{ champ.assists }}
                     </div>
                   </n-space>
                 </div>
               </n-space>
             </n-space>
            <n-space>
              <n-tag style="width: 82px;justify-content: center" type="success"
                     :bordered="false" size="small">输出：{{champ.totalDamageDealtToChampions}}</n-tag>
              <n-tag style="width: 82px;justify-content: center" type="error"
                     :bordered="false" size="small">承伤：{{champ.totalDamageTaken}}</n-tag>
              <n-tag style="width: 82px;justify-content: center" type="warning"
                     :bordered="false" size="small">金币：{{champ.goldEarned}}</n-tag>
            </n-space>
          </n-space>
        </n-space>
      </n-space>
    </n-space>
  </div>
  <div class="result404" v-else>
    <n-result status="404" title="404 资源不存在" description="当前战绩数据异常"></n-result>
  </div>
</template>

<style scoped>
.mainDiv {
  margin-top: 7px;
  margin-left: 20px;
  height: 535px;
}

.spanTitle {
  color: #9AA4AF;
  font-size: 13px;
}

.alignCent {
  align-items: center;
}

.itemClass {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}

@keyframes scale-in-hor-left {
  0% {
    transform: scaleX(0);
    transform-origin: 0% 0%;
    opacity: 1;
  }
  100% {
    transform: scaleX(1);
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

.kdadiv {
  height: 18px;
  font-size: 13px;
  position: absolute;
  right: -1px;
  bottom: 4px;
  padding:0px 5px 0px 5px;
  border-radius: 3px;
}
.result404 {
  margin-top: 160px;
}
.champAvatar {
  position: relative;
  margin-right: -6px
}
.champAvatarColorBlue {
  background-color: #2080f0;
}
.champLevel {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 15px;
  height: 15px;
  bottom:0px;
  right: 0px;
  color: #ffffff;
  border-radius: 2px;
}
</style>

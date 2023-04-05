<template>
  <n-scrollbar v-if="matchList !== null" style="max-height: 378px;padding-right: 14px">
    <div v-if="matchList?.length === 0">
      <n-skeleton text :repeat="2" />
      <n-skeleton text style="width: 60%" />
    </div>
    <div v-else class="fade-in-bottom">
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="match in matchList" class="assistMatchLayout"
                  style="height: 55px" has-sider>
          <n-layout-sider width="55"  style="margin-right: 8px;">
            <div class="siderDiv">
              <n-avatar
                :size="55"
                :src="match.champImgUrl"
                style="display: block"
              />
              <div class="summonerSkill">
                <img class="imgItemSecond"  :src="match.spell1Id">
                <img class="imgItemSecond" :src="match.spell2Id">
              </div>
            </div>
          </n-layout-sider>
          <n-layout class="assistMatchLayout">
            <n-layout-content class="assistMatchLayout">
              <div class="itemImgDiv">
                <img class="imgItem" :src="match.item0">
                <img class="imgItem" :src="match.item1">
                <img class="imgItem" :src="match.item2">
                <img class="imgItem" :src="match.item3">
                <img class="imgItem" :src="match.item4">
                <img class="imgItem" :src="match.item5">
                <img class="imgItem" :src="match.item6">
              </div>
            </n-layout-content >
            <n-layout-content class="infoLayout assistMatchLayout">
              <div class="infoDiv">
                <n-tag class="tagKDA" :bordered="false" size="small"
                       :type="match.isWin ? 'success' : 'error'">
                  {{ match.kills }}-{{match.deaths}}-{{match.assists}}
                </n-tag>
                <n-tag class="typeTag"
                       :bordered="false" size="small" type="default">{{ match.gameModel }}|{{ match.lane }}•{{match.level}}
                </n-tag>
                <n-tag class="tagKDA"
                       size="small" :bordered="false" type="default">{{match.matchTime}}</n-tag>
              </div>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
  </n-scrollbar>
  <drawer-error v-else/>
</template>

<script setup lang="ts">
import {NSpace,NScrollbar,NAvatar, NTag, NSkeleton,NLayout, NLayoutSider, NLayoutContent,} from 'naive-ui'
import {PropType} from "vue";
import {simpleMatchTypes} from "../../../lcu/types/queryMatchLcuTypes";
import DrawerError from "./drawerError.vue";
const props = defineProps({
  matchList:{
    default:[],
    type:Array as PropType<simpleMatchTypes[] | null>
  },
})


</script>

<style scoped>
.imgItem {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}

.imgItemSecond {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}

.itemImgDiv {
  display: flex;
  justify-content: space-between
}

.infoDiv {
  display: flex;
  gap: 8px;
}

.infoLayout {
  margin-top: 8px;
  height: 22px;
}

.tagKDA {
  height: 22px;
  width: 58.5px;
  justify-content: center;
}

.typeTag {
  height: 22px;
  width: 91.5px;
  justify-content: center;
}
.siderDiv {
  position: relative;
}
.summonerSkill {
  position: absolute;
  bottom: 0px;
  right: 0px;
  display: flex;
  gap: 3px;
}
.fade-in-bottom{animation:fade-in-bottom .6s cubic-bezier(.39,.575,.565,1.000) both}
@keyframes fade-in-bottom{0%{transform:translateY(50px);opacity:0}100%{transform:translateY(0);opacity:1}}
</style>

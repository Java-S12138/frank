<template>
  <n-scrollbar v-if="champList !== null" style="max-height: 378px;padding-right: 14px">
    <div class="fade-in-bottom">
      <n-space vertical :size="[0,15]" style="margin-top: 3px">
        <n-layout v-for="champ in champList"
                  style="height: 55px" has-sider class="assistMatchLayout">
          <n-layout-sider width="55" style="margin-right: 8px;">
              <n-avatar
                :size="55"
                :src="champ[0]"
                style="display: block"/>
          </n-layout-sider>
          <n-layout>
            <n-layout-content >
              <n-tag :bordered="false" type="success"
                     class="tagDiv" style="height: 25px;">{{champ[1]}}</n-tag>
            </n-layout-content>
            <n-layout-content class="assistMatchLayout">
              <n-tag :bordered="false" type="info"
                     class="tagDiv infoLayout">{{ champ[2] }}</n-tag>
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
import {onMounted, PropType, ref} from "vue";
import DrawerError from "./drawerError.vue";
import {queryChampList} from "../../../lcu/assistMatchDetailLcu";

const props = defineProps({
  summonerId:{
    default:'',
    type:String as PropType<string>
  },
})
const champList:any = ref([])

onMounted(() => {
  queryChampList(props.summonerId).then((value) => {
    if (value ===null){
      champList.value = null
    }else {
      champList.value = value
    }
  })
})



</script>

<style scoped>
.tagDiv {
  width: 100%;
  justify-content: center;
}
.infoLayout {
  margin-top: 8px;
  height: 22px;
  font-size: 13px;
}
.fade-in-bottom{animation:fade-in-bottom .6s cubic-bezier(.39,.575,.565,1.000) both}
@keyframes fade-in-bottom{0%{transform:translateY(50px);opacity:0}100%{transform:translateY(0);opacity:1}}
</style>

<template>
  <div>
    <header>
      <n-space>
        <!--              头像-->
        <n-avatar
          :bordered="false"
          :size="60"
          :src="props.personalDetails.champImgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          style="display: block"
        />
        <n-space vertical :size="[2,10]">
          <n-tag :bordered="false" type="info">{{ props.personalDetails.name }}</n-tag>

          <n-space style="margin-left: 1px;">
            <img class="itemClassSecond" :src="props.personalDetails.spell1Id" alt="">
            <img class="itemClassSecond" :src="props.personalDetails.spell2Id" alt="">
            <n-tag :bordered="false" size="small" type="info">Lv {{ props.personalDetails.champLevel }}</n-tag>
            <n-tag :bordered="false" size="small" type="info">{{props.personalDetails.kda}}</n-tag>
          </n-space>
        </n-space>
      </n-space>
    </header>
    <!--    符文-->
    <n-space class="runeSpace"  style="margin:17px 0px 17px 0px"
             justify="space-between">
      <img v-for="runeIndex in props.personalDetails.runesList"
        :src="getImaUrl(runeIndex)" alt="" class="runImg">
    </n-space>



    <!--    其他数据-->
    <n-list>
      <n-scrollbar style="padding-right: 12px"
                   :style="props.parentPage==='query' ? 'max-height: 452px' : 'max-height: 413px'">

        <!--    排位数据-->
        <n-list-item >
          <n-space justify="space-between">
            <n-tag :bordered="false" type="success">
              单双排位
            </n-tag>
            <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
              {{ props.personalDetails.rankData[0] }}
            </n-tag>
          </n-space>
        </n-list-item>
        <n-list-item >
          <n-space justify="space-between">
            <n-tag :bordered="false" type="success">
              灵活排位
            </n-tag>
            <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
              {{ props.personalDetails.rankData[1] }}
            </n-tag>
          </n-space>
        </n-list-item>
        <n-list-item >
          <n-space justify="space-between">
            <n-tag :bordered="false" type="success">
              云顶排位
            </n-tag>
            <n-tag type="warning" :bordered="false" style="width: 70px;justify-content: center">
              {{ props.personalDetails.rankData[2] }}
            </n-tag>
          </n-space>
        </n-list-item>

        <n-list-item v-for="item in props.personalDetails.listItemData">
          <n-space justify="space-between">
            <n-tag :bordered="false" type="default" style="color: #9aa4af">
              {{ item[0] }}
            </n-tag>
            <n-tag type="default" :bordered="false"
                   style="width: 70px;justify-content: center;color: #9aa4af">
              {{ item[1] }}
            </n-tag>
          </n-space>
        </n-list-item>
      </n-scrollbar>
    </n-list>

    <n-space v-if="props.parentPage==='query'"
      justify="space-between" style="margin-top: 5px">
      <n-button :bordered="false" type="success" @click="queryDetails">
        查看详细战绩
      </n-button>
      <n-button :bordered="false" type="warning" @click="addOnlineBlacklist">
        导入排位笔记
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NAvatar, NSpace, NTag,NList,NListItem,NButton,
  NScrollbar,useMessage} from 'naive-ui'


// 从父组件获取的数据
const props:any = defineProps({
  personalDetails: {
    type: Object,
  },
  parentPage:{
    type:String
  }
});
// 向夫组件传输数据
const emits = defineEmits(['queryDetails']);
const queryDetails = () => {
  emits('queryDetails', props.personalDetails.summonerId)
}

const message = useMessage()

const addOnlineBlacklist = () => {
  cube.windows.getWindowByName('assist').then((v) => {
    cube.windows.show(v.id).then(() => {
      cube.windows.message.send(v.id,'queryMatch-add-blacklist',{
        gameId:props.personalDetails.gameId,
        summonerId:String(props.personalDetails.summonerId),
        name:props.personalDetails.name
      })
    })
  }).catch(() => {
    message.error('打开助手窗口失败')
  })
 }


// 获取符文图片地址
const getImaUrl = (imgId:string) => {
  return new URL(`/src/assets/runes/${imgId}.png`, import.meta.url).href
}
</script>

<style scoped>

header {
  margin-bottom: 5px;
}

.runImg {
  width: 30px;
}

.itemClassSecond {
  width: 22px;
  height: 22px;
  border-radius: 3px;
}
.runeSpace {
  background: #ffffff00;
  border-radius: 3px;
  padding: 2px 5px 2px 5px;
  width: 96%;
  height: 30px;
}
.n-list-item {
  padding: 6px 0px;
}
</style>

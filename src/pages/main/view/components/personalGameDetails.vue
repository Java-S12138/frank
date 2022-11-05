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
      <n-button :bordered="false" type="warning" @click="addBlacklist">
        导入排位笔记
      </n-button>

    </n-space>

  </div>
</template>

<script setup lang="ts">
import {NAvatar, NSpace, NTag,NList,NListItem,NButton,NScrollbar,useMessage} from 'naive-ui'


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
  // @ts-ignore
  emits('queryDetails', props.personalDetails.name)
}

const queryCurrenDate = () => {
  var myDate = new Date()
  return myDate.toLocaleDateString()
}

const message = useMessage()

const addBlacklist = async () => {
  try {
    const currentDate = queryCurrenDate()
    const localBlacklist:any = JSON.parse(String(localStorage.getItem('blacklist'))) === null ? {}: JSON.parse(String(localStorage.getItem('blacklist')))
    localBlacklist[`${props.personalDetails.summonerId}`] = {
      nickname:props.personalDetails.name,
      date:currentDate,
      timestamp:Date.now(),
      content:'战绩查询中添加的召唤师',
      tag:'战绩查询',
    }
    localStorage.setItem('blacklist',JSON.stringify(localBlacklist))
    message.success(`${props.personalDetails.name}   拉黑成功😡`)
    cube.windows.message.send((await cube.windows.getWindowByName('assist')).id,'updataBL','')
  }catch (e) {
    message.error(`${props.personalDetails.name}   拉黑失败 !`)
  }
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
  background: #fafafc;
  border-radius: 3px;
  padding: 2px 5px 2px 5px;
  width: 96%;
  height: 30px;
}
.n-list-item {
  padding: 6px 0px;
}
</style>

<template>
  <div>
    <n-list>
      <template #header>
        <n-space  justify="space-around" class="aligncenter">
          <n-avatar
            round
            :bordered="false"
            :size="50"
            :src=imgUrl
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display: block"
          />
          <n-popover trigger="hover">
            <template #trigger>
              <n-tag :bordered="false">是否使用自动符文</n-tag>
            </template>
            <span>下次选择此英雄自动配置符文</span>
          </n-popover>
          <n-switch @update:value="setIsAutoRune()"
            v-model:value="isAutoRune" />
        </n-space>
        <n-tabs style="margin-top: 12px" type="segment"
                :default-value="0">
          <n-tab-pane v-for="(restraint,index) in restraintList"
            :tab="restraint.position" :name="index">
            <n-scrollbar style="max-height: 385px">
              <n-list-item v-for="champRes in restraint.restraint">
                <n-space class=aligncenter>
                  <n-avatar
                    round
                    :bordered="false"
                    :size="50"
                    :src=champRes[1]
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    style="display: block"
                  />
                  <n-tag type="success" :bordered="false"
                         style="width: 100px;justify-content: center">
                    胜率 {{ (champRes[2] * 0.01).toFixed(1) + '%' }}
                  </n-tag>
                  <p>{{ champRes[0] }}</p>
                </n-space>
              </n-list-item>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
      </template>
    </n-list>
  </div>
</template>

<script>
export default {
  name: "restraint"
}
</script>

<script setup>
import {
  NAvatar, NList, NScrollbar,NSwitch,NPopover,
  NListItem, NSpace, NTag,NTabs,NTabPane
} from "naive-ui";
import {ref,onMounted} from "vue";
import {champDict} from "@/utils/render/lolDataList";
import {appConfig} from "@/utils/main/config";
import {request} from "@/utils/render/request";
import {createHttp1Request} from "@/utils/league-connect";
const props = defineProps({
  champ: {
    type: String,
  }
})
const emits = defineEmits(['autoRune'])

const isAutoRune = ref(false)
const imgUrl = ref(null)
const restraintList = ref([])


onMounted(() => {
  imgUrl.value = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[props.champ].alias}.png`
  isAutoRune.value = appConfig.has(`autoRune.${props.champ}`) === true ? true : false
  getRestraintData()
})

const getRestraintData = async () => {
  restraintList.value = []
  const url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${props.champ}.js`
  const result = await request({
    'url': url,
    method: 'GET',
    params: {ts: '2760378'}
  })
  const detailsData = JSON.parse(result.data.split('=')[1].split(';/*')[0])
  const championFightKeys = Object.keys(detailsData.list.championFight)
  for (const championFightKey of championFightKeys) {
    const position = getPosition(championFightKey)
    const restraint = getDetailsData(detailsData.list.championFight[championFightKey])
    restraintList.value.push({position,restraint})
  }
}

// 获取位置信息
const getPosition = (pos) => {
  switch (pos) {
    case 'mid':
      return '中单';
    case 'top':
      return '上单';
    case 'support':
      return '辅助';
    case 'jungle':
      return '打野';
    case 'bottom':
      return '射手';
    case 'aram':
      return '极地';
  }
}
// 获取压制英雄数据
const getDetailsData =  (restraint) => {
  let resList = []

  for (const restraintListElement of restraint) {
    const chapmId = restraintListElement.championid2
    const label = champDict[chapmId].label
    const imgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[chapmId].alias}.png`
    const winRate = 10000 - Number(restraintListElement.winrate)
    resList.push([label, imgUrl, winRate])
  }
  resList.sort((a, b) => {
    return a[2] < b[2] ? 1 : -1
  })
  return resList
}
// 设置是否自动符文
const setIsAutoRune = async () => {
  if (!isAutoRune.value){
    // 获取符文页信息
    const currentRuneList = (await createHttp1Request({
      method: "GET",
      url: 'lol-perks/v1/pages',
    }, appConfig.get('credentials'))).json()
    const current = currentRuneList.find((i) => i.current && i.isDeletable)
    appConfig.set(`autoRune.${props.champ}`, current)
    emits('autoRune', true)

  }else {
    appConfig.delete(`autoRune.${props.champ}`)
    emits('autoRune', false)
  }
}
</script>

<style scoped>
.aligncenter {
  align-items: center;
}
</style>

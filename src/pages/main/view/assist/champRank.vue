<template>
  <div>
    <n-card class="boxShadow rankDiv"  size="small">
      <n-space>
        <n-popover :show-arrow="false" trigger="hover">
          <template #trigger>
            <n-tag type="info" :bordered="false" size="large"
                   style="border-radius: 4px;cursor:pointer;margin-left: 7px"
                   @click="changeServe">
              <p v-if="is101">国服英雄数据排行</p>
              <p v-else>韩服英雄数据排行</p>
            </n-tag>
          </template>
          点击切换数据排行
        </n-popover>
        <n-select v-model:value="tier" style="width:102px" :show-checkmark="false"
                  :options="is101 ? options : krOptions" @update:value="queryChampRankData"/>
      </n-space>
      <n-space class="tagSpace">
        <n-button :bordered=false ghost @click="getComprehensiveRankData"
                  :type="isCheck ==1 ? 'info' : 'default'" size="small" class="isHover">
          综合
        </n-button>
        <n-button :bordered=false ghost @click="getWinRankData"
                  :type="isCheck ==2 ? 'info' : 'default'" size="small" class="isHover">
          胜率
        </n-button>
        <n-button :bordered=false ghost @click="getAppearanceRankData"
                  :type="isCheck ==3 ? 'info' : 'default'" size="small" class="isHover">
          登场率
        </n-button>
        <n-button :bordered=false ghost @click="getBanRankData"
                  :type="isCheck ==4 ? 'info' : 'default'" size="small" class="isHover">
          禁用率
        </n-button>
      </n-space>

    </n-card>
    <n-card class="boxShadow" size="small" style="margin-top: 17px">
      <n-list>
        <template #header>
          <n-space justify="space-between">
            <n-dropdown trigger="hover" placement="left"
                        :options="positionOptions" @select="handleSelect">
              <div class="addMargin" :class="lane"></div>
            </n-dropdown>
            <n-input size="small" type="text" @keydown.enter="searchChampData"
                     placeholder="输入昵称" v-model:value="searchValue" style="width: 77px;"></n-input>
            <n-button size="small" secondary type="info" @click="searchChampData">搜索</n-button>

            <n-popover :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon :color=" isTopWin === false ? '#9AA4AF':'#2080f0'" style="margin-right: 5px"
                        size="30" @mousedown="handleChangePosition">
                  <Ballon/>
                </n-icon>
              </template>
              窗口是否置顶
            </n-popover>
          </n-space>

        </template>
        <n-scrollbar style="max-height: 448px;padding-right: 14px">
          <n-list-item v-for="chapm in champSliceList">
            <n-space justify="space-evenly"
                     @click="getRestraintData(chapm.champId,lane,chapm.imgUrl,chapm.tLevel,chapm.win,chapm.ban)">
              <n-avatar
                round
                :bordered="false"
                :size="50"
                :src=chapm.imgUrl
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block"

              />
              <n-space vertical :size=[0,0] justify="center" style="height: 50px">
                <n-space justify="space-between">
                  <p>{{ chapm.name }}</p>
                  <div :class="'imgT'+chapm.tLevel"></div>
                </n-space>
                <n-space class="textColorSecend" justify="space-between">
                  <p>胜率 {{ chapm.win }} </p>
                  <p>禁用 {{ chapm.ban }} </p>
                </n-space>
              </n-space>
            </n-space>
          </n-list-item>
        </n-scrollbar>
      </n-list>
    </n-card>

    <n-drawer v-model:show="restraintActive"
              style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="477" placement="bottom">
      <n-drawer-content body-content-style="padding-top:0px">
        <n-list>
          <template #header>
            <n-space style="margin: 5.5px 0px">
              <n-avatar
                round
                class="champImg"
                :bordered="false"
                :size="50"
                @click="preselectChamp(selectedList[5])"
                :src=selectedList[0]
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block"
              />
              <n-space vertical style="height: 50px;justify-content: center">
                <n-space style="margin-bottom: -12px" justify="space-between">
                  <p>{{ selectedList[1] }}</p>
                  <div :class="'imgT'+selectedList[2]"></div>
                </n-space>
                <n-space class="textColorSecendDrawer" justify="space-between" style="width: 100%;">
                  <p>胜率 {{ selectedList[3] }} </p>
                  <p>禁用 {{ selectedList[4] }} </p>
                  <p style="color: #d03050;cursor: pointer" @click=changeRestraint v-if="!isRestraint">劣势对线</p>
                  <p style="color: #18a058;cursor: pointer" @click=changeRestraint v-else>优势对线</p>
                </n-space>
              </n-space>
            </n-space>
          </template>
          <n-list-item v-if="restraintList.length===0"
            v-for="count in 5">
            <n-space class=alignCenter>
              <n-skeleton height="50px" circle />
              <n-space vertical :size="[0,4]" style="height: 50px;justify-content: space-between">
                <n-skeleton height="20px" width="197px" :sharp="false" />
                <n-skeleton height="20px" width="197px" :sharp="false" />
              </n-space>

            </n-space>
          </n-list-item>
          <n-scrollbar style="max-height: 365px;padding-right: 12px" v-else>
            <n-list-item v-for="champRes in restraintList">
              <n-space class=alignCenter>
                <n-avatar
                  round
                  class="champImg"
                  :bordered="false"
                  :size="50"
                  @click="preselectChamp(champRes[3])"
                  :src=champRes[1]
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block"
                />
                <n-space vertical :size="[0,4.5]" style="height: 50px;">
                  <n-tag type="info" :bordered="false" size="small"
                         style="width: 197px;justify-content: center;height: 20px;">
                    {{ champRes[0] }}
                  </n-tag>
                  <n-tag :type="champRes[2] >= 50 ? 'success' :'error'" :bordered="false" size="small"
                         style="width: 197px;justify-content: center;height: 20px;">
                    胜率 {{champRes[2]}}%
                  </n-tag>
                </n-space>

              </n-space>
            </n-list-item>
          </n-scrollbar>
        </n-list>
        <p class="tipsP">点击头像可在 [ 选择英雄阶段 ] 预选英雄</p>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  NAvatar, NButton, NCard, NIcon, NInput, NList, NScrollbar, NDropdown,NSkeleton,
  NListItem, NPopover, NSelect, NSpace, NTag, useMessage, NDrawer, NDrawerContent
} from "naive-ui";
import {Ballon} from '@vicons/tabler'
import {ref, onMounted, reactive, Ref, watch} from "vue";
import {request} from "../../utils/request"
import {champDict} from "../../resources/champList";
import {invokeLcu} from "../../lcu";

const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))

const tier = ref(config.champRankOption.tier)
const lane = ref(config.champRankOption.lane)
const champSliceList:Ref<any[]> = ref([])
const options = [
  {
    label: '王者',
    value: 0
  },
  {
    label: '宗师',
    value: 5
  },
  {
    label: '大师',
    value: 6
  },
  {
    label: '钻石',
    value: 10
  },
  {
    label: '铂金',
    value: 20
  },
  {
    label: '黄金',
    value: 30
  },
  {
    label: '白银',
    value: 40
  },
  {
    label: '黄铜',
    value: 50
  },
  {
    label: '黑铁',
    value: 80
  },
  {
    label: '铂金以上',
    value: 200
  },
  {
    label: '之巅铂金以上',
    value: 311
  },
]
const krOptions = [
  {
    label: '铂金以上',
    value: 2
  },
  {
    label: '钻石以上',
    value: 13
  },
  {
    label: '大师以上',
    value: 3
  },
  {
    label: '青铜~黄金',
    value: 1
  },
]
const positionOptions = [
  {
    label: '上路',
    key: 'top'
  },
  {
    label: '打野',
    key: 'jungle'
  },
  {
    label: '中路',
    key: 'mid'
  },
  {
    label: '射手',
    key: 'bottom'
  },
  {
    label: '辅助',
    key: 'support'
  },

]
const isCheck = ref(1)
const restraintActive = ref(false)
const restraintList:Ref<any[]>  = ref([])
const selectedList:Ref<string[]> = ref([])
const isRestraint = ref(true)
const searchValue = ref(null)
const is101 = ref(config.is101)
const isTopWin = ref(false)
let preselectActionID:number|null = null

const message = useMessage()
const props:any = defineProps({
  transValueRank:{
    type:String
  }
})

watch(props,(value) => {
  if (value.transValueRank === 'rune' ||value.transValueRank === 'champRank'){
    preselectActionID = null
    restraintActive.value = false
  }
})

onMounted(() => {
  queryChampRankData()
})

// 获取不同服务器的数据
const queryChampRankData = async () => {
  if (is101.value){
    getChampRankData(tier.value, lane.value, getLacalDateStr(),1)
  }else {
    let laneKr = ''
    switch (lane.value) {
      case lane.value = 'top':
        laneKr = '0';
        break;
      case lane.value = 'jungle':
        laneKr = '1';
        break;
      case lane.value = 'mid':
        laneKr = '2';
        break;
      case lane.value = 'bottom':
        laneKr = '3';
        break;
      case lane.value = 'support':
        laneKr = '4';
        break;
    }
    champSliceList.value = await queryKoreaServe(tier.value,laneKr)
  }
}

// 查询韩服数据
//https://lol.ps/api/statistics/tierlist.json?region=0&version=64&tier=2&lane=2
const queryKoreaServe = async (tier:number,lane:string) => {
  config.champRankOption.tier = tier
  localStorage.setItem('config',JSON.stringify(config))
  try {
    const url = `https://lol.ps/api/statistics/tierlist.json?region=0&version=65&tier=${tier}&lane=${lane}`
    const res = await request({
      url:url,
      method:"GET"
    })
    const champList = res.data.data.reduce((res:any,item:any,index:number) => {
      const currentChamp = {
        appearance: Number(item.pickRate).toFixed(1) +'%',
        ban: Number(item.banRate).toFixed(1) +'%',
        champId: item.championId,
        imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.championId)].alias}.png`,
        name: item.championInfo.nameCn,
        tLevel: item.isOp === true ? '0' : item.opTier,
        win: Number(item.winRate).toFixed(1) +'%',
        sortId: index
      }
      return res.concat(currentChamp)
    },[])
    return champList
  }catch (e) {
    message.warning('韩服数据异常 已切换为国服数据')
    changeServe()
  }
}

// 转换百分数
const toPercent = (point:number) => {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}
// 获取当前日期
const getLacalDateStr = () => {
  let currentDate = new Date()
  let dateList = currentDate.toLocaleDateString().split('/')
  dateList[1] = dateList[1].length == 1 ? '0' + dateList[1] : dateList[1]
  dateList[2] = dateList[2].length == 1 ? '0' + dateList[2] : dateList[2]
  return parseInt(dateList.join('')) - 1
}

// 获取国服英雄数据排行
const getChampRankData = async (tier:number, lane:string, time:number,recursionCount:number):Promise<any> => {
  if (recursionCount>10){
    message.error('国服服数据异常')
    return
  }
  config.champRankOption.tier = tier
  localStorage.setItem('config',JSON.stringify(config))

  let partUrl = 'https://x1-6833.native.qq.com/x1/6833/1061021&3af49f?championid=666'
  let championdetails
  const res = await request({
    url: partUrl + `&lane=${lane}&ijob=all&dtstatdate=${time}&gamequeueconfigid=420&tier=${tier}`,
    method: 'GET',
  })
  if (res.data.data.result === "") {
    recursionCount += 1
    return getChampRankData(tier, lane, time - 1,recursionCount)
  }

  try {
    championdetails = JSON.parse(res.data.data.result).championdetails
  } catch (e) {
    champSliceList.value = []
    return null
  }

  let chapmDetailList = championdetails.split('#')
  champSliceList.value = []
  for (const [index, chapmDetailListElement] of chapmDetailList.entries()) {
    let sliceIndex = chapmDetailListElement.indexOf('_[')
    let dataStr = index < 9 ? chapmDetailListElement.slice(2, sliceIndex) : chapmDetailListElement.slice(3, sliceIndex)
    let dataList = dataStr.split('_')

    champSliceList.value.push({
      sortId: index,
      imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[dataList[0]]['alias']}.png`,
      name: champDict[dataList[0]]['label'],
      tLevel: dataList[1],
      win: toPercent(parseFloat(dataList[2])),
      ban: toPercent(parseFloat(dataList[3])),
      appearance: toPercent(parseFloat(dataList[4])),
      champId: dataList[0]
    })
  }
}


// 根据不同的参数进行 快速排序
const quickSort = (factor:any) => {
  champSliceList.value.sort((x, y) => {
    return factor == 'sortId' ? parseFloat(x[factor]) - parseFloat(y[factor]) : parseFloat(y[factor]) - parseFloat(x[factor])
  })
}
// 根据综合数据改变排行
const getComprehensiveRankData = () => {
  isCheck.value = 1
  quickSort('sortId')
}
// 根据胜率数据改变排行
const getWinRankData = () => {
  isCheck.value = 2
  quickSort('win')
}
// 根据出场率改变排行
const getAppearanceRankData = () => {
  isCheck.value = 3
  quickSort('appearance')
}
// 根据禁用率改变排行
const getBanRankData = () => {
  isCheck.value = 4
  quickSort('ban')
}
// 获取英雄反制数据
const getRestraintData = async (champId:any, position:string, imgUrl:string, level:string, win:string, ban:string) => {
  restraintList.value = []
  selectedList.value = [imgUrl, champDict[champId].label +' ' + champDict[champId].title, level, win, ban,champId]
  restraintActive.value = true
  let tierRes = 2

  if (position==='top'){
    position = '0'
  }else if (position==='jungle'){
    position = '1'
  }else if (position==='mid'){
    position = '2'
  }else if (position==='bottom'){
    position = '3'
  }else if (position==='support'){
    position = '4'
  }else {
    return
  }
  if (!is101.value){
    tierRes = tier.value
  }
  const url = `https://lol.ps/api/champ/${champId}/versus.json?region=0&version=65&tier=${tierRes}&lane=${position}`
  const result = await request({
    'url': url,
    method: 'GET'
  })
  if (result.data.data == null || result.status!==200){
    restraintActive.value = false
    message.error('当前英雄数据异常')
    return
  }
  try {
    let resList = []
    const counterChampionIdList = JSON.parse(result?.data?.data['counterChampionIdList'])
    const counterWinrateList = JSON.parse(result?.data?.data['counterWinrateList'])
    for (let i = 0; i < counterChampionIdList.length; i++) {
        const chapmId = counterChampionIdList[i]
        const label = champDict[chapmId].label +' ' + champDict[chapmId].title
        const imgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[chapmId].alias}.png`
        const winRate = counterWinrateList[i]
        resList.push([label, imgUrl, winRate,chapmId])
    }
    resList.sort((a, b) => {
      return a[2] < b[2] ? 1 : -1
    })
    restraintList.value = resList
  }catch (e) {
    restraintActive.value = false
    message.error('当前英雄数据异常')
    return
  }
}
// 改变是否为英雄克制 或者优势对线
const changeRestraint = () => {
  isRestraint.value = isRestraint.value == true ? false : true
  if (!isRestraint.value) {
    restraintList.value.sort((x, y) => {
      return x[2] > y[2] ? 1 : -1
    })
  } else {
    restraintList.value.sort((x, y) => {
      return x[2] < y[2] ? 1 : -1
    })
  }
}

// 更换位置重新获取排位数据
const handleSelect = (pos:string) => {
  isCheck.value = 1
  config.champRankOption.lane = pos
  localStorage.setItem('config',JSON.stringify(config))
  lane.value = pos
  queryChampRankData()
  switch (pos) {
    case pos = 'top':
      message.success('上单数据更新成功 !');
      break;
    case pos = 'jungle':
      message.success('打野数据更新成功 !');
      break;
    case pos = 'mid':
      message.success('中单数据更新成功 !');
      break;
    case pos = 'bottom':
      message.success('下路数据更新成功 !');
      break;
    case pos = 'support':
      message.success('辅助数据更新成功 !');
      break;
  }
}

// 搜索英雄数据
const searchChampData = () => {
  const currentChamp = searchValue.value
  const chapm = champSliceList.value.find((i) => i.name == currentChamp)
  if (chapm != null) {
    getRestraintData(chapm.champId, lane.value, chapm.imgUrl, chapm.tLevel, chapm.win, chapm.ban)
  } else {
    message.error('当前输入不存在')
  }
}
// 窗口是否置顶
const handleChangePosition =async () => {
 if (!isTopWin.value){
   cube.windows.setTopmost((await cube.windows.getCurrentWindow()).id,true)
   isTopWin.value = true
 }else {
   cube.windows.setTopmost((await cube.windows.getCurrentWindow()).id,false)
   isTopWin.value = false
 }
}

// 改变不同服务器的数据排行
const changeServe = () => {
  isCheck.value = 1
  is101.value = !is101.value
  tier.value = is101.value ? 200 : 2
  queryChampRankData()
  config.champRankOption.tier = tier
  config.is101 = is101.value
  localStorage.setItem('config',JSON.stringify(config))
}

// 预选英雄
const preselectChamp = async (champId:number) => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('预选英雄功能 需要订阅服务')
    return
  }
  if (preselectActionID===null){
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    if (res?.success === false){
      message.warning('请在选择英雄阶段使用')
      return
    }
    const localPlayerCellId = res.localPlayerCellId
    const actions = res.actions
    for (let action of actions) {
      for (let actionElement of action) {
        if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
          preselectActionID = actionElement.id
          return champSelectPatchAction(preselectActionID,champId)
        }
      }
    }
  }else {
    return champSelectPatchAction(preselectActionID,champId)
  }
}

const champSelectPatchAction = async (actionID:any, champId:any) => {
  const localBody = {
    "completed": false,
    "type": 'pick',
    "championId": champId
  }
  try {
    invokeLcu('patch',`/lol-champ-select/v1/session/actions/${actionID}`,[localBody])
    return true
  } catch (e) {
    return false
  }
}
</script>

<style scoped>
@import url(@/assets/css/assistCommon.css);
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}


.isHover:hover {
  background-color: #ffffff;
  color: #4098fc;
}


.addMargin {
  margin-top: -1.5px;
  margin-left: 8px;
}

.textColorSecend {
  color: #9AA4AF;
  font-size: 13px;
  width: 150px;
}

.textColorSecendDrawer {
  color: #9AA4AF;
  font-size: 12px;
  width: 150px;
}

.alignCenter {
  align-items: center;
}
.rankDiv {
  padding-top: 2px;
  height: 85px;
}
.tagSpace {
  position: absolute;
  bottom: 2px;
}
.tipsP {
  position: absolute;
  left: 52px;
  bottom: 3px;
  font-size: 12px;
  color: #9aa4af;
}
.champImg {
  cursor: pointer;
  transition:  border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);
}
.champImg:hover {
 border-radius: 3px;
}
</style>

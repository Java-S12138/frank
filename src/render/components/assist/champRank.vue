<template>
  <div>
    <n-card class="boxShadow" size="small">
      <n-space>
        <n-tag type="info" :bordered="false" size="large"
               style="border-radius: 5px;cursor:pointer" @click="changeServe">
          <p v-if="is101">国服英雄数据排行</p>
          <p v-else>韩服英雄数据排行</p>
        </n-tag>

        <n-select v-model:value="tier" style="width:118px"
                  :options="is101 ? options : krOptions" @update:value="queryChampRankData"/>
      </n-space>
      <n-space>
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
                <n-icon color="#9AA4AF" style="margin-right: 5px"
                        size="30" v-mouse-drag="handleChangePosition">
                  <Ballon/>
                </n-icon>
              </template>
              移动窗口位置
            </n-popover>
          </n-space>

        </template>
        <n-scrollbar style="max-height: 448px">
          <n-list-item v-for="chapm in champSliceList">
            <n-space justify="space-evenly"
                     @click="getRestraintData(chapm.champId,lane,chapm.imgUrl,chapm.name,chapm.tLevel,chapm.win,chapm.ban)">
              <n-avatar
                round
                :bordered="false"
                :size="50"
                :src=chapm.imgUrl
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block"

              />
              <n-space vertical>
                <n-space style="margin-bottom: -12px" justify="space-between">
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
              :height="476" placement="bottom">
      <n-drawer-content>
        <n-list>
          <template #header>
            <n-space>
              <n-avatar
                round
                :bordered="false"
                :size="50"
                :src=selectedList[0]
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block"
                @click=changeRestraint
              />
              <n-space vertical>
                <n-space style="margin-bottom: -12px" justify="space-between">
                  <p>{{ selectedList[1] }}</p>
                  <div :class="'imgT'+selectedList[2]"></div>
                </n-space>
                <n-space class="textColorSecendDrawer" justify="space-between" style="width: 100%;">
                  <p>胜率 {{ selectedList[3] }} </p>
                  <p>禁用 {{ selectedList[4] }} </p>
                  <p style="color: #ff6666" v-if="isRestraint">英雄反制</p>
                  <p style="color: #18a058" v-else>优势对线</p>
                </n-space>
              </n-space>
            </n-space>
          </template>
          <n-scrollbar style="max-height: 365px">
            <n-list-item v-for="champRes in restraintList">
              <n-space class=alignCenter>
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
        </n-list>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import {
  NAvatar, NButton, NCard, NIcon, NInput, NList, NScrollbar, NDropdown,
  NListItem, NPopover, NSelect, NSpace, NTag, useMessage, NDrawer, NDrawerContent,
} from "naive-ui";
import {Ballon} from '@vicons/tabler'
import {ref, onMounted} from "vue";
import {request} from "../../../utils/render/request"
import {champDict} from "@/utils/render/lolDataList";
import {ipcRenderer} from "electron";
import {appConfig} from "@/utils/main/config";

const tier = ref(appConfig.get('champRankOption.tier'))
const lane = ref(appConfig.get('champRankOption.lane'))
const champSliceList = ref([])
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
const restraintList = ref([])
const selectedList = ref([])
const isRestraint = ref(true)
const searchValue = ref(null)
const is101 = ref(appConfig.get('is101'))

const message = useMessage()

onMounted(() => {
  let rankSetDiv = document.querySelector('#app > div.slide-in-bottom > div:nth-child(1) > div')
  rankSetDiv.style['padding-bottom'] = '6px'
  queryChampRankData()
})

// 获取不同服务器的数据
const queryChampRankData = async () => {
  if (is101.value){
    getChampRankData(tier.value, lane.value, getLacalDateStr())
  }else {
    let laneKr
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
const queryKoreaServe = async (tier,lane) => {
  appConfig.set('champRankOption.tier',tier)
  const url = `https://lol.ps/lol/get_lane_champion_tier_list/?region=0&tier=${tier}&lane=${lane}&region=0&order_by=-op_score`
  const res = await request({
    url:url,
    method:"GET"
  })

  const champList = res.data.results.reduce((res,item,index) => {
    const currentChamp = {
      appearance: Number(item.pick_rate).toFixed(1) +'%',
      ban: Number(item.ban_rate).toFixed(1) +'%',
      champId: item.champion__data_key,
      imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(item.champion__data_key)].alias}.png`,
      name: item.champion__name_cn,
      tLevel: item.is_op === true ? '0' : item.op_tier,
      win: Number(item.win_rate).toFixed(1) +'%',
      sortId: index
    }
    return res.concat(currentChamp)
  },[])
  return champList
}

// 转换百分数
const toPercent = (point) => {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}
// 获取当前日期
const getLacalDateStr = () => {
  let currentDate = new Date()
  let dateList = currentDate.toLocaleDateString().split('/')
  dateList[1] = dateList[1].length == 1 ? '0' + dateList[1] : dateList[1]
  return parseInt(dateList.join('')) - 2
}

// 获取国服英雄数据排行
const getChampRankData = async (tier, lane, time) => {
  appConfig.set('champRankOption.tier',tier)
  let partUrl = 'https://x1-6833.native.qq.com/x1/6833/1061021&3af49f?championid=666'
  let championdetails
  const res = await request({
    url: partUrl + `&lane=${lane}&ijob=all&dtstatdate=${time}&gamequeueconfigid=420&tier=${tier}`,
    method: 'GET',
  })
  if (res.data.data.result == "") {
    return getChampRankData(tier, lane, time - 1)
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
const quickSort = (factor) => {
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
const getRestraintData = async (champId, position, imgUrl, name, level, win, ban) => {
  restraintList.value = []
  selectedList.value = [imgUrl, name, level, win, ban]
  restraintActive.value = true
  const url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${champId}.js`
  const result = await request({
    'url': url,
    method: 'GET',
    params: {ts: '2760378'}
  })
  let detailsData = JSON.parse(result.data.split('=')[1].split(';/*')[0])
  let restraintJson = detailsData.list.championFight[position]
  if (restraintJson == null) {
    message.warning('当前英雄数据暂无...')
    return
  }
  let resList = []

  for (const restraintListElement of restraintJson) {
    const chapmId = restraintListElement.championid2
    const label = champDict[chapmId].label
    const imgUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[chapmId].alias}.png`
    const winRate = 10000 - Number(restraintListElement.winrate)
    resList.push([label, imgUrl, winRate])
  }
  resList.sort((a, b) => {
    return a[2] < b[2] ? 1 : -1
  })
  restraintList.value = resList
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
const handleSelect = (pos) => {
  isCheck.value = 1
  appConfig.set('champRankOption.lane',pos)
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
    getRestraintData(chapm.champId, lane.value, chapm.imgUrl, chapm.name, chapm.tLevel, chapm.win, chapm.ban)
  } else {
    message.error('当前输入不存在')
  }
}
// 移动窗口
const handleChangePosition = (pos) => {
  ipcRenderer.send('move-assistWindow', {
    x: pos.x,
    y: pos.y,
    isWindow: 'horse'
  })
}

// 改变不同服务器的数据排行
const changeServe = () => {
  isCheck.value = 1
  is101.value = !is101.value
  tier.value = is101.value ? 200 : 2
  queryChampRankData()
  appConfig.set('champRankOption.tier',tier.value)
  appConfig.set('is101',is101.value)
}
</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}


.isHover:hover {
  background-color: #ffffff;
  color: #4098fc;
}

.imgT0 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t0.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.imgT1 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t1.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.imgT2 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t2.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.imgT3 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t3.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.imgT4 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t4.svg');
  display: inline-block;
  background-repeat: no-repeat;
}
.imgT5 {
  font-size: 0px;
  width: 24px;
  height: 24px;
  background-image: url('../../assets/tLevel/t5.svg');
  display: inline-block;
  background-repeat: no-repeat;
}


.top {
  font-size: 0px;
  width: 30px;
  height: 30px;
  background-image: url('../../assets/tLevel/top.svg');
  display: inline-block;
}

.mid {
  font-size: 0px;
  width: 30px;
  height: 30px;
  background-image: url('../../assets/tLevel/mid.svg');
  display: inline-block;
  background-repeat: no-repeat;
  color: #4098fc;

}

.jungle {
  font-size: 0px;
  width: 30px;
  height: 30px;
  background-image: url('../../assets/tLevel/jug.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.bottom {
  font-size: 0px;
  width: 30px;
  height: 30px;
  background-image: url('../../assets/tLevel/bot.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.support {
  font-size: 0px;
  width: 30px;
  height: 30px;
  background-image: url('../../assets/tLevel/sup.svg');
  display: inline-block;
  background-repeat: no-repeat;
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
</style>

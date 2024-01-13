<template>
  <div class="mainCard">

    <n-card class="boxShadow" size="small" v-if="xp!==null">
      <n-avatar class="imgFull"
                round
                :bordered="false"
                :size="60"
                :src="rankData[7]"
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <n-space vertical :size="[2,10]">
        <n-space justify="space-between">
          <!--                昵称-->
          <n-tag type="success" :bordered="false" :round="true">
            {{ rankData[0] }}
          </n-tag>
          <!--                          查询战绩-->
          <n-tag type="success" style="cursor:pointer"
                 :bordered="false" :round="true" @click="queryMatch">
            <p v-if="xp!==null">查询战绩</p>
          </n-tag>
        </n-space>
        <n-space justify="space-between">
          <n-tag type="warning" size="small" round style="width: 56px;justify-content: center"
                 :bordered="false"> {{ rankData[1] }}
          </n-tag>
          <n-tag type="warning" size="small" style="width: 173px;justify-content: center"
                 :bordered="false" :round="true">
            <n-space class="alignCenter" justify="space-between">
              <n-progress
                type="line"
                :show-indicator="false"
                :percentage="xp"
                status="warning"
                processing
                style="width:100px"
                :height="10"
              />
              <div style="font-size: 13px;">{{ xp }} %</div>
            </n-space>
          </n-tag>
        </n-space>
      </n-space>
    </n-card>

    <start-game v-else/>

    <n-card class="boxShadow pointCard" size="small">
      <n-tabs type="segment" :animated="true">
        <n-tab-pane style="padding-top: 3px" name="chap1" tab="个人生涯">
          <n-list style="margin-left: 2px">
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !==0"
                       :round="false" size="large">
                  单双排位
                </n-tag>
                <n-tag type="success" :bordered="false" v-else class="tagWidth"
                       :round="false" size="large">

                </n-tag>

                <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                  {{ rankData[2] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !==0" :round="false"
                       size="large">
                  灵活排位
                </n-tag>
                <n-tag type="success" :bordered="false" class="tagWidth" v-else :round="false" size="large">

                </n-tag>
                <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                  {{ rankData[3] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !==0" :round="false"
                       size="large">
                  云顶排位
                </n-tag>
                <n-tag type="success" :bordered="false" class="tagWidth" v-else :round="false" size="large">
                </n-tag>

                <n-tag type="warning" :bordered="false" class="tagWidth" :round="false" size="large">
                  {{ rankData[4] }}
                </n-tag>
              </n-space>
            </n-list-item>
            <n-list-item>
              <n-space justify="space-between">
                <n-tag type="success" :bordered="false" :round="false" size="large" class="tagWidth">
                  {{ summonerHonor[0] }}
                </n-tag>

                <n-tag type="warning" :bordered="false"
                       :round="false" size="large" class="tagWidth">
                  {{ summonerHonor[1] }}
                </n-tag>
              </n-space>
            </n-list-item>
          </n-list>
        </n-tab-pane>
        <n-tab-pane style="padding-top: 8px" name="chap2" tab="英雄数据">
          <div>
            <n-space vertical>
              <n-list>
                <n-scrollbar style="max-height: 215px">
                  <n-list-item v-for="(chapm,index) in summonerChampLevel">
                    <n-space class="alignCenter">
                      <n-avatar
                        round
                        style="margin-right: 0px"
                        :bordered="false"
                        :size="50"
                        :src="chapm[0]"
                        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                        @click="showCurrentChampstatstones(chapm[3],index)"
                      />
                      <n-tag :bordered="false" type="success">
                        英雄等级 {{ chapm[1] }}
                      </n-tag>
                      <n-tag :bordered="false" type="warning">
                        熟练度 {{ chapm[2] }}
                      </n-tag>
                    </n-space>
                  </n-list-item>
                </n-scrollbar>
              </n-list>
            </n-space>
          </div>
        </n-tab-pane>
        <n-tab-pane style="padding-top: 5px" name="chap3" tab="永恒星碑">
          <div>
            <n-space vertical>
              <n-list>
                <n-list-item style="padding-bottom: 7px;padding-top: 7px" v-for="statstones in statstonesList">
                  <n-space class="alignCenter">
                    <n-avatar
                      round
                      style="margin-right: 0px"
                      :color="'#eaeaea'"
                      :bordered="false"
                      :size="50"
                      :src="getImaUrl(statstones.imgUrl)"
                      fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    />

                    <n-tag :bordered="false" type="success">{{ statstones.championId }}</n-tag>
                    <n-tag :bordered="false" type="warning">
                      {{ statstones.name }} {{ statstones.value }}
                    </n-tag>
                  </n-space>
                </n-list-item>
              </n-list>
              <p style="color: #9aa4af;margin-left: 10px;margin-top: -5px"
                 v-if="xp!==null && statstonesList.length !==0">
                英雄数据页面点击头像可查看此英雄的永恒星碑
              </p>
              <n-tag v-if="xp!==null && statstonesList.length ===0"
                     :bordered="false" type="error" style="width: 100%;justify-content: center">
                当前召唤师暂无永恒星碑 请前往LOL商城购买
              </n-tag>
            </n-space>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <n-drawer v-model:show="active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
              :height="380" :placement="'bottom'">
      <n-drawer-content>
        <n-space class="alignCenter" justify="space-between" style="margin-top: 10px;margin-bottom: 24px">
          <n-avatar
            round
            style="margin-right: 0px"
            :bordered="false"
            :size="50"
            :src="summonerChampLevel[currentChampIndex][0]"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          />
          <n-tag :bordered="false" type="success">
            英雄等级 {{ summonerChampLevel[currentChampIndex][1] }}
          </n-tag>
          <n-tag :bordered="false" type="warning">
            熟练度 {{ summonerChampLevel[currentChampIndex][2] }}
          </n-tag>
        </n-space>

        <n-tabs type="bar" animated>
          <n-tab-pane v-for="statstones in currentChampStatstones"
                      :name="statstones.name" :tab="statstones.name">
            <n-space vertical>
              <n-list>
                <n-list-item style="padding-bottom: 7px;padding-top: 7px"
                             v-for="statstonesElement in statstones.simpleStatstonesList">
                  <n-space class="alignCenter">
                    <n-avatar
                      round
                      style="margin-right: 0px;"
                      :color="'#eaeaea'"
                      :bordered="false"
                      :size="50"
                      :src="getImaUrl(statstonesElement.imgUrl)"
                      fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                    />
                    <n-rate readonly style="margin-top: 8px;margin-left: -3px" color="#18a058"
                            :default-value="Number(statstonesElement.milestoneLevel)">
                      <n-icon size="20">
                        <Diamond/>
                      </n-icon>
                    </n-rate>
                    <n-tag :bordered="false" type="warning">
                      {{ statstonesElement.name }} {{ statstonesElement.value }}
                    </n-tag>
                  </n-space>
                </n-list-item>
              </n-list>
            </n-space>
          </n-tab-pane>
        </n-tabs>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, Ref, onMounted} from "vue"
import {
  NCard, NAvatar, NProgress, NSpace, NTag, NDrawer, NDrawerContent,
  NList, NListItem, NScrollbar, useMessage, NTabs, NTabPane, NRate, NIcon
} from 'naive-ui'
import {Diamond} from '@vicons/tabler'
import StartGame from "./startGame.vue";
import {getCurrentSummonerInfo, queryCurrentChampStatstones} from "../../lcu/homeLcu";
import {TencentRsoPlatformId} from "../../resources/areaList";

const rankData: Ref = ref([])
const summonerHonor: Ref = ref([])
const summonerChampLevel: Ref = ref([])
const xp: Ref = ref(null)
const statstonesList: Ref = ref([])
const message = useMessage()
const active = ref(false)
const currentChampStatstones: Ref = ref([])
const currentChampIndex = ref(0)
const props:any = defineProps({
  initSetup:{
    default:[false],
    type:Array
  }
})

onMounted(() => {
  init().then(async (value) =>  {
    if (!value){
      const lolCient = (await cube.games.launchers.getRunningLaunchers()).find((i => i.classId===10902))
      if (lolCient===undefined){
        onClientLaunch()
      }else {
        let timer = 0
        const interval = setInterval(async () => {
          timer += 1
          const isInit = await init()
          if (!isInit){
            await init()
          }else {
            clearInterval(interval)
          }
          if (timer===3){
            clearInterval(interval)
          }
        },1500)
      }
    }
  })
})

const init = async () => {
  const homeData: any = await getCurrentSummonerInfo()
  if (homeData === null) {
    return false
  }
  rankData.value = homeData.rank
  summonerHonor.value = homeData.honorData
  summonerChampLevel.value = homeData.champLevel
  xp.value = parseInt(String((homeData.rank[6][0] / homeData.rank[6][1]) * 100))
  statstonesList.value = homeData.statstones
  if (props.initSetup[0] === false){
    props.initSetup[0] = true
    initAfter()
  }
  return true
}

const onClientLaunch = () => {
  const closeMessageOn = cube.windows.message.on('received', async (id) => {
    if (id === 'initHome') {
      let timer = 0
      const interval = setInterval(async () => {
        timer += 1
        if (xp.value === null){
          init()
        }else {
          clearInterval(interval)
          closeMessageOn()
        }
        if (timer===8){
          clearInterval(interval)
          closeMessageOn()
        }
      },3000)
    }
  })
}

const initAfter = async () => {
  cube.games.launchers.events.getInfo(10902).then((info) => {
    if (info?.summoner_info !== undefined){
      localStorage.setItem('locale',info?.summoner_info?.locale)
      const platformId = info?.summoner_info?.platform_id
      if (platformId !=='' || platformId!==undefined){
        const area = TencentRsoPlatformId[platformId]
        if (area !== undefined){
          localStorage.setItem('currentArea',area)
        }
        if (area ==='zh_tw' && info?.summoner_info?.locale==='zh_CN'){
          localStorage.setItem('locale',"zh_TW")
        }
      }
    }
  })
  const currentScreen = (await cube.utils.getPrimaryDisplay()).size
  cube.windows.obtainDeclaredWindow('assist', {x: currentScreen.width - 320, y: (currentScreen.height - 770) / 2})
}

const queryMatch = () => {
  cube.windows.obtainDeclaredWindow('queryMatch')
  cube.windows.hide(cube.windows.current.id())
}
const getImaUrl = (imgUrl: any) => {
  return `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/statstones/${imgUrl.toLowerCase()}`
}
const showCurrentChampstatstones = async (champId: any, champIndex: any) => {
  const champStatstones = await queryCurrentChampStatstones(champId)
  if (typeof champStatstones === "string") {
    message.error(champStatstones)
    return
  }
  if (champStatstones === null) {
    message.error('接口无法使用 !')
    return
  }
  active.value = true
  currentChampStatstones.value = champStatstones
  currentChampIndex.value = champIndex
}

</script>

<style scoped>
@import url(@/assets/css/animationCommon.css);
@import url(@/assets/css/homeCommon.css);
</style>

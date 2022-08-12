<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-avatar
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
          <!--                大区-->
          <n-tag  type="success" style="cursor:pointer"
                 :bordered="false" :round="true" @click = "queryMatch">
           <p v-if="xp!==null">查询战绩</p>
          </n-tag>
        </n-space>
        <n-space justify="space-between" v-if="xp!==null">
          <n-tag type="warning" size="small" round style="width: 56px;justify-content: center"
                 :bordered="false" > {{ rankData[1] }}</n-tag>
          <n-popover
            trigger="hover" :show-arrow="false" placement="bottom">
            <template #trigger>
              <n-tag type="warning" size="small"  style="width: 173px;justify-content: center"
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
                  <div style="font-size: 13px;">{{xp}} %</div>
                </n-space>
              </n-tag>
            </template>
            <span>升级还差 {{rankData[6][1]}} - {{rankData[6][0]}} 经验</span>
          </n-popover>

        </n-space>
        <n-tag v-else type="warning" size="small" round style="width: 241px"
               :bordered="false"></n-tag>
      </n-space>
    </n-card>

    <n-card class="boxShadow pointCard" size="small">
      <n-tabs type="segment" :animated="true">
        <n-tab-pane  style="padding-top: 3px" name="chap1" tab="个人生涯">
            <n-list>
              <n-list-item>
                <n-space justify="space-between">
                  <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0"
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
                  <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0" :round="false"
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
                  <n-tag type="success" :bordered="false" class="tagWidth" v-if="rankData.length !=0" :round="false"
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
        <n-tab-pane  style="padding-top: 8px" name="chap2" tab="英雄数据">
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
        <n-tab-pane style="padding-top: 5px"  name="chap3" tab="永恒星碑">
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

                      <n-tag :bordered="false" type="success">{{statstones.championId}}</n-tag>
                      <n-tag :bordered="false" type="warning">
                        {{ statstones.name }} {{ statstones.value }}
                      </n-tag>
                    </n-space>
                  </n-list-item>
              </n-list>
                <p style="color: #9aa4af;margin-left: 10px;margin-top: -5px" v-if="xp!==null && statstonesList.length !==0">
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
        <n-tabs type="bar" :animated="true">
          <n-tab-pane  v-for="statstones in currentChampStatstones"
             :name="statstones.name" :tab="statstones.name">
              <n-space vertical>
                <n-list>
                  <n-list-item style="padding-bottom: 7px;padding-top: 7px"
                               v-for="statstonesElement in statstones.simpleStatstonesList">
                    <n-space class="alignCenter" >
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
                              :default-value="statstonesElement.milestoneLevel" >
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

<script setup>
import {ref, onMounted} from "vue"
import {ipcRenderer} from 'electron'
import {
  NCard, NAvatar,NProgress, NSpace, NTag, NPopover,NDrawer,NDrawerContent,
  NList, NListItem, NScrollbar, useMessage,NTabs,NTabPane,NRate,NIcon
} from 'naive-ui'
import {Diamond} from '@vicons/tabler'
import {appConfig} from "@/utils/main/config";
import {returnRankData,queryCurrentChampStatstones} from "@/utils/render/renderLcu";

const rankData = ref([])
const summonerHonor = ref([])
const summonerChampLevel = ref([])
const xp = ref(null)
const statstonesList = ref([])
const message = useMessage()
const active = ref(false)
const currentChampStatstones = ref([])
const currentChampIndex = ref(0)

onMounted(() => {
  getHomeData()
  // 监听是否获取到英雄联盟客户端信息
  ipcRenderer.once('client-starting', () => {
    message.loading(
      '英雄联盟客户端启动中...'
    )
  })
  ipcRenderer.once('init-home', (event, data) => {
    rankData.value = data.rank
    summonerHonor.value = data.honorData
    summonerChampLevel.value = data.chapmLevel
    xp.value = parseInt((data.rank[6][0]/data.rank[6][1])*100)
    statstonesList.value = data.statstones
  })
})
const getHomeData = async () => {
  const credentials = appConfig.get('credentials')
  if (credentials.port != '') {
    const homeData = await returnRankData(credentials)
    rankData.value = homeData.rank
    summonerHonor.value = homeData.honorData
    summonerChampLevel.value = homeData.chapmLevel
    xp.value = parseInt((homeData.rank[6][0]/homeData.rank[6][1])*100)
    statstonesList.value = homeData.statstones
  }
}
const queryMatch = () => {
  ipcRenderer.send('show-query-match')
}
const getImaUrl = (imgUrl) => {
  return require(`../../assets/statstones/${imgUrl.toLowerCase ()}`)
}
const showCurrentChampstatstones = async (champId,champIndex) => {
  const champStatstones  =  await queryCurrentChampStatstones(appConfig.get('credentials'),champId)
  if (typeof champStatstones === "string"){
    message.error(champStatstones)
    return
  }
  if (champStatstones === null){
    message.error('接口无法使用 !')
    return
  }
  active.value = true
  currentChampStatstones.value = champStatstones
  currentChampIndex.value = champIndex
}

</script>

<style scoped>
@import url(../../assets/css/animationCommon.css);
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
}

.n-avatar {
  float: left;
  margin-right: 15px;
  margin-top: 1px;
}

.pointCard {
  margin-top: 37px;
  height: 300px;
}

.alignCenter {
  align-items: center;
}

.tagWidth {
  width: 85px;
  justify-content: center;
}
</style>

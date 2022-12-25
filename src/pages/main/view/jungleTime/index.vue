<template>
  <div style="position: relative;margin: 10px 0px 10px 0px">
    <n-space :size="[0,10]" justify="space-between">
      <jungle-team :camp1="monsterCamp_4" :camp2="monsterCamp_1" :camp3="monsterCamp_3"
                   :camp4="monsterCamp_13" :camp5="monsterCamp_5" :camp6="monsterCamp_2" :is-bule="true"/>
      <jungle-team :camp1="monsterCamp_10" :camp2="monsterCamp_7" :camp3="monsterCamp_9"
                   :camp4="monsterCamp_14" :camp5="monsterCamp_11" :camp6="monsterCamp_8" :is-bule="false"/>
      <common-jungle :camp1="monsterCamp_17" :camp2="monsterCamp_6" :pioneer-count="pioneerCount"
                     :camp3="monsterCamp_16" :camp4="monsterCamp_15" :camp-dragon="monsterCamp_12" :is-dragon="isDragon"/>
    </n-space>
    <div class="closeWin">
      <n-popconfirm
        positive-text="确定"
        negative-text="取消"
        :show-icon="false"
        @positive-click="closeJungleTime">
        <template #trigger>
          <div class="closeWinDiv"></div>
        </template>
       是否关闭此窗口
      </n-popconfirm>
    </div>
  </div>
</template>

<script setup lang="ts">
import JungleTeam from './jungleTeam.vue'
import CommonJungle from './commonJungle.vue'
import {CountdownInst, NSpace} from 'naive-ui'
import {ref} from "vue";
import {NPopconfirm} from "naive-ui"

interface infoObject {
  category: string;
  key: string;
  value: string;
}

interface infoValue {
  camp_name: string,
  alive: string,
  icon_status: string,
  vision: string
}

const monsterCamp_1 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_2 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_3 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_4 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_5 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_6 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_7 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_8 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_9 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_10 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_11 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_12 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_13 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_14 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_15 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_16 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const monsterCamp_17 = ref({
  countdownRef: ref<CountdownInst | null>(),
  isActice: false,
  isAlive: true,
  duration: 0
})
const pioneerCount = ref(0)
const isDragon = ref(false)
let isSuccess = false
let isInit = true

cube.games.events.on('update-info', (classId: number, info: infoObject) => {
  if (info.key.indexOf('jungle') !== -1) {
    handleCamp(info)
    if (!isSuccess){
      isSuccess = true
      cube.windows.getWindowByName('background').then((v) => {
        cube.windows.message.send(v.id,'jungle_success','')
      })
    }
  }
})

const handleCamp = (info: infoObject) => {
  const value:infoValue = JSON.parse(info.value)
  switch (info.key) {
    case 'jungle_camp_1':
      taskAnalse(value,monsterCamp_1,'jungle_camp_1')
      break
    case 'jungle_camp_2':
      taskAnalse(value,monsterCamp_2,'jungle_camp_2')
      break
    case 'jungle_camp_3':
      taskAnalse(value,monsterCamp_3,'jungle_camp_3')
      break
    case 'jungle_camp_4':
      taskAnalse(value,monsterCamp_4,'jungle_camp_4')
      break
    case 'jungle_camp_5':
      taskAnalse(value,monsterCamp_5,'jungle_camp_5')
      break
    case 'jungle_camp_6':
      taskAnalse(value,monsterCamp_6,'jungle_camp_6')
      break
    case 'jungle_camp_7':
      taskAnalse(value,monsterCamp_7,'jungle_camp_7')
      break
    case 'jungle_camp_8':
      taskAnalse(value,monsterCamp_8,'jungle_camp_8')
      break
    case 'jungle_camp_9':
      taskAnalse(value,monsterCamp_9,'jungle_camp_9')
      break
    case 'jungle_camp_10':
      taskAnalse(value,monsterCamp_10,'jungle_camp_10')
      break
    case 'jungle_camp_11':
      taskAnalse(value,monsterCamp_11,'jungle_camp_11')
      break
    case 'jungle_camp_12':
      taskAnalse(value,monsterCamp_12,'jungle_camp_12')
      break
    case 'jungle_camp_13':
      taskAnalse(value,monsterCamp_13,'jungle_camp_13')
      break
    case 'jungle_camp_14':
      taskAnalse(value,monsterCamp_14,'jungle_camp_14')
      break
    case 'jungle_camp_15':
      taskAnalse(value,monsterCamp_15,'jungle_camp_15')
      break
    case 'jungle_camp_16':
      taskAnalse(value,monsterCamp_16,'jungle_camp_16')
      break
    case 'jungle_camp_17':
      taskAnalse(value,monsterCamp_17,'jungle_camp_17')
      break

  }
}

const taskAnalse = (value:infoValue,monster:any,type_:string) => {
  if (value.alive === '0' && value.icon_status === '1') { // 1分钟后刷新
    if (isInit){
      initJungle(monsterCamp_17,'jungle_camp_17')
      initJungle(monsterCamp_6,'jungle_camp_6')
      initJungle(monsterCamp_16,'jungle_camp_16')
      initJungle(monsterCamp_15,'jungle_camp_15')
      isInit = false
    }
    monster.value.isActice = true
    monster.value.duration = 60000
    monster.value.isAlive = false
    monster.value.countdownRef?.reset()
  } else if (value.alive === "0" && value.icon_status === "0") {
    if (type_==='jungle_camp_4'||type_==='jungle_camp_1'||type_==='jungle_camp_7'||type_==='jungle_camp_10'||type_==='jungle_camp_6'){
      monster.value.duration = 300000 // 击杀后 5分钟刷新
    }else if (type_==='jungle_camp_15'||type_==='jungle_camp_16') {
      return
    }else if (type_==='jungle_camp_17'||type_==='jungle_camp_12') {
      monster.value.duration = 360000 // 击杀后 6分钟刷新
      if (type_==='jungle_camp_17' && pioneerCount.value<2){
        pioneerCount.value += 1
      }
    }else {
      monster.value.duration = 135000 // 击杀后 2.15 分钟刷新
    }
    monster.value.isActice = true
    monster.value.isAlive = false
    monster.value.countdownRef?.reset()
  } else if (value.alive === "1") {
    monster.value.isAlive = true
    if (type_==='jungle_camp_12' && isDragon.value ===false){
      isDragon.value=true
    }
  }
}

const initJungle = (monster:any,type_:string) => {
  switch (type_) {
    case 'jungle_camp_17':
      monster.value.duration = 450000
      break
    case 'jungle_camp_6':
      monster.value.duration = 270000
      break
    case 'jungle_camp_16':
      monster.value.duration = 180000
      break
    case 'jungle_camp_15':
      monster.value.duration = 180000
      break
  }
  monster.value.isActice = true
  monster.value.isAlive = false
  monster.value.countdownRef?.reset()
}

const closeJungleTime = () => {
  cube.windows.close(cube.windows.current.id())
}

</script>

<style scoped>
.closeWin {
  position: absolute;
  right: 95px;
  bottom: -9px;
}
.closeWinDiv{
  border-radius: 5px;
  width: 30px;
  height: 5px;
  background-color: #9aa4af;
  cursor: pointer;
}
</style>

<template>
  <div class="mainDiv boxShadow">
    <n-space vertical justify="space-between" :size="[0,0]"
             style="height: 100%;width: 100%">

      <n-space class="rowSpace"  :size="[0,0]">
         <span v-if="isDragon||pioneerCount===2">
           大龙龙
           <n-countdown
             :ref="`'${campDragon.countdownRef}'`"
             v-if="!campDragon.isAlive"
             :render="renderCountdown"
             :duration="campDragon.duration"
             :active="campDragon.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/>
         <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
      </span>

        <span v-else>先锋锋 <n-countdown :ref="`'${camp1.countdownRef}'`" v-if="!camp1.isAlive"
                                         :render="renderCountdown" :duration="camp1.duration" :active="camp1.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/>
         <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
      </span>

        <span>小龙龙 <n-countdown :ref="`'${camp2.countdownRef}'`" v-if="!camp2.isAlive"
                                  :render="renderCountdown" :duration="camp2.duration" :active="camp2.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/>
         <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
      </span>
      </n-space>

      <n-space class="rowSpace"  :size="[0,0]">
        <span>上河蟹 <n-countdown :ref="`'${camp3.countdownRef}'`" v-if="!camp3.isAlive"
                                  :render="renderCountdown" :duration="camp3.duration" :active="camp3.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/>
         <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
      </span>
        <span>下河蟹 <n-countdown :ref="`'${camp4.countdownRef}'`" v-if="!camp4.isAlive"
                                  :render="renderCountdown" :duration="camp4.duration" :active="camp4.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/>
         <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
      </span>
      </n-space>

    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NSpace, NCountdown, CountdownProps, CountdownInst} from 'naive-ui'
import {ref} from "vue";

const props = defineProps({
  camp1: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: true
    }
  },
  camp2: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: true
    }
  },
  camp3: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: true
    }
  },
  camp4: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: true,
    }
  },
  campDragon: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: true,
    }
  },
  isDragon: {
    type: Boolean,
    default: false
  },
  pioneerCount:{
    type:Number,
    default:0
  }
})
const renderCountdown: CountdownProps['render'] = ({hours, minutes, seconds}) => {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>

<style scoped>
.mainDiv {
  border-radius: 3px;
  background-color: #fff;
  margin: 0px 10px;
  color: #666F75;
  width: calc(100vw - 20px);
}
span {
  display: inline-block;
  font: bold 13px sans-serif;
}

.alive {
  color: #ffffff;
}
.rowSpace {
  justify-content: space-around !important;
  padding: 2px;
}
</style>

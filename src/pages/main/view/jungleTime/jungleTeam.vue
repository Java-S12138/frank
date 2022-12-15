<template>
  <div class="mainDiv boxShadow">
    <n-space vertical justify="space-between" :size="[0,0]"
             style="height: 100%;width: 100%">
      <n-space class="rowSpace" :size="[0,0]" :class="isBule===true ? 'blue' : 'red'">
        <span>红霸符 <n-countdown  :ref="`'${camp1.countdownRef}'`" v-if="!camp1.isAlive"
                                   :render="renderCountdown" :duration="camp1.duration" :active="camp1.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>
        <span>蓝霸符 <n-countdown :ref="`'${camp2.countdownRef}'`" v-if="!camp2.isAlive"
                                  :render="renderCountdown" :duration="camp2.duration" :active="camp2.isActice"/>
        <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>

      </n-space>
      <n-space class="rowSpace" :size="[0,0]" :class="isBule===true ? 'blue' : 'red'">
        <span>锋喙鸟 <n-countdown :ref="`'${camp3.countdownRef}'`" v-if="!camp3.isAlive"
                                  :render="renderCountdown" :duration="camp3.duration" :active="camp3.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>
        <span>魔沼蛙 <n-countdown :ref="`'${camp4.countdownRef}'`" v-if="!camp4.isAlive"
                                  :render="renderCountdown" :duration="camp4.duration" :active="camp4.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>

      </n-space>
      <n-space class="rowSpace" :size="[0,0]" :class="isBule===true ? 'blue' : 'red'">
        <span>石甲虫 <n-countdown :ref="`'${camp5.countdownRef}'`" v-if="!camp5.isAlive"
                                  :render="renderCountdown" :duration="camp5.duration" :active="camp5.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>
        <span>暗影狼 <n-countdown :ref="`'${camp6.countdownRef}'`" v-if="!camp6.isAlive"
                                  :render="renderCountdown" :duration="camp6.duration" :active="camp6.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="0" :active="false"/></span>
        </span>
      </n-space>
    </n-space>

  </div>
</template>

<script setup lang="ts">
import {NSpace, NCountdown, CountdownProps, CountdownInst} from 'naive-ui'
import {ref} from "vue"

const props = defineProps({
  camp1: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false
    }
  },
  camp2: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false
    }
  },
  camp3: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false
    }
  },
  camp4: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false,
      duration: 0
    }
  },
  camp5: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false,
      duration: 0
    }
  },
  camp6: {
    type: Object,
    default: {
      countdownRef: ref<CountdownInst | null>(),
      isActice: false,
      isAlive: false,
      duration: 0
    }
  },
  isBule:{
    type:Boolean
  }
})

const renderCountdown: CountdownProps['render'] = ({hours, minutes, seconds}) => {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

</script>

<style scoped>
.mainDiv {
  margin: 0px 10px;
  width: calc(100vw - 20px);
  height: 32.9vh;
  border-radius: 3px;
  background-color: #fff;
}

span {
  display: inline-block;
  font: bold 13px sans-serif;
}

.alive {
  color: #ffffff !important;
}
.rowSpace {
  justify-content: space-around !important;
  padding: 2px;
}
.blue {
  color: #2080f0;
}
.red {
  color: #FF8282;
}
</style>

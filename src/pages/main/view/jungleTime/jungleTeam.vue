<template>
  <div class="mainDiv">
    <n-space vertical justify="space-between" :size="[0,0]"
             style="height: 100%;width: 100%">
      <n-space>
        <span>红 <n-countdown  :ref="`'${camp1.countdownRef}'`" v-if="!camp1.isAlive"
                                :render="renderCountdown" :duration="camp1.duration" :active="camp1.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
        </span>
        <span>蓝 <n-countdown :ref="`'${camp2.countdownRef}'`" v-if="!camp2.isAlive"
                              :render="renderCountdown" :duration="camp2.duration" :active="camp2.isActice"/>
        <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
        </span>

      </n-space>
      <n-space>
        <span>鸟 <n-countdown :ref="`'${camp3.countdownRef}'`" v-if="!camp3.isAlive"
                              :render="renderCountdown" :duration="camp3.duration" :active="camp3.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
        </span>
        <span>蛤 <n-countdown :ref="`'${camp4.countdownRef}'`" v-if="!camp4.isAlive"
                              :render="renderCountdown" :duration="camp4.duration" :active="camp4.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
        </span>

      </n-space>
      <n-space>
        <span>石 <n-countdown :ref="`'${camp5.countdownRef}'`" v-if="!camp5.isAlive"
                              :render="renderCountdown" :duration="camp5.duration" :active="camp5.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
        </span>
        <span>狼 <n-countdown :ref="`'${camp6.countdownRef}'`" v-if="!camp6.isAlive"
                              :render="renderCountdown" :duration="camp6.duration" :active="camp6.isActice"/>
          <span class="alive" v-else><n-countdown   :render="renderCountdown" :duration="12000" :active="false"/></span>
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
})

const renderCountdown: CountdownProps['render'] = ({hours, minutes, seconds}) => {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

</script>

<style scoped>
.mainDiv {
  margin: 5px;
  width: 35vw;
  height: calc(100vh - 10px);
}

span {
  display: inline-block;
}

@media (min-width: 150px) {
  span {
    font: bold 10px sans-serif;
  }
}

@media (min-width: 350px) {
  span {
    font: bold 13px sans-serif;
  }
}

@media (min-width: 450px) {
  span {
    font: bold 18px sans-serif;
  }
}
.alive {
  color: #8E959A !important;
}

</style>

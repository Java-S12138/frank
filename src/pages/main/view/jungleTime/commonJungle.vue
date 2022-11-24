<template>
  <div class="mainDiv">
    <n-space vertical justify="space-between" :size="[0,0]"
             style="height: 100%;width: 100%">
      <span>先锋 <n-countdown :ref="`'${camp1.countdownRef}'`" v-if="!camp1.isAlive"
                              :render="renderCountdown" :duration="camp1.duration" :active="camp1.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/></span>
      <span>小龙 <n-countdown :ref="`'${camp2.countdownRef}'`" v-if="!camp2.isAlive"
                              :render="renderCountdown" :duration="camp2.duration" :active="camp2.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/></span>
      <span>上蟹 <n-countdown :ref="`'${camp3.countdownRef}'`" v-if="!camp3.isAlive"
                              :render="renderCountdown" :duration="camp3.duration" :active="camp3.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/></span>
      <span>下蟹 <n-countdown :ref="`'${camp4.countdownRef}'`" v-if="!camp4.isAlive"
                              :render="renderCountdown" :duration="camp4.duration" :active="camp4.isActice"/>
          <n-countdown  v-else :render="renderCountdown" :duration="12000" :active="false"/></span>
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
      duration: 0
    }
  }
})
const renderCountdown: CountdownProps['render'] = ({hours, minutes, seconds}) => {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>

<style scoped>
.mainDiv {
  margin: 5px;
  /*width: 35vw;*/
  height: calc(100vh - 10px);
}
span {
  display: block;
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

</style>

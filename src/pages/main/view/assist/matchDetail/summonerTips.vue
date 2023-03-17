<template>
  <n-scrollbar style="max-height: 378px;padding-right: 14px">
    <div class="fade-in-bottom">
      <n-space vertical :size="[0,18]">
        <n-alert title="对局分析" type="info">
          最近战绩页面 显示当前召唤师最近20局战绩
          如果您想查看召唤师当前游戏模式的最近战绩或者更多信息<br>
          请关闭此页面 点击左下角 [对局分析]
        </n-alert>
        <n-alert title="动画卡顿" type="info">
          请在Cube的设置里面 <br>选择通用设置 打开硬件加速
        </n-alert>
        <n-alert title="优先显示" type="info">
          数据获取成功后 <br>是否选择优先显示此页面
          <n-switch style="margin-bottom: 2.5px;margin-left: 8px" v-model:value="active" size="small"  @click="changeSetting" />
        </n-alert>
      </n-space>
    </div>
  </n-scrollbar>

</template>

<script setup lang="ts">
import {NAlert,NSpace,NSwitch,NScrollbar} from "naive-ui"
import {ref} from "vue";

const active = ref(JSON.parse(<string>(localStorage.getItem('config'))).showMatchDetail)
const changeSetting = () => {
  const config = JSON.parse(<string>(localStorage.getItem('config')))
  config['showMatchDetail'] = active.value
  localStorage.setItem('config',JSON.stringify(config))
}
</script>

<style scoped>
.fade-in-bottom{animation:fade-in-bottom .6s cubic-bezier(.39,.575,.565,1.000) both}
@keyframes fade-in-bottom{0%{transform:translateY(50px);opacity:0}100%{transform:translateY(0);opacity:1}}
</style>

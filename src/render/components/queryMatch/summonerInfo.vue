<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <header>
        <n-space justify="space-between">
          <n-avatar
            round
            :bordered="false"
            :size="60"
            src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/5430.png"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display:block"
          />
        <n-space vertical :size="[2,10]">
          <n-tag type="success" style="width: 150px;justify-content: center"
                 :bordered="false" :round="true">
            多元函数积分学
          </n-tag>
          <n-tag type="warning" size="small"  style="width: 150px"
                 :bordered="false" :round="true">
            <n-space style="align-items: center">
              <n-progress
                type="line"
                :show-indicator="false"
                :percentage="60"
                status="warning"
                processing
                style="width: 90px;"
                :height="10"
              />
              <span style="padding-top: 2px">60%</span>
            </n-space>
          </n-tag>
        </n-space>
      </n-space>
      </header>

      <div style="margin-top: 20px">
        <n-space>
          <n-input style="width: 153px;" placeholder="仅支持当前大区玩家"/>
          <n-button type="success">搜索</n-button>
        </n-space>

      </div>
    </n-card>

  </div>
</template>

<script>
export default {
  name: "summonerInfo"
}
</script>
<script setup>
import {
  NCard, NAvatar, NSpace, NTag, NButton, NPopover,NInput,
  NList, NListItem, NScrollbar, useMessage,NProgress
} from 'naive-ui'

</script>

<style scoped>
@import url("../../assets/css/queryMatchCommon.css");
.mainCard {
  width: 25vw;
}
</style>

<template>
  <div >
    <n-card class="boxShadow listCard"  size="small">
      <n-scrollbar style="max-height: 525px;">
        <n-list style="margin-right:13px;margin-left: 13px">
          <n-list-item>
            <n-space justify="space-between" class="alignCenter">
              <n-ellipsis style="max-width: 112px;width:112px">
                不如拿来麻辣烫
              </n-ellipsis>
              <p>2022-7-25</p>
              <n-button size="small" type="success" dashed>原因</n-button>
            </n-space>
          </n-list-item>
          <n-list-item>
            <n-space justify="space-between" class="alignCenter">
              <n-ellipsis style="max-width: 112px;width:112px">
                Ikria
              </n-ellipsis>
              <p>2022-7-25</p>
              <n-button size="small" type="success" dashed>原因</n-button>
            </n-space>
          </n-list-item>
      </n-list>
      </n-scrollbar>
    </n-card>

    <n-card class="boxShadow"  size="small" >
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-space justify="center" :size="[0,-1]">
            <p style="color: #9aa4af;">珍爱生命 远离摆烂</p>
            <p style="color: #9aa4af;">营造良好游戏环境从你我做起</p>
          </n-space>
        </template>
        <span>点击此处  新增黑名单</span>
      </n-popover>

    </n-card>
  </div>
</template>

<script setup>
import {NCard,NSpace,NList,NPopover,
  NListItem,NButton,NScrollbar,NEllipsis} from 'naive-ui'
import {onMounted} from "vue"

onMounted(() => {
  let divListCard = document.querySelectorAll("div.n-card.n-card--bordered.boxShadow.listCard > div")[0]
  divListCard.style = "padding-left:0px;padding-right:0px"
})


</script>

<style scoped>
.n-card {
  margin: 15px;
  border-radius: 10px;
  width: auto;
}
.listCard {
  padding: 0px !important;
}
.alignCenter {
  align-items: center;
}
.n-scrollbar > .n-scrollbar-rail.n-scrollbar-rail--vertical {
  right: 15px !important;
  position: absolute;
}
</style>

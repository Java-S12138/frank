<script setup lang="ts">
import {
  NCard, NAvatar, NProgress, NSpace, NTag, NDrawer, NDrawerContent, NDivider,
  NList, NTabPane, NTabs, useMessage, NCarousel, NAlert, NDescriptionsItem, NIcon
} from 'naive-ui'


</script>

<template>
  <n-card size="small" class="mt-4 shadow" style="height: 370px">
    <n-carousel
      direction="vertical"
      dot-placement="bottom"
      mousewheel
      style="width: 100%;height: 345px; "
    >
      <div>
            <div class="flex gap-x-3">
              <img class="rounded" src="https://game.gtimg.cn/images/lol/act/img/skinloading/ebad70bd-37e4-4c0b-80a3-fd2f7f12445b.jpg"
                   width="88px" height="160px">
              <div class="flex-grow">
                <!--            胜率 登场 禁用-->
                <n-space style="height: 160px;" justify="space-between"  vertical>
                  <n-space justify="space-between">
                    <n-tag
                      :bordered="false" size="small"
                      style="width: 120px;justify-content: center"
                    >
                      机械先驱•维克托
                    </n-tag>
                    <n-tag :bordered="false" size="small">中路</n-tag>
                  </n-space>
                  <n-tag class="text-gray-400 w-full justify-center text-ss" size="small" :bordered="false" >
                    14.1版本 → 14.1b版本
                  </n-tag>
                  <div class="flex justify-between">

                    <n-tag type="success" size="small" class="text-ss" :bordered="false">
                      胜率
                    </n-tag>
                    <n-tag type="success" size="small"
                           style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                      43.5% → 45.8%
                    </n-tag>
                  </div>

                  <div class="flex justify-between">
                    <n-tag type="warning" size="small" class="text-ss" :bordered="false">
                      登场
                    </n-tag>
                    <n-tag type="warning" size="small"
                           style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                      5.8% → 5.2%
                    </n-tag>
                  </div>

                  <div class="flex justify-between">
                    <n-tag type="success" size="small" class="text-ss" :bordered="false">
                      禁用
                    </n-tag>
                    <n-tag type="success" size="small"
                           style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                      19.1% → 12.7%
                    </n-tag>
                  </div>
                </n-space>
              </div>
            </div>
        <n-tabs type="line" size="small" animated>
          <n-tab-pane name="Q伤害" tab="Q伤害">
            <text class="text-gray-400 text-ss">
              60/90/120/150/180 (+70%法术强度) (+4/5/6/7/8%目标最大生命值) ⇒ 60/90/120/150/180 (+75%法术强度) (+4/5/6/7/8%目标最大生命值)
            </text>
          </n-tab-pane>
          <n-tab-pane name="R总伤害" tab="R总伤害">
           <text class="text-gray-400 text-ss">200/325/450 (+55%法术强度) ⇒ 200/325/450 (+50%法术强度)"</text>
          </n-tab-pane>
        </n-tabs>
          </div>
      <div class="h-full">
          <div class="flex gap-x-3">
            <img class="rounded" src="https://game.gtimg.cn/images/lol/act/img/skinloading/edbfe0c9-0c56-4fd7-9050-710eb5f24f87.jpg"
                 width="88px" height="160px">
            <div class="flex-grow">
              <!--            胜率 登场 禁用-->
              <n-space style="height: 160px;" justify="space-between"  vertical>
                <n-space justify="space-between">
                  <n-tag
                    :bordered="false" size="small"
                    style="width: 120px;justify-content: center"
                  >
                    机械先驱•维克托
                  </n-tag>
                  <n-tag :bordered="false" size="small">中路</n-tag>
                </n-space>
                <n-tag class="w-full justify-center text-ss" size="small" :bordered="false" :disabled="true">
                  14.1版本 → 14.1b版本
                </n-tag>
                <div class="flex justify-between">

                  <n-tag type="success" size="small" class="text-ss" :bordered="false">
                    胜率
                  </n-tag>
                  <n-tag type="success" size="small"
                         style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                    43.5% → 45.8%
                  </n-tag>
                </div>

                <div class="flex justify-between">
                  <n-tag type="warning" size="small" class="text-ss" :bordered="false">
                    登场
                  </n-tag>
                  <n-tag type="warning" size="small"
                         style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                    5.8% → 5.2%
                  </n-tag>
                </div>

                <div class="flex justify-between">
                  <n-tag type="success" size="small" class="text-ss" :bordered="false">
                    禁用
                  </n-tag>
                  <n-tag type="success" size="small"
                         style="font-size: 13px;width: 120px;justify-content: center" :bordered="false">
                    19.1% → 12.7%
                  </n-tag>
                </div>
              </n-space>
            </div>
          </div>
          <n-alert class="mt-3" :show-icon="false" type="default" :bordered="false">
            <div class="text-gray-400 text-ss indent-4"> Q伤害：80/125/170/215/260 (+80%法术强度) ⇒ 80/125/170/215/260 (+70%法术强度)</div>
            <div class="text-gray-400 text-ss indent-4">
              R总伤害：200/325/450 (+55%法术强度) ⇒ 200/325/450 (+50%法术强度)
            </div>
          </n-alert>
        </div>
    </n-carousel>
  </n-card>
</template>


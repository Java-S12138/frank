<script setup lang="ts">
import {NAvatar, NButton, NCard, NEllipsis, NProgress, NSpace, NTag} from "naive-ui"
</script>

<template>
  <n-card size="small" class="shadow">
    <!--    头像 昵称 等级-->
    <div class="h-14 flex gap-x-2">
      <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
      />
      <n-space class="flex-grow" :size="[0,0]"
               justify="space-between" vertical>
        <div class="flex justify-between">
          <!--昵称-->
          <n-tag class="w-full justify-center" type="success" :bordered="false" round>
              18岁游走型中单
          </n-tag>
        </div>

        <div class="flex justify-between gap-x-3">
          <div class="flex-grow"
               style="background-color: rgba(240, 160, 32, 0.15);
               padding: 0 7px; color: #f0a020; font-size: 12px;
               border-radius: 12px">
            <div class="flex justify-between items-center">
              <n-progress
                type="line"
                :show-indicator="false"
                :percentage="38"
                status="warning"
                processing
                style="width:96px"
                :height="10"
              />
              <div style="padding-top: 1px;">Lv 415</div>
            </div>
          </div>

        </div>
      </n-space>
    </div>
    <!--    头像 昵称 等级-->
  </n-card>
</template>



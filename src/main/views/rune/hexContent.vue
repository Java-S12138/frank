<script setup lang="ts">
import {NTag, useMessage, NAvatar, NScrollbar, NPopover, NEllipsis} from "naive-ui";
import {Gold} from "@/main/views/rune/runeTypes";
import {ref, watch, nextTick} from "vue";

interface SVGMap {
  [key: string]: string;
}


const {hexInfoList} = defineProps<{ hexInfoList: Gold[] }>();

const getImageUrl = (name: string) => {
  return new URL(`../../../assets/hexImages/${name}.png`, import.meta.url).href
}
const getType = (level: string) => {
  switch (level) {
    case "S":
      return 'error';
    case "A":
      return 'warning';
    default:
      return 'default';
  }
}

const SVG: SVGMap = {
  'S': new URL("@/assets/svg/hexS.svg", import.meta.url).href,
  'A': new URL("@/assets/svg/hexA.svg", import.meta.url).href,
  'B': new URL("@/assets/svg/hexB.svg", import.meta.url).href,
  'C': new URL("@/assets/svg/hexC.svg", import.meta.url).href,
  'D': new URL("@/assets/svg/hexD.svg", import.meta.url).href,
  'E': new URL("@/assets/svg/hexE.svg", import.meta.url).href
}


</script>

<template>
  <n-scrollbar
    style="height: 442px; padding-right: 0.5px"
    content-style="padding:0px 12px;"
  >
    <div class="flex flex-col gap-3 mt-2">
      <div class="flex gap-3" v-for="hex in hexInfoList">
        <img class="bg-slate-950 dark:bg-[#70c0e850]" style="border-radius: 50px;width: 48px;height: 48px;"
             :src="getImageUrl(hex.skill)"/>
        <div class="flex flex-col justify-between">
          <div class="flex items-top gap-2 mt-1">
            <n-avatar
              style="background-color:#ffffff00;width: 24px;height: 24px;"
              :src="SVG[hex.level]"
            />
            <n-tag style="height: 24px;" :bordered="false" :type="getType(hex.level)">
              {{ hex.name }}
            </n-tag>
          </div>

          <n-popover trigger="click" placement="bottom" style="max-width: 190px">
            <template #trigger>
              <div style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <text style="font-size: 13px" class="text-gray-400 cursor-pointer">
                  {{ hex.desc }}
                </text>
              </div>
            </template>
            <span style="font-size: 13px">{{ hex.desc }}</span>
          </n-popover>
        </div>
      </div>
    </div>

  </n-scrollbar>
</template>

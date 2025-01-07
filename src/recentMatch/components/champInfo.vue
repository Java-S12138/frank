<script setup lang="ts">

import {NAvatar, NTag,NAlert,NEllipsis,NPopover} from "naive-ui";
import {ChampInfoTypes, ChampTinyTypes} from "@/recentMatch/utils/queryTypes";

const {champInfoList,champTiny} = defineProps<{
champInfoList: ChampInfoTypes[],champTiny:ChampTinyTypes|null
}>()

const handleIndex = (index:number) => {
  switch (index) {
    case 0:return 'Q';
    case 1:return 'W';
    case 2:return 'E';
    case 3:return 'R';
  }
}

const rules =   {
  fighter:'战士',
  tank:'坦克',
  mage:'法师',
  assassin:'刺客',
  marksman:'射手',
  support:'辅助',
}

const handleRole = (roleList:string[]) => {
  let roleStr = ''
  for (let i = 0; i < roleList.length; i++) {
    roleStr += `${rules[roleList[i]]} `
  }
  return roleStr
}


</script>

<template>
  <div v-if='champTiny === null'>
    数据获取异常...
  </div>
  <div v-else class="flex flex-col items-start h-full justify-between">
    <div class="flex w-full justify-between">
      <div class="flex gap-2">
        <n-avatar
          :size="58"
          :src=champTiny.alias
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <div class="flex flex-col items-start space-y-2">
          <n-tag :bordered="false">
            {{ champTiny.name }}
          </n-tag>
          <n-tag size="small">
            {{handleRole(champTiny.roles) }}
          </n-tag>
        </div>
      </div>
      <div class="flex gap-2">
        <n-avatar
          :size="58"
          :src="champInfoList[champInfoList.length - 1].abilityIconPath"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <div class="flex flex-col items-start space-y-2">
          <n-popover style="max-width: 450px" trigger="hover" placement="bottom-start">
            <template #trigger>
              <n-tag :bordered="false">
                <n-ellipsis :tooltip="false" style="max-width: 122px">
                  {{ champInfoList[champInfoList.length - 1].name }}
                </n-ellipsis>
              </n-tag>
            </template>
            <span >
                  {{champInfoList[champInfoList.length - 1].description}}
            </span>
          </n-popover>

          <n-tag size="small">
            被动技能
          </n-tag>
        </div>
      </div>

      <div>
        <div class="flex flex-col items-start space-y-2">
          <n-tag :bordered="false" type="info">
            鼠标移动到技能名称
          </n-tag>
          <n-tag size="small">
            查看详情
          </n-tag>
        </div>
      </div>
    </div>

    <n-alert
    v-for="index in [0,1,2,3]"
      :show-icon="false" class="w-full" style="border-radius: 8px">
      <div class="grid grid-cols-4 border border-gray-300">
        <!-- 第一行 -->
        <div class="col-span-1">
          <div class="flex-col items-start space-y-1">
            <n-avatar
              :size="43"
              :src="champInfoList[index].abilityIconPath"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
          />
          <div>
              <n-popover style="max-width: 555px" trigger="hover" placement="bottom-start">
                <template #trigger>
                  <n-tag>
                    <n-ellipsis :tooltip="false" style="max-width: 122px">
                      {{ handleIndex(index) }}•{{ champInfoList[index].name }}
                    </n-ellipsis>
                  </n-tag>
              </template>
                <span >
                  {{champInfoList[index].description}}
                </span>
              </n-popover>
            </div>
          </div>
        </div>
        <div class="col-span-3 p-2 pb-1.5 rounded bg-[#eeeeee]  dark:bg-[#404040]">
          <p class="p-0 m-0">
            技能冷却：{{ champInfoList[index].cooldown }}
          </p>
          <p class="p-0 m-0">
            技能消耗：{{ champInfoList[index].cost }}
          </p>
          <p class="p-0 m-0">
          释放范围：{{ champInfoList[index].range }}
          </p>
        </div>
      </div>
    </n-alert>
  </div>

</template>
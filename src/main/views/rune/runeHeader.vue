<script setup lang="ts">
import {NCard, NAvatar, NButton, NBadge, NDrawer, useMessage} from 'naive-ui';
import {useRuneStore} from "@/main/store/useRune";
import RuneAuto from "@/main/views/rune/runeAuto.vue";
import {onDeactivated, onMounted, ref} from "vue";
import {isStoreageHas} from "@/lcu/utils";
import {handleRunesWrite} from "@/main/views/rune/runes";

const storeRune = useRuneStore()

const autoRuneActive = ref(false)
const isAutoRune = ref(false)
const message = useMessage()

onMounted(() => {
  isAutoRune.value = isStoreageHas('autoRune',storeRune.currentChampAlias)
  if (isAutoRune.value){
    autoWriteRune()
  }
})

const openDrawer = () => {
  autoRuneActive.value = true
}
const setupAutoRune = (type:string) => {
  if (type ==='auto'){
    autoRuneActive.value = false
    isAutoRune.value = true
  }else {
    isAutoRune.value = false
  }
}

// 自动配置符文
const autoWriteRune = () => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('自动符文，需要订阅，请手动配置', {duration: 3000})
    return
  }
  const localRuneStr = localStorage.getItem('autoRune') as string
  const runeData = JSON.parse(localRuneStr)[storeRune.currentChampAlias]

  if (runeData === undefined){
    message.error('自动符文，数据获取失败', {duration: 3000})
    return
  }

  handleRunesWrite(runeData,false,[]).then((writeRes) => {
    if (writeRes===1){
      message.success('自动符文配置成功')
    }else if (writeRes===3){
      message.success('自动符文配置失败')
    }
  })

}
onDeactivated(() => {
  autoRuneActive.value = false
})
</script>

<template>
  <n-card class="shadow" size="small">
    <div class="flex justify-between items-center">
      <div class="flex gap-x-2 items-center">
        <n-badge style="font-family: DingTalk"
                 :value="isAutoRune?'auto':''" color="#ff6666">
          <n-avatar
            round
            :bordered="false"
            :size="50"
            :src="storeRune.currentChampImgUrl"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display: block"
          />
        </n-badge>
          <div class="relative" v-for="skill in storeRune.skillsList">
            <n-avatar
              round
              :bordered="false"
              :size="34"
              :src='skill[0]'
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display: block"
            />
            <strong
              class="skillText bg-neutral-900 bg-opacity-80 text-green-400">
              {{skill[1]}}
            </strong>
          </div>
      </div>
      <div>
        <n-button @click="openDrawer"
                  :focusable="false" class="p-2" secondary
                  :type="isAutoRune?'success':'tertiary'">
          自动符文
        </n-button>
      </div>
    </div>

  </n-card>
  <n-drawer
    class="rounded-t-xl"
    v-model:show="autoRuneActive"
    :height="288" :auto-focus="false" placement="bottom">
    <rune-auto :champ="storeRune.currentChampAlias"
               :champ-name="storeRune.currentChampTitle"
               @complete-setup="setupAutoRune"/>
  </n-drawer>
</template>

<style scoped>
.skillText {
  width: 12px;
  height: 12px;
  padding: 2px;
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  white-space: nowrap;
  font-size: 10px;
}
</style>

<script setup lang="ts">
import {NTabs, NTabPane,NCard,NDrawer} from "naive-ui"
import RuneContent from "./runeContent.vue";
import BlockContent from "./blockContent.vue";
import RuneAuto from "./runeAuto.vue";
import {onDeactivated, onMounted, Ref, ref} from "vue";
import {Rune} from "./runeTypes";
import {useRuneStore} from "@/main/store/useRune";
import {get101Runes} from "./get101Runes";

const storeRune = useRuneStore()
const autoRuneActive = ref(false)
const rune101List:Ref<Rune[]> = ref([])


onMounted(async () => {
  if (storeRune.currentChamp !== 0){
    rune101List.value = await get101Runes(storeRune.currentChamp)
  }
})

const openDrawer = () => {
  autoRuneActive.value = true
}

const setupAutoRune = (type:string) => {
  if (type ==='auto'){
    autoRuneActive.value = false
    storeRune.isAutoRune = 'auto'
  }else {
    storeRune.isAutoRune = ''
  }
}
onDeactivated(() => {
  autoRuneActive.value = false
})

</script>

<template>
  <n-card v-if="storeRune.currentChamp!==0" class="shadow" size="small"
          content-style="padding-top:2px;" style="height: 517px;">
    <n-tabs class="mt-2.5" type="segment" animated justify-content="space-between">
      <n-tab-pane name="tab1" tab="推荐符文">
        <rune-content @auto-rune-active="openDrawer" :rune-list="storeRune.runeDataList"/>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="官方符文">
        <rune-content @auto-rune-active="openDrawer" :rune-list="rune101List"/>
      </n-tab-pane>
      <n-tab-pane name="tab3" tab="配装方案">
        <block-content/>
      </n-tab-pane>
    </n-tabs>
    <n-drawer
      class="rounded-t-xl"
      v-model:show="autoRuneActive"
      :height="288" :auto-focus="false" placement="bottom">
      <rune-auto :champ="storeRune.currentChampAlias"
                 :champ-name="storeRune.currentChampTitle"
                 @complete-setup="setupAutoRune"/>
    </n-drawer>
  </n-card>
</template>

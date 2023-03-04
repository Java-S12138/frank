<template>
  <n-card class="boxShadow" size="small"
          content-style="padding-top:2px" style="height: 548px;">
    <n-tabs type="line" animated justify-content="space-between">
      <n-tab-pane name="tab1" tab="韩服符文">
        <rune-content @auto-rune-active="openDrawer" :rune-list="storeRune.runeDataList"/>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="国服符文">
        <rune-content @auto-rune-active="openDrawer" :rune-list="rune101List"/>
      </n-tab-pane>
      <n-tab-pane name="tab3" tab="配装方案">
        <block-content/>
      </n-tab-pane>
    </n-tabs>
    <n-drawer
      style="border-top-left-radius: 12px;border-top-right-radius: 12px"
      v-model:show="autoRuneActive" :height="285" :auto-focus="false" placement="bottom">
      <rune-auto :champ="storeRune.currentChampAlias" @complete-setup="setupAutoRune"/>
    </n-drawer>
  </n-card>

</template>

<script setup lang="ts">
import {NTabs, NTabPane,NCard,NDrawer} from "naive-ui"
import RuneContent from "./runeContent.vue";
import BlockContent from "./blockContent.vue";
import RuneAuto from "./runeAuto.vue";
import runeStore from "../../../store/runeStore";
import {get101Runes} from "../../../utils/rune/get101Runes";
import {onMounted, Ref, ref} from "vue";
import {Rune} from "../../../interface/runeTypes";

const storeRune = runeStore()
const rune101List:Ref<Rune[]> = ref([])
const autoRuneActive = ref(false)


onMounted(async () => {
  rune101List.value = await get101Runes(storeRune.currentChamp)
})

const openDrawer = () => {
  autoRuneActive.value = true
}

const setupAutoRune = (type:string) => {
  if (type==='auto'){
    autoRuneActive.value = false
    storeRune.isAutoRune = 'auto'
  }else {
    storeRune.isAutoRune = ''
  }
}
</script>

<style scoped>

</style>

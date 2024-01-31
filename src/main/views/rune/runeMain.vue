<script setup lang="ts">
import {NTabs, NTabPane,NCard} from "naive-ui"
import RuneContent from "./runeContent.vue";
import BlockContent from "./blockContent.vue";
import {onMounted, Ref, ref} from "vue";
import {Rune} from "./runeTypes";
import {useRuneStore} from "@/main/store/useRune";
import {get101Runes} from "./get101Runes";

const storeRune = useRuneStore()

const rune101List:Ref<Rune[]> = ref([])

onMounted(async () => {
    rune101List.value = await get101Runes(storeRune.currentChamp)
})

</script>

<template>
  <n-card class="shadow" size="small"
          content-style="padding-top:2px;" style="height: 517px;">
    <n-tabs class="mt-2.5" type="segment" animated justify-content="space-between">
      <n-tab-pane name="tab1" tab="推荐符文">
        <rune-content :rune-list="storeRune.runeDataList"/>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="官方符文">
        <rune-content :rune-list="rune101List"/>
      </n-tab-pane>
      <n-tab-pane name="tab3" tab="配装方案">
        <block-content/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

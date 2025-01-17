<script setup lang="ts">
import RuneHeader from "./runeHeader.vue";
import RuneMain from "./runeMain.vue";
import {RuneStoreActions, RuneStoreState} from "@/main/views/rune/runeTypes";
import {Store} from "pinia";
import {useRuneStore} from "@/main/store/useRune.ts";

const storeRune: Store<"useRuneStore", RuneStoreState, {}, RuneStoreActions> = useRuneStore()

</script>

<template>
  <div class="mainContent">
    <rune-header :store-rune="storeRune" />
    <rune-main :store-rune="storeRune"/>
  </div>
</template>

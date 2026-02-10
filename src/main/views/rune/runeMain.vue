<script setup lang="ts">
import { NTabs, NTabPane, NCard } from "naive-ui";
import RuneContent from "./runeContent.vue";
import BlockContent from "./blockContent.vue";
import { Ref, ref, watch } from "vue";
import { Rune } from "./runeTypes";
import { get101Runes } from "./get101Runes";
import { RuneStoreActions, RuneStoreState } from "@/main/views/rune/runeTypes";
import { Store } from "pinia";
import HexContent from "@/main/views/rune/hexContent.vue";
import BlockHexContent from "@/main/views/rune/blockHexContent.vue";

const { storeRune } = defineProps<{
	storeRune: Store<"useRuneStore", RuneStoreState, {}, RuneStoreActions>;
}>();

const rune101List: Ref<Rune[]> = ref([]);

watch(
	() => storeRune.currentChamp,
	async (champId: number) => {
		if (champId === 0) {
			return;
		}
		rune101List.value = await get101Runes(champId);
	},
	{ immediate: true },
);
</script>

<template>
	<n-card
		class="shadow"
		size="small"
		content-style="padding-top:2px;padding-left:0px;padding-right:0px;"
		style="height: 517px"
	>
		<n-tabs
			class="mt-2.5"
			type="segment"
			animated
			justify-content="space-between"
			v-if="storeRune.hexAugments === null"
		>
			<n-tab-pane name="tab1" tab="推荐符文">
				<rune-content :rune-list="storeRune.runeDataList" />
			</n-tab-pane>
			<n-tab-pane name="tab2" tab="官方符文">
				<rune-content :rune-list="rune101List" />
			</n-tab-pane>
			<n-tab-pane name="tab3" tab="装备方案">
				<block-content />
			</n-tab-pane>
		</n-tabs>

		<!--      海克斯数据-->
		<n-tabs
			class="mt-2.5"
			type="segment"
			animated
			justify-content="space-between"
			v-else
		>
			<n-tab-pane name="tab1" tab="棱彩">
				<hex-content
					:scroll-height="'442px'"
					:hex-info-list="storeRune.hexAugments.prism"
				/>
			</n-tab-pane>
			<n-tab-pane name="tab2" tab="黄金">
				<hex-content
					:scroll-height="'442px'"
					:hex-info-list="storeRune.hexAugments.gold"
				/>
			</n-tab-pane>
			<n-tab-pane name="tab3" tab="白银">
				<hex-content
					:scroll-height="'442px'"
					:hex-info-list="storeRune.hexAugments.sliver"
				/>
			</n-tab-pane>
			<n-tab-pane name="tab4" tab="装备">
				<block-hex-content :items="storeRune.hexItemList" />
			</n-tab-pane>
		</n-tabs>
	</n-card>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-nav) {
	padding: 0 12px !important;
}
</style>

<script setup lang="ts">
import { NTabs, NTabPane, NCard } from "naive-ui";
import HexContent from "@/main/views/rune/hexContent.vue";
import { HexInfoTypes } from "@/main/views/rune/runeTypes";
import BlockHexContent from "@/main/views/rune/blockHexContent.vue";

const { hexInfo } = defineProps<{
	hexInfo: HexInfoTypes | null;
}>();
</script>

<template>
	<div class="flex-1" v-if="hexInfo">
		<n-card
			class="shadow"
			size="small"
			content-style="padding:0px"
			style="height: 100%"
		>
			<!--      海克斯数据-->
			<n-tabs
				class="mt-3"
				type="segment"
				animated
				justify-content="space-between"
			>
				<n-tab-pane name="tab1" tab="棱彩">
					<hex-content
						:scroll-height="'382px'"
						:hex-info-list="hexInfo.augments.prism"
					/>
				</n-tab-pane>
				<n-tab-pane name="tab2" tab="黄金">
					<hex-content
						:scroll-height="'382px'"
						:hex-info-list="hexInfo.augments.gold"
					/>
				</n-tab-pane>
				<n-tab-pane name="tab3" tab="白银">
					<hex-content
						:scroll-height="'382px'"
						:hex-info-list="hexInfo.augments.sliver"
					/>
				</n-tab-pane>
				<n-tab-pane name="tab4" tab="装备">
					<block-hex-content :items="hexInfo.items" />
				</n-tab-pane>
			</n-tabs>
		</n-card>
	</div>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-nav) {
	padding: 0 12px !important;
}
</style>

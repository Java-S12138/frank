<script setup lang="ts">
import { NTabs, NTabPane, NCard } from "naive-ui";
import HexContent from "@/main/views/rune/hexContent.vue";
import { ref, onMounted } from "vue";
import { HexInfoTypes } from "@/main/views/rune/runeTypes";
import { requestFetch } from "@/main/utils/request";

const { alias } = defineProps<{
	alias: string;
}>();

const hexInfo = ref<null | HexInfoTypes>(null);

onMounted(async () => {
	const date = new Date(new Date().toDateString()).getTime();
	const baseUrl = "https://frank-1304009809.cos.ap-chongqing.myqcloud.com";
	const res = await requestFetch<HexInfoTypes | null>(
		`${baseUrl}/hex/${alias}.json?date=${date}`,
		"GET",
	);
	if (res === null) return;
	hexInfo.value = res;
});
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
						:scroll-height="'315px'"
						:hex-info-list="hexInfo.augments.prism"
					/>
				</n-tab-pane>
				<n-tab-pane name="tab2" tab="黄金">
					<hex-content
						:scroll-height="'315px'"
						:hex-info-list="hexInfo.augments.gold"
					/>
				</n-tab-pane>
				<n-tab-pane name="tab3" tab="白银">
					<hex-content
						:scroll-height="'315px'"
						:hex-info-list="hexInfo.augments.sliver"
					/>
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

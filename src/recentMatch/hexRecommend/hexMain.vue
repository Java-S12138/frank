<script setup lang="ts">
import Dashboard from "@/recentMatch/hexRecommend/components/dashboard.vue";
import HexContent from "@/recentMatch/hexRecommend/components/hexContent.vue";
import { HexInfoTypes } from "@/main/views/rune/runeTypes";

const { minWindow, hexInfo, alias, title, champName } = defineProps<{
	minWindow: () => void;
	hexInfo: HexInfoTypes;
	alias: string;
	title: string;
	champName: string;
}>();
</script>

<template>
	<div
		style="border-radius: 0.5rem"
		class="main flex flex-col bg-neutral-100 justify-between gap-3 dark:bg-neutral-900"
	>
		<Dashboard
			:alias="alias"
			:title="title"
			:champName="champName"
			:minWindow="minWindow"
			:champLv="hexInfo.champLv"
		/>
		<HexContent :hex-info="hexInfo" />
	</div>
</template>

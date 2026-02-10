<script setup lang="ts">
import { NCard, NButton, NIcon, NAvatar, NTag } from "naive-ui";
import { InfoCircle, CircleMinus } from "@vicons/tabler";
import GlassModal from "@/recentMatch/hexRecommend/components/glassModal.vue";
import { ref } from "vue";

interface SVGMap {
	[key: string]: string;
}

const { alias, champName, title, minWindow, champLv } = defineProps<{
	alias: string;
	champName: string;
	title: string;
	minWindow: () => void;
	champLv: string;
}>();

const SVGLevel: SVGMap = {
	T1: new URL("@/assets/tLevel/t1.svg", import.meta.url).href,
	T2: new URL("@/assets/tLevel/t2.svg", import.meta.url).href,
	T3: new URL("@/assets/tLevel/t3.svg", import.meta.url).href,
	T4: new URL("@/assets/tLevel/t4.svg", import.meta.url).href,
	T5: new URL("@/assets/tLevel/t5.svg", import.meta.url).href,
};

const TagColor: { [key: string]: { color: string; background: string } } = {
	T1: {
		color: "#0093ff",
		background: "#0093ff1A",
	},
	T2: {
		color: "#00bba3",
		background: "#00bba31A",
	},
	T3: {
		color: "#f0a020",
		background: "#f0a0201A",
	},
	T4: {
		color: "#9aa4af",
		background: "#9aa4af1A",
	},
	T5: {
		color: "#a88a67",
		background: "#a88a671A",
	},
};

const isModalOpen = ref(false);

const handleConfirm = () => {
	isModalOpen.value = false;
};
</script>

<template>
	<div data-tauri-drag-region class="dragDiv"></div>
	<div>
		<n-card size="small" class="shadow" content-style="">
			<div class="flex items-center">
				<img
					style="width: 50px; height: auto; border-radius: 50%"
					:src="`https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png`"
				/>
				<div class="ml-3 flex h-[50px] justify-between flex-col">
					<!-- <n-gradient-text
						class="relative overflow-hidden bg-[linear-gradient(139deg,#FF9BD2_0%,#6B42DC_49.5%,#54ACEE_100%)] after:content-[''] after:absolute after:top-0 after:left-[-150%] after:w-full after:h-full after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] after:animate-[shine_3s_infinite]"
					>
						海克斯 强化符文
					</n-gradient-text> -->

					<div class="flex items-top gap-2 mt-1">
						<n-avatar
							style="
								background-color: #ffffff00;
								width: 23px;
								height: 23px;
								margin-top: 1px;
							"
							:src="SVGLevel[champLv] || SVGLevel['T2']"
						/>
						<n-tag
							style="height: 24px"
							:bordered="false"
							:color="{
								color: TagColor[champLv].background,
								textColor: TagColor[champLv].color,
								borderColor: TagColor[champLv].background,
							}"
						>
							{{ champName }}·{{ title }}
						</n-tag>
					</div>

					<div class="text-gray-400 text-xs">
						海克斯大乱斗，强化符文推荐
					</div>
				</div>

				<div class="ml-auto">
					<div class="flex flex-col h-[50px] justify-between">
						<n-button @click="minWindow" :focusable="false" text>
							<n-icon size="20">
								<circle-minus />
							</n-icon>
						</n-button>

						<n-button
							@click="isModalOpen = true"
							:focusable="false"
							text
						>
							<n-icon size="20">
								<info-circle />
							</n-icon>
						</n-button>
					</div>
				</div>
			</div>
		</n-card>
		<GlassModal
			:show="isModalOpen"
			@close="isModalOpen = false"
			@confirm="handleConfirm"
		/>
	</div>
</template>

<style>
@keyframes shine {
	0% {
		left: -150%;
	}
	50% {
		left: 150%;
	}
	100% {
		left: 150%;
	}
}
</style>

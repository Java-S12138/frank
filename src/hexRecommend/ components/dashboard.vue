<script setup lang="ts">
import { NCard, NButton, NIcon, NGradientText } from "naive-ui";
import { InfoCircle, ArrowUpCircle, ArrowDownCircle } from "@vicons/tabler";
import GlassModal from "@/hexRecommend/ components/glassModal.vue";
import { ref } from "vue";

const { winHeight, changeWin, alias, champName } = defineProps<{
	changeWin: (toMin: boolean) => void;
	winHeight: number;
	alias: string;
	champName: string;
}>();

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
				<div class="ml-3 flex flex-col">
					<n-gradient-text
						class="relative overflow-hidden bg-[linear-gradient(139deg,#FF9BD2_0%,#6B42DC_49.5%,#54ACEE_100%)] after:content-[''] after:absolute after:top-0 after:left-[-150%] after:w-full after:h-full after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] after:animate-[shine_3s_infinite]"
					>
						{{ champName }}·海克斯
					</n-gradient-text>

					<div class="text-gray-400">lolfrank.cn</div>
				</div>

				<div class="ml-auto">
					<div class="flex flex-col h-[50px] justify-between">
						<n-button
							@click="changeWin(winHeight >= 495 ? true : false)"
							:focusable="false"
							text
						>
							<n-icon size="20">
								<arrow-down-circle v-if="winHeight >= 495" />
								<arrow-up-circle v-else />
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
			title="解锁海克斯强化"
			message="你确定要选择这个海克斯吗？选择后将无法更改本次对局的强化方向。"
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

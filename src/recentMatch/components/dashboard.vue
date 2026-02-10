<script setup lang="ts">
import {
	NCheckbox,
	NTag,
	NIcon,
	NButton,
	NButtonGroup,
	NPopconfirm,
	NDivider,
	NDrawer,
} from "naive-ui";
import {
	ThumbUp,
	ThumbDown,
	Bulb,
	CircleMinus,
	CircleX,
	Refresh,
	ApiApp,
} from "@vicons/tabler";
import { onMounted, reactive, ref, watch } from "vue";
import { ConfigSettingTypes } from "@/background/types";
import { getCurrentWindow } from "@tauri-apps/api/window";
import hexMain from "@/recentMatch/hexRecommend/hexMain.vue";
import { window as tauriWindow } from "@tauri-apps/api";
import { emitTo, once } from "@tauri-apps/api/event";
import { requestFetch } from "@/main/utils/request";
import { HexInfoTypes } from "@/main/views/rune/runeTypes";
import { champDict } from "@/resources/champList";

const { winCount, isFriCount, queueId } = defineProps<{
	winCount: { friend: number[]; enemy: number[] };
	isFriCount: boolean;
	queueId: number;
}>();
const config: ConfigSettingTypes = reactive(
	JSON.parse(<string>localStorage.getItem("configSetting")),
);

const isModalOpen = ref(false);
const isHexDrawerOpen = ref(false);
const curChampId = ref(-1);
const hexInfo = ref<HexInfoTypes | null>(null);

onMounted(() => {
	if (!config.isGameInTips) {
		isModalOpen.value = true;
	}
	window.addEventListener("keydown", handleKeyDown);
});

// 监听 queueId 的变化
watch(
	() => queueId,
	(newVal) => {
		if (newVal === 2400 && curChampId.value === -1) {
			// 向主窗口发送消息
			tauriWindow.Window.getByLabel("mainWindow").then((win) => {
				if (win !== null) {
					emitTo("mainWindow", "cacheMatchList", "getCurChampId");
				}
			});
		}
	},
	{
		immediate: false,
	},
);

// 监听当前英雄ID
once<{ id: number }>("curChampId", async (res) => {
	if (res.payload.id !== -1) {
		curChampId.value = res.payload.id;
		const date = new Date(new Date().toDateString()).getTime();
		const baseUrl =
			"https://frank-1304009809.cos.ap-chongqing.myqcloud.com";
		const resInfo = await requestFetch<HexInfoTypes | null>(
			`${baseUrl}/hex/${champDict[res.payload.id].alias}.json?date=${date}`,
			"GET",
		);
		if (resInfo === null) return;
		hexInfo.value = resInfo;
		isHexDrawerOpen.value = true;
	}
});

const handleMin = async () => {
	await getCurrentWindow().hide();
};

const handleKeyDown = (event: any) => {
	if (event.key === "Tab" && event.shiftKey) {
		handleMin();
	}
};
const handleClose = async () => {
	await getCurrentWindow().close();
};

const closeModalOutside = (event: any) => {
	// Check if the clicked element is outside the modal
	if (!event.target.closest(".bg-white")) {
		isModalOpen.value = false;
	}
};

const refresh = () => {
	window.location.reload();
};

const changeConfig = () => {
	localStorage.setItem("configSetting", JSON.stringify(config));
};
</script>

<template>
	<header class="flex w-full h-10 relative">
		<div data-tauri-drag-region class="dragDiv"></div>
		<div class="flex w-1/2 gap-x-4">
			<img src="@/assets/icon/siteLogo.png" draggable="false" />
			<div class="flex">
				<div class="flex flex-col gap-y-0.5 mr-4">
					<text class="text-gray-400 text-xs">友方胜利次数</text>
					<n-tag
						:bordered="false"
						:type="isFriCount ? 'success' : 'error'"
						style="justify-content: center; width: 72px"
					>
						<template #icon>
							<n-icon
								:size="15"
								:component="isFriCount ? ThumbUp : ThumbDown"
							/>
						</template>
						{{ winCount.friend[0] }}/{{ winCount.friend[1] }}
					</n-tag>
				</div>
				<div class="flex flex-col gap-y-0.5">
					<text class="text-gray-400 text-xs">敌方胜利次数</text>
					<n-tag
						:bordered="false"
						:type="!isFriCount ? 'success' : 'error'"
						style="justify-content: center; width: 72px"
					>
						<template #icon>
							<n-icon
								:size="15"
								:component="!isFriCount ? ThumbUp : ThumbDown"
							/>
						</template>
						{{ winCount.enemy[0] }}/{{ winCount.enemy[1] }}
					</n-tag>
				</div>
				<n-tag
					class="h-10 ml-4"
					style="cursor: default !important"
					:bordered="false"
					type="default"
					:disabled="true"
				>
					显示•隐藏&nbsp;&nbsp;&nbsp;&nbsp;Shift + Tab
				</n-tag>
			</div>
		</div>

		<div class="flex w-1/2 justify-end gap-x-8">
			<n-tag
				class="h-10"
				style="cursor: default !important"
				:bordered="false"
				type="default"
				:disabled="true"
			>
				对局中显示, 请将游戏窗口设置成【无边框】
			</n-tag>
			<n-button-group size="large">
				<n-button
					:focusable="false"
					@click="isModalOpen = true"
					style="padding: 12px"
					type="default"
				>
					<template #icon>
						<N-icon :size="20" :component="Bulb" />
					</template>
				</n-button>
				<n-button
					:focusable="false"
					@click="refresh"
					style="padding: 12px"
					type="default"
					v-if="queueId !== 2400"
				>
					<template #icon>
						<N-icon :size="20" :component="Refresh" />
					</template>
				</n-button>

				<n-button
					:focusable="false"
					@click="isHexDrawerOpen = true"
					class="bg-[linear-gradient(139deg,#FF9BD2_0%,#6B42DC_49.5%,#54ACEE_100%)]"
					style="padding: 12px"
					type="default"
					v-else
				>
					<template #icon>
						<N-icon
							color="#FFFFFF"
							:size="20"
							:component="ApiApp"
						/>
					</template>
				</n-button>

				<n-button
					@click="handleMin"
					style="padding: 12px"
					type="default"
				>
					<template #icon>
						<N-icon :size="20" :component="CircleMinus" />
					</template>
				</n-button>
				<n-popconfirm @positive-click="handleClose" :show-icon="false">
					<template #trigger>
						<n-button style="padding: 12px" type="default">
							<template #icon>
								<N-icon :size="20" :component="CircleX" />
							</template>
						</n-button>
					</template>
					关闭此窗口 o.O?
				</n-popconfirm>
			</n-button-group>
		</div>
	</header>

	<!-- Modal -->
	<div
		v-if="isModalOpen"
		@click="closeModalOutside"
		class="fixed inset-0 bg-neutral-950 bg-opacity-40 flex items-center justify-center z-50"
	>
		<div
			class="bg-white text-neutral-900 px-6 py-4 rounded shadow-md dark:bg-neutral-900 dark:text-neutral-200"
		>
			<!-- Modal content goes here -->
			<text class="text-xl">Tips</text>
			<p class="my-1 text-red-500">
				0：在游戏中显示，请将游戏窗口模式设置成【无边框】
			</p>
			<p class="my-1">1：Score：英雄熟练度分数, 右上角：英雄熟练度等级</p>
			<p class="my-1">2：段位下方的标签颜色相同时，代表：【开黑玩家】</p>
			<p class="my-1">3：游戏模式为单双 / 灵活排位时，只显示排位数据</p>
			<p class="my-1">4：标签含义 【S : 小代】【A : 绝活】【B : 熟练】</p>
			<p class="my-1">5：点击下方战绩标签，即可查看此局详细数据</p>
			<p class="my-1">6：点击英雄头像，可查看此英雄的技能信息</p>

			<n-divider style="margin: 22px 0 20px 0" />

			<div class="mt-2 flex items-center justify-between">
				<p class="m-0">
					<n-checkbox
						v-model:checked="config.isGameInTips"
						@update:checked="changeConfig"
					>
						<text class="text-gray-400">不再自动弹出</text>
					</n-checkbox>
				</p>
			</div>
		</div>
	</div>

	<!-- 海克斯推荐 -->
	<n-drawer
		style="border-radius: 0.5rem"
		v-model:show="isHexDrawerOpen"
		placement="right"
		width="320px"
		:auto-focus="false"
	>
		<hex-main
			v-if="queueId === 2400 && hexInfo != null"
			:alias="champDict[curChampId].alias"
			:champName="champDict[curChampId].label"
			:title="champDict[curChampId].title"
			:hexInfo="hexInfo"
			:minWindow="() => (isHexDrawerOpen = false)"
		/>
	</n-drawer>
</template>

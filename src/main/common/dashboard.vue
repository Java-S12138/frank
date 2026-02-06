<script setup lang="ts">
import { NIcon, NButton, NPopconfirm, NDrawer } from "naive-ui";
import { CircleMinus, Settings, CircleX, Bulb } from "@vicons/tabler";
import { onMounted, ref } from "vue";
import Setting from "@/main/common/setting.vue";
import { Notice } from "@/main/utils/notice";
import { exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
	HexRecommend,
	RecentMatchWindow,
} from "@/background/utils/creatWindow";

const notice = new Notice();
const isShowDrawer = ref(false);
const isShowNoticeIcon = ref(false);

onMounted(() => {
	notice.init().then((v) => {
		if (v) {
			isShowNoticeIcon.value = true;
		}
	});
});

const handleMin = async () => {
	await getCurrentWindow().minimize();
};

const handleClose = async () => {
	await exit(1);
};

const showDialog = () => {
	notice.showDialog();
};

const test = () => {
	new HexRecommend();
};
</script>

<template>
	<header class="flex justify-between items-center h-8 mb-2 relative">
		<div data-tauri-drag-region class="dragDiv"></div>
		<div class="flex items-center">
			<img
				src="../../assets/icon/app-icon.png"
				class="h-8"
				draggable="false"
			/>
			<img
				src="../../assets/icon/Frank.png"
				draggable="false"
				class="pl-1 h-[25px]"
			/>
		</div>
		<div class="flex mt-0.5 gap-x-2">
			<n-button :focusable="false" @click="test" text>
				<n-icon size="20" :color="'#f0a020'">
					<bulb />
				</n-icon>
			</n-button>

			<n-button
				v-if="isShowNoticeIcon"
				:focusable="false"
				@click="showDialog"
				text
			>
				<n-icon size="20" :color="'#f0a020'">
					<bulb />
				</n-icon>
			</n-button>
			<n-button :focusable="false" @click="handleMin" text>
				<n-icon size="20">
					<circle-minus />
				</n-icon>
			</n-button>
			<n-button
				:focusable="false"
				text
				circle
				@click="isShowDrawer = true"
			>
				<n-icon size="20">
					<settings />
				</n-icon>
			</n-button>
			<n-popconfirm @positive-click="handleClose" :show-icon="false">
				<template #trigger>
					<n-button text circle>
						<n-icon size="20">
							<circle-x />
						</n-icon>
					</n-button>
				</template>
				是否退出 Frank?
			</n-popconfirm>
		</div>
	</header>

	<n-drawer
		style="border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem"
		v-model:show="isShowDrawer"
		:placement="'bottom'"
		:auto-focus="false"
		height="473"
	>
		<setting />
	</n-drawer>
</template>

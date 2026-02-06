<script setup lang="ts">
import Dashboard from "@/hexRecommend/ components/dashboard.vue";
import HexContent from "@/hexRecommend/ components/hexContent.vue";
import { ref, onMounted, onUnmounted } from "vue";
import {
	getCurrentWindow,
	LogicalSize,
	LogicalPosition,
	currentMonitor,
} from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { listen, emitTo, once } from "@tauri-apps/api/event";
import { window as tauriWindow } from "@tauri-apps/api";
import { champDict } from "@/resources/champList";

const winHeight = ref(window.outerHeight);
const curChampId = ref(-1);
const appWindow = getCurrentWindow();

onMounted(async () => {
	// 向主窗口发送消息
	tauriWindow.Window.getByLabel("mainWindow").then((win) => {
		if (win !== null) {
			emitTo("mainWindow", "cacheMatchList", "getCurChampId");
		}
	});

	await invoke("start_hex_game_polling");
});
onUnmounted(async () => await invoke("stop_hex_game_polling"));

// 监听当前英雄ID
once<{ id: number }>("curChampId", (res) => {
	curChampId.value = res.payload.id;
});

let conut = 0;

// 监听数据
listen<number>("game-update", (event) => {
	if (event.payload === 1 && conut === 0) {
		appWindow.show();
		conut = 1;
	} else {
		changeWin(true);
		appWindow.show();
	}
});

const changeWin = async (toMin: boolean) => {
	// 1. 确定目标高度
	const targetHeight = toMin ? 92 : 495;
	const targetWidth = 320;

	// 2. 获取显示器信息以重新计算位置
	const monitor = await currentMonitor();

	if (monitor) {
		// 获取屏幕可用区域的逻辑高度（已排除任务栏）
		const scaleFactor = monitor.scaleFactor;
		const screenHeight = monitor.size.height / scaleFactor;

		// 3. 计算新的 Y 坐标：屏幕总高度 - 目标窗口高度
		// 如果 x=0 有间隙，可以将 x 设为 -1
		const newX = -8;
		const newY = screenHeight - targetHeight - 2;

		// 4. 执行变更
		// 建议先设置尺寸，后设置位置，或者两者紧随其后以减少视觉闪烁
		await appWindow.setSize(new LogicalSize(targetWidth, targetHeight));
		await appWindow.setPosition(new LogicalPosition(newX, newY));

		// 5. 更新状态变量
		winHeight.value = targetHeight;
	}
};
</script>

<template>
	<div
		v-if="curChampId !== -1"
		class="main flex flex-col-reverse bg-neutral-100 justify-between gap-3 dark:bg-neutral-900"
	>
		<Dashboard
			:alias="champDict[curChampId].alias"
			:champName="champDict[curChampId].label"
			:winHeight="winHeight"
			:changeWin="changeWin"
		/>
		<HexContent
			v-show="winHeight >= 495"
			:alias="champDict[curChampId].alias"
		/>
	</div>
</template>

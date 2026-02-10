<script setup lang="ts">
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import FloatingPrompt from "./FloatingPrompt.vue";
import { useMessage } from "naive-ui";

const modeId = ref<number>(-2); // -2:init -1:not found file 0:full 1:windowed 2:borderless
const isVisible = ref(false);
let configPath = "";

const message = useMessage();

onMounted(async () => {
	const path = localStorage.getItem("clientPath");
	if (path != null) {
		// 配置文件路径
		configPath = path.replace("TCLS\\client.exe", "Game\\Config\\game.cfg");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		invoke<number>("check_borderless_mode", { configPath: configPath })
			.then((mode) => {
				modeId.value = mode;
				if (mode === 0) {
					isVisible.value = true;
				}
			})
			.catch(() => {
				modeId.value = -1;
			});
	}
});

const handleConfirm = () => {
	invoke("set_borderless_mode", { configPath: configPath })
		.then(() => {
			message.success("应用成功, 祝你游戏连胜!");
		})
		.catch((error) => {
			message.error(error);
		});
	isVisible.value = false;
};
</script>

<template>
	<FloatingPrompt
		:show="isVisible"
		title="窗口设置"
		@confirm="handleConfirm"
		@cancel="isVisible = false"
	/>
</template>

<script setup>
import { ref } from "vue";
import { NButton } from "naive-ui";

const props = defineProps({
	show: Boolean,
	title: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["confirm", "cancel"]);

const onCancel = () => {
	emit("cancel");
};

const onConfirm = () => {
	emit("confirm");
};
</script>

<template>
	<!-- 使用 Vue 内置 Transition 实现丝滑动画 -->
	<Transition
		enter-active-class="transition duration-300 ease-out"
		enter-from-class="transform translate-y-10 opacity-0"
		enter-to-class="transform translate-y-0 opacity-100"
		leave-active-class="transition duration-200 ease-in"
		leave-from-class="transform translate-y-0 opacity-100"
		leave-to-class="transform translate-y-10 opacity-0"
	>
		<div
			v-if="show"
			class="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
		>
			<!-- 提示框主体：磨砂玻璃效果 + 柔和阴影 -->
			<div
				class="pointer-events-auto w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-3"
			>
				<div class="flex items-start gap-4">
					<!-- 图标装饰 (可选) -->
					<div
						class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>

					<div class="flex-1">
						<p class="text-sm text-gray-900 dark:text-white my-2.5">
							{{ title }}
						</p>
						<p
							class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
						>
							软件检测到当前游戏设置选项中, <br />
							[ 游戏窗口 ] = [ 全屏 ] <br />
							<br />
							这将导致 Frank 显示游戏内窗口时出现异常,
							进而影响你的游戏体验。 <br />
							建议将其修改为 [窗口] 或者 [无边框] <br />
							<br />
							点击下方 [ 确定 ] 按钮,
							可切换为无边框模式，这与全屏模式类似。
						</p>
					</div>
				</div>

				<!-- 按钮区域 -->
				<div class="flex items-center justify-end gap-3">
					<n-button @click="onCancel"> 取消 </n-button>
					<n-button @click="onConfirm" type="info"> 确定 </n-button>
				</div>
			</div>
		</div>
	</Transition>
</template>

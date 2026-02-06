<script setup>
const props = defineProps({
	show: Boolean,
	title: String,
	message: String,
});
const emit = defineEmits(["confirm", "close"]);
</script>

<template>
	<Transition name="modal-smooth">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			<div
				class="absolute inset-0 bg-slate-950/30"
				@click="emit('close')"
			></div>

			<div
				class="relative w-full max-w-sm transform-gpu will-change-transform"
			>
				<div
					class="absolute inset-0 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-2xl"
				></div>

				<div
					class="relative z-10 p-6 text-slate-900 dark:text-slate-100"
				>
					<h3 class="text-xl font-bold mb-2">{{ title }}</h3>
					<p class="text-slate-600 dark:text-slate-300 mb-6">
						{{ message }}
					</p>

					<div class="flex gap-3">
						<button
							@click="emit('close')"
							class="flex-1 px-4 py-2 rounded-xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 transition-colors"
						>
							不再弹出
						</button>
						<button
							@click="emit('confirm')"
							class="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
						>
							我已知晓
						</button>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.modal-smooth-enter-active,
.modal-smooth-leave-active {
	transition:
		opacity 0.2s ease-out,
		transform 0.25s cubic-bezier(0, 0, 0.2, 1);
	backface-visibility: hidden;
	perspective: 1000px;
}

.modal-smooth-enter-from,
.modal-smooth-leave-to {
	opacity: 0;
	transform: scale(0.95) translateY(10px);
}

.backdrop-blur-md {
	-webkit-backdrop-filter: blur(12px);
	backdrop-filter: blur(12px);
}
</style>

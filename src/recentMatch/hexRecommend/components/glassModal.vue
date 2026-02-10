<script setup>
const props = defineProps({
	show: Boolean,
});
const emit = defineEmits(["close"]);
</script>

<template>
	<div
		v-if="show"
		@click="emit('close')"
		class="fixed inset-0 bg-neutral-950 bg-opacity-40 flex items-center justify-center z-50"
	>
		<div
			class="bg-white text-neutral-900 px-6 py-4 rounded shadow-md dark:bg-neutral-900 dark:text-neutral-200"
		>
			<!-- Modal content goes here -->
			<text class="text-xl">Tips</text>
			<p class="my-1">数据来源 [OP.GG], 仅供参考。</p>
		</div>
	</div>
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

<template>
    <div class="relative rounded-lg bg-gray-100 dark:bg-[#303033] p-1">
        <!-- 滑块 -->
        <div
            class="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-md bg-white dark:bg-[#454548] shadow-sm transition-all duration-300"
            :style="sliderStyle"
        />

        <!-- 按钮 -->
        <n-button
            v-for="(item, index) in options"
            :key="item"
            ghost
            :bordered="false"
            size="small"
            class="relative z-10 min-w-[59.2px]"
            :type="modelValue === index ? 'default' : 'tertiary'"
            :focusable="false"
            @click="select(index)"
        >
            {{ item }}
        </n-button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";

const ITEM_WIDTH = 59.2; // 必须和 min-w 对齐

const props = defineProps<{
    options: string[];
    modelValue: number;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
}>();

const select = (index: number) => {
    emit("update:modelValue", index);
};

const sliderStyle = computed(() => ({
    width: `${ITEM_WIDTH}px`,
    transform: `translateX(${props.modelValue * ITEM_WIDTH}px)`,
}));
</script>

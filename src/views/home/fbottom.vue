<template>
    <div class="mainCard">
        <n-card class="boxShadow" size="small">
            <n-space justify="center">
                <n-space :size="[30]" justify="center" style="margin-top: 10px;margin-bottom: 0px">
                    <n-button text>
                        <n-popover trigger="hover" :show-arrow="false" >
                            <template #trigger>
                                <n-icon size="20" @click="openGithub">
                                    <BrandGithub></BrandGithub>
                                </n-icon>
                            </template>
                            <span>Github 点亮✨吧 !</span>
                        </n-popover>
                    </n-button>
                    <n-button text>
                        <n-popover trigger="hover" :show-arrow="false" >
                            <template #trigger>
                                <n-icon size="20" @click="openSyjun">
                                    <Code></Code>
                                </n-icon>
                            </template>
                            <span>来我的个人网站喝杯茶吧🍺 !</span>
                        </n-popover>
                    </n-button>
                    <n-button text>
                        <n-popover trigger="hover" :show-arrow="false" >
                            <template #trigger>
                                <n-icon size="20" @click="openFrank">
                                    <Help></Help>
                                </n-icon>
                            </template>
                            <span>Frank使用手册大全🐣</span>
                        </n-popover>
                    </n-button>
                    <n-button text v-if="showPopover">
                        <n-popover  trigger="hover" :show-arrow="false">
                            <template #trigger>
                                <n-icon size="20" @click="openUpdate"
                                        color="green">
                                    <ArrowUpCircle></ArrowUpCircle>
                                </n-icon>
                            </template>
                            <span>软件有新的版本🔔</span>
                        </n-popover>
                    </n-button>
                    <n-button text v-else>
                        <n-popover  trigger="hover" :show-arrow="false">
                            <template #trigger>
                                <n-icon size="20">
                                    <ArrowUpCircle></ArrowUpCircle>
                                </n-icon>
                            </template>
                            <span>Frank当前版本V {{frankVersion}}</span>
                        </n-popover>
                    </n-button>
                </n-space>
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import {NCard, NSpace,NButton,NIcon,NPopover} from 'naive-ui'
import {BrandGithub,Help,Code,ArrowUpCircle} from '@vicons/tabler'
import {ref,onMounted} from "vue";
import {request} from "../../../utils/request";
import {useStore} from "../../store";
import {storeToRefs} from "pinia/dist/pinia";

const showPopover = ref(false)
const store = useStore()
const {frankVersion} = storeToRefs(store)

// 检查版本更新
onMounted(async () => {
    const onLineFrankVersion = (await request({
        url:'https://unpkg.com/@java_s/op.gg/package.json'
    })).data.frankVersion
    if (frankVersion.value != onLineFrankVersion){
        showPopover.value = true
    }
})
const openUpdate = () => {
    window.electron.openExternal('https://www.yuque.com/java-s/frank/update')
    showPopover.value = false
}

const openGithub = () => {
    window.electron.openExternal('https://github.com/java-S12138/frank')
}
const openSyjun = () => {
    window.electron.openExternal('https://syjun.vip')
}
const openFrank = () => {
    window.electron.openExternal('https://www.yuque.com/java-s/frank')
}

</script>

<style scoped>
.mainCard {
    display: flex;
    flex-direction: column;
    margin-top: 37px;
    margin-left: 20px;
    margin-right: 20px;
}

.n-card {
    border-radius: 10px;
    padding: 5px;
}

</style>
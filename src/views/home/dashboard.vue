<template>
    <header v-mouse-drag = "handldDrge" class="frankTitle">
        <n-space class="frankTitle">
            <img src="../../assets/icon/app-icon.png" alt="" width="40" @click="handleMin" v-if="isConnectSuccess !=''">
            <img src="../../assets/icon/app-icon-bw.png" alt="" width="40" @click="handleMin" v-else>
            <img src="../../assets/icon/Frank.png" style="margin-top: 4px">
        </n-space>

        <n-space class="rightCorner">
            <n-popover :show-arrow="false" trigger="hover" :delay="1000">
                <template #trigger>
                    <n-button
                        text
                        @click="handleMinimize" color="black">
                        <n-icon size="25">
                            <chevrons-down-right/>
                        </n-icon>
                    </n-button>
                </template>
                最小化
            </n-popover>
            <n-popover :show-arrow="false" trigger="hover" :delay="1000">
                <template #trigger>
                    <n-button text circle color="black" @click="toSettingPage">
                        <n-icon size="24">
                            <settings/>
                        </n-icon>
                    </n-button>
                </template>
                设置
            </n-popover>
            <n-popover :show-arrow="false" trigger="hover" :delay="1000">
                <template #trigger>
                    <n-button text circle @click="handleClose" color="black">
                        <n-icon size="24">
                            <circle-x/>
                        </n-icon>
                    </n-button>
                </template>
                退出
            </n-popover>

        </n-space>
    </header>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover} from 'naive-ui';
// @ts-ignore
import {ChevronsDownRight, Settings, CircleX} from '@vicons/tabler';
import {useStore} from "../../store";
import {ref} from "vue";


const store = useStore()
const isConnectSuccess = ref(window.appConfig.get('credentials.port'))
const toSettingPage = () => {
    store.pageIncrease()
}

const handldDrge = (pos:any) =>{

    window.electron.send('move-main',{
        x:pos.x,
        y:pos.y,
        isWindow:'home'
    })
}

const handleMinimize = () =>{
    window.electron.send('mainwin-minimize')
}

const handleMin = () =>{
    window.electron.send('mainwin-min')
}

const handleClose = () =>{
    window.electron.send('mainwin-close')
}

window.electron.once('client-connect-success',()  => {
    isConnectSuccess.value = true
})

</script>

<style scoped>
header {
    display: flex;
    height: 50px;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 16px;
    margin-left: 16px;
    margin-bottom: 10px;
}

.rightCorner {
    padding-top: 8px;
    margin-right: 3px;
}

.frankTitle {
    align-items: center
}
</style>
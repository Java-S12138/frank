<template>
    <div class="mainCard">
        <n-card class="boxShadow">
            <n-space vertical :size="[2,20]">
                <!--        是否推荐frank-->
                <n-space>
                    <n-tag :bordered="false">是否推荐</n-tag>
                    <n-space justify="space-between" style="width: 214px">
                        <n-tag :bordered="false" style="width: 140px;">聊天界面推荐Frank</n-tag>
                        <n-switch v-model:value="isRecommend" @click="changeRecommend"
                                  style="margin-left:22px;margin-top: 3px"/>
                    </n-space>
                </n-space>
                <n-space>
                    <n-tag :bordered="false">秒选英雄</n-tag>
                    <n-select
                        v-model:value="pickChampion"
                        filterable
                        :disabled="!isAutoPick"
                        size="small"
                        placeholder="选择英雄"
                        :options="optionsChampionPick"
                        @update:value="handleUpdatePick"
                        style="width: 140px"
                    />
                    <n-switch v-model:value="isAutoPick" @click="changePick"
                              style="margin-left:22px;margin-top: 3px"/>
                </n-space>
                <n-space>
                    <n-tag :bordered="false">秒禁英雄</n-tag>
                    <n-select
                        v-model:value="banChampion"
                        filterable
                        :disabled="!isAutoBan"
                        size="small"
                        placeholder="选择英雄"
                        :options="optionsChampionBan"
                        @update:value="handleUpdateBan"
                        style="width: 140px"
                    />
                    <n-switch v-model:value="isAutoBan" @click="changeBan"
                              style="margin-left:22px;margin-top: 3px"/>
                </n-space>
                <n-space>
                    <n-tag :bordered="false">秒接对局</n-tag>
                    <n-slider v-model:value="isAccept" :step="10" @update:value="handleUpdateAccept"
                              style="width: 213px;margin-top: 5px"/>
                </n-space>
                <n-space>
                    <n-tag :bordered="false">默认设置</n-tag>
                    <n-popconfirm
                        @positive-click="toReset"
                        positive-text="确认"
                        negative-text="取消"
                        :show-icon="false"
                    >
                        <template #trigger>
                            <n-button size="small" type="success" style="width: 214px;"
                                      secondary>点击恢复默认设置
                            </n-button>
                        </template>
                        一切都将一去杳然
                    </n-popconfirm>
                </n-space>
                <n-space class="alignCent">
                    <n-tag :bordered="false">运行文件</n-tag>

                    <n-popover trigger="hover" v-if="!isExist">
                        <template #trigger>
                            <n-button size="small" type="success"
                                      dashed @click="getGameDirectory" style="width: 214px">
                                <input type="file" id="file" hidden>
                                选择LOL启动文件 Client.exe
                            </n-button>
                        </template>
                        <span>例如 C:\LOL\英雄联盟\TCLS\Client.exe</span>
                    </n-popover>

                    <n-popover trigger="hover" v-else>
                        <template #trigger>
                            <n-tag  :bordered="false" type="success" @click="getGameDirectory" >
                                <input type="file" id="file" hidden>
                                <n-ellipsis style="max-width: 200px" :tooltip="false">
                                    {{ directory }}
                                </n-ellipsis>
                            </n-tag>
                        </template>
                        <span>再次点击可重新设置</span>
                    </n-popover>

                </n-space>
                <n-space>
                    <n-tag :bordered="false">回到首页</n-tag>
                    <n-button size="small" type="success" style="width: 214px;"
                              secondary @click="toHomePage">因为热爱 所以联盟 BY: Java_S
                    </n-button>
                </n-space>
            </n-space>
        </n-card>

    </div>
</template>

<script setup lang="ts">
import {
    NCard, NSpace, NTag, NButton, NEllipsis,NPopover,
    NSelect, NSwitch, NSlider, useMessage,NPopconfirm
} from 'naive-ui'
import {optionsChampion} from '../../../utils/lolData'
import {ref} from "vue";
import {useStore} from "../../store";

const isExist = ref(false)
let directory = ref('')
const store = useStore()
const isAutoPick = ref(window.appConfig.get('autoPickChampion.isAuto'))
const isRecommend = ref(window.appConfig.get('isRecommend'))
const pickChampion = ref(window.appConfig.get('autoPickChampion.championId'))
const optionsChampionPick = optionsChampion
const isAutoBan = ref(window.appConfig.get('autoBanChampion.isAuto'))
const banChampion = ref(window.appConfig.get('autoBanChampion.championId'))
const optionsChampionBan = optionsChampion
const isAccept = ref(window.appConfig.get('autoAccept'))
const message = useMessage()

// 判断是否已经获取路径
if (window.appConfig.get('gameDirectory') != '') {
    isExist.value = true
    directory.value = window.appConfig.get('gameDirectory')
}
// 获取英雄联盟客户端安装路径
const getGameDirectory = () => {
    const fu:any = document.getElementById('file')
    fu.click()
    fu.addEventListener('change', (event:any) => {
        const files = event.target.files[0].path
        window.appConfig.set('gameDirectory',files)
        directory.value = files
        isExist.value = true
    })
}

// 设置是否自动选择英雄
const changePick = () => {
    if (window.appConfig.get('autoPickChampion.isAuto') != true) {
        window.appConfig.set('autoPickChampion.isAuto', true)
    } else {
        window.appConfig.set('autoPickChampion.isAuto', false)
    }
}
// 设置是否向队友推荐frank
const changeRecommend = () => {
    if (window.appConfig.get('isRecommend') != true) {
        window.appConfig.set('isRecommend', true)
    } else {
        window.appConfig.set('isRecommend', false)
    }
}

// 设置是否自动禁用英雄
const changeBan = () => {
    if (window.appConfig.get('autoBanChampion.isAuto') != true) {
        window.appConfig.set('autoBanChampion.isAuto', true)
    } else {
        window.appConfig.set('autoBanChampion.isAuto', false)
    }
}
// 通过选择器选择英雄后, 执行的函数 选择
const handleUpdatePick = () => {
    window.appConfig.set('autoPickChampion.championId', pickChampion.value)
}
// 通过选择器选择英雄后, 执行的函数 禁用
const handleUpdateBan = () => {
    window.appConfig.set('autoBanChampion.championId', banChampion.value)
}
// 是否自动接受对局
const handleUpdateAccept = () => {
    window.appConfig.set('autoAccept', isAccept.value)
}

// 回到首页
const toHomePage = () => {
    store.pageIncrease()
}

// 恢复默认设置
const toReset = async () => {
    message.success('设置已恢复默认, 建议重启Frank')
    window.appConfig.clear()
}

</script>

<style scoped>
.mainCard {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    flex-direction: column;
}

.n-card {
    border-radius: 10px;
    padding: 5px;
}

.alignCent {
    align-items: center;
}
</style>
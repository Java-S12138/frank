<script setup lang="ts">
import {
    NDrawerContent,
    NIcon,
    NButton,
    NTabPane,
    NTabs,
    TabsInst,
} from "naive-ui";
import { CircleX } from "@vicons/tabler";
import SummonerEnd from "@/main/views/record/summonerEnd.vue";
import { SummonerDetailInfo } from "@/queryMatch/utils/MatchDetail";
import { Ref, ref } from "vue";
import AddBlackList from "@/main/views/record/addBlackList.vue";

const { closeDrawer, teamOne, teamTwo, gameId, platformId } = defineProps<{
    closeDrawer: () => void;
    teamOne: SummonerDetailInfo[];
    teamTwo: SummonerDetailInfo[];
    gameId: number;
    platformId: string;
}>();

const tabsInstRef = ref<TabsInst | null>(null);
const valueRef = ref("friend");

const hInfo: Ref<{ name: string; sumId: string; isTeamOne: boolean } | null> =
    ref(null);
const isHaterState = ref(true);

const handleBeforeLeave = (tabName: string) => {
    switch (tabName) {
        case "add":
            return false;
        default:
            return true;
    }
};
const handleAddBlackList = (
    isHater: boolean,
    requiredInfo: { name: string; sumId: string; isTeamOne: boolean },
) => {
    hInfo.value = requiredInfo;
    isHaterState.value = isHater;
    valueRef.value = "add";
};

const backSelectState = (isTeamOne: boolean) => {
    if (isTeamOne) {
        valueRef.value = "friend";
        return;
    }
    valueRef.value = "enemy";
};
</script>

<template>
    <n-drawer-content body-content-style="padding:0 8px">
        <n-button
            class="absolute z-50"
            style="right: 8px; top: 10px"
            @click="closeDrawer"
            :focusable="false"
            text
        >
            <template #icon>
                <n-icon :size="24" :component="CircleX" />
            </template>
        </n-button>
        <n-tabs
            ref="tabsInstRef"
            v-model:value="valueRef"
            tab-style="padding:8px 0px"
            type="line"
            animated
            @before-leave="handleBeforeLeave"
        >
            <n-tab-pane name="friend" tab="友方召唤师">
                <summoner-end
                    :is-team-one="true"
                    :sum-list="teamOne"
                    :addBlackList="handleAddBlackList"
                />
            </n-tab-pane>
            <n-tab-pane name="enemy" tab="敌方召唤师">
                <summoner-end
                    :is-team-one="false"
                    :sum-list="teamTwo"
                    :addBlackList="handleAddBlackList"
                />
            </n-tab-pane>
            <n-tab-pane name="add" tab="新增">
                <add-black-list
                    v-if="hInfo"
                    :is-hater="isHaterState"
                    :h-info="hInfo"
                    :platform-id="platformId"
                    :game-id="gameId"
                    :back-select-state="backSelectState"
                />
            </n-tab-pane>
        </n-tabs>

        <div
            v-if="valueRef !== 'add'"
            style="
                bottom: 22px;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
            "
            class="absolute text-gray-400 text-xs text-center"
        >
            点击拇指图标可标记玩家
        </div>

        <div
            style="
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
            "
            class="absolute text-gray-400 text-xs text-center"
        >
            添加成功后下次遇见将弹出提示
        </div>
    </n-drawer-content>
</template>

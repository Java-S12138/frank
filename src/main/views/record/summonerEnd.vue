2<script setup lang="ts">
import { NPopover, NTag, NIcon } from "naive-ui";
import { ThumbDown, ThumbUp } from "@vicons/tabler";
import { SummonerDetailInfo } from "@/queryMatch/utils/MatchDetail";
import { getIconImg } from "@/queryMatch/utils/tools";
import { BlacklistPlanbTypes } from "@/main/views/record/blackListTypes";
import { QueryMatchWindow } from "@/background/utils/creatWindow.ts";
import MatchSumDetails from "@/queryMatch/common/matchSumDetails.vue";
import { ref, watch, computed } from "vue";
import SegmentedControl from "../../common/SegmentedControl.vue";

const { isTeamOne, sumList, addBlackList } = defineProps<{
    isTeamOne: boolean;
    sumList: SummonerDetailInfo[];
    addBlackList: (
        isHater: boolean,
        requiredInfo: { name: string; sumId: string; isTeamOne: boolean },
    ) => void;
}>();

const titleArr = [
    "totalDamageDealtToChampions",
    "totalDamageTaken",
    "goldEarned",
    "visionScore",
    "totalMinionsKilled",
];

const showMode = ref("totalDamageDealtToChampions");
const active = ref(0);

watch(
    () => active.value,
    (newVal) => {
        showMode.value = titleArr[newVal];
    },
);

const maxValue = computed(() => {
    if (!sumList || sumList.length === 0) return null;
    // @ts-ignore
    return Math.max(...sumList.map((s) => s[showMode.value] || 0));
});

const searchMatch = (summonerId: number) => {
    localStorage.setItem("queSumMatch", String(summonerId) + "-");
    new QueryMatchWindow();
};

const handleAdd = (
    isHater: boolean,
    summonerInfo: SummonerDetailInfo | BlacklistPlanbTypes,
) => {
    const requiredInfo = {
        name: summonerInfo.name,
        sumId: String(summonerInfo.accountId),
        isTeamOne: isTeamOne,
    };
    addBlackList(isHater, requiredInfo);
};
</script>

<template>
    <div>
        <div class="mb-3">
            <SegmentedControl
                v-model="active"
                :options="['输出', '承伤', '金币', '视野', '小兵']"
            />
        </div>

        <div class="flex flex-col gap-[23px] justify-between">
            <!--    每一个英雄数据-->
            <div class="flex flex-col" v-for="summoner in sumList">
                <match-sum-details
                    @click="searchMatch(summoner.accountId)"
                    :item-width="304"
                    :summoner="summoner"
                    :is-one="!isTeamOne"
                />
                <!--        数据显示-->
                <div class="progressDivP mt-3">
                    <n-tag
                        style="
                            height: 26px;
                            width: 50px;
                            justify-content: center;
                        "
                        size="small"
                        :bordered="false"
                        class="text-gray-400"
                        :class="{
                            'max-value': summoner[showMode] === maxValue,
                            'max-value-team2':
                                isTeamOne && summoner[showMode] === maxValue,
                        }"
                    >
                        {{ summoner[showMode] }}
                    </n-tag>
                    <div class="flex-grow flex flex-col h-full justify-between">
                        <div class="matchIconImgDiv">
                            <!--        召唤师技能等-->

                            <div class="flex gap-1 mr-2">
                                <n-icon
                                    @click="handleAdd(false, summoner)"
                                    color="#18A058"
                                    :size="15"
                                    :component="ThumbUp"
                                    style="cursor: pointer"
                                />

                                <n-icon
                                    @click="handleAdd(true, summoner)"
                                    color="#ff6666"
                                    :size="15"
                                    :component="ThumbDown"
                                    style="cursor: pointer"
                                />
                            </div>

                            <n-popover
                                v-for="icon in getIconImg(
                                    summoner.iconList,
                                    summoner.isMvp,
                                    summoner.isWin,
                                )"
                                :show-arrow="false"
                                style="padding: 2px 6px; font-size: 13px"
                                trigger="hover"
                            >
                                <template #trigger>
                                    <img class="matchIconImg" :src="icon[1]" />
                                </template>
                                <span>{{ icon[0] }}</span>
                            </n-popover>
                        </div>
                        <p
                            :style="'width:' + summoner.showDataDict[showMode]"
                            :key="showMode"
                            :class="
                                !isTeamOne
                                    ? 'scale-in-hor-left champAvatarColorRed progressP'
                                    : 'scale-in-hor-left champAvatarColorBlue progressP'
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.matchIconImg {
    height: 12px;
    padding-bottom: 1px;
}
.matchIconImgDiv {
    display: flex;
    align-items: flex-end;
    gap: 5px;
}

.progressP {
    height: 6px;
    border-radius: 1px;
    margin: 0px;
}

.progressDivP {
    width: 304px;
    height: 26px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 12px;
    align-items: flex-end;
    position: relative;
}

.itemClassSecond {
    width: 15px;
    height: 15px;
    border-radius: 2.5px;
}
.champAvatarColorBlue {
    background-color: #66b3ff;
}
.champAvatarColorRed {
    background-color: #ff6666;
}
.scale-in-hor-left {
    animation: scale-in-hor-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes scale-in-hor-left {
    0% {
        transform: scaleX(0);
        transform-origin: 0% 0%;
        opacity: 1;
    }
    100% {
        transform: scaleX(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
}
.max-value {
    /* 队伍1 最高样式 */
    background-color: #ff6666 !important;
    color: white !important;
}

.max-value-team2 {
    /* 队伍2 最高样式 */
    background-color: #60a5fa !important;
    color: white !important;
}
</style>

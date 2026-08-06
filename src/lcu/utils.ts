const isDark = localStorage.getItem("theme") === "dark";

const gameTypeMap: Record<number, string> = {
    420: "单双排位",
    430: "匹配模式",
    440: "灵活排位",
    450: "极地乱斗",
    1700: "斗魂竞技",
    1900: "无限火力",
    2400: "科技乱斗",
    1820: "无尽狂潮",
    1810: "无尽狂潮",
    1830: "无尽狂潮",
    1840: "无尽狂潮",
    4310: "经典模式",
} as const;

const summonerSpellIconMap: Record<number, string> = {
    1: "Summoner_boost.png",
    3: "Summoner_exhaust.png",
    4: "Summoner_flash.png",
    5: "Summoner_Backtrack.png",
    6: "Summoner_haste.png",
    7: "Summoner_heal.png",
    11: "Summoner_smite.png",
    12: "Summoner_Teleport_New.png",
    13: "SummonerMana.png",
    14: "SummonerIgnite.png",
    21: "SummonerBarrier.png",
    30: "Benevolence_Of_King_Poro_Icon.png",
    31: "Trailblazer_Poro_Icon.png",
    32: "Summoner_Mark.png",
    39: "Summoner_Mark.png",
    54: "Summoner_Empty.png",
    55: "Summoner_EmptySmite.png",
    71: "S3_Summoner_Boost.project_jade.png",
    73: "S3_Summoner_Exhaust.project_jade.png",
    74: "S3_Summoner_flash.project_jade.png",
    75: "S3_Summoner_Clairvoyance.project_jade.png",
    76: "S3_Summoner_haste.project_jade.png",
    77: "S3_Summoner_heal.project_jade.png",
    705: "S3_Summoner_fortify.project_jade.png",
    709: "S3_Summoner_rally.project_jade.png",
    711: "S3_Summoner_smite.project_jade.png",
    712: "S3_Summoner_teleport.project_jade.png",
    713: "S3_SummonerMana.project_jade.png",
    714: "S3_SummonerIgnite.project_jade.png",
    716: "S3_Summoner_BattleCry.project_jade.png",
    720: "38.project_jade.png",
    721: "S3_SummonerBarrier.project_jade.png",
    777: "S3_Summoner_revive.project_jade.png",
    2201: "Icon_SummonerSpell_Flee.2v2_Mode_Fighters.png",
    2202: "Summoner_flash.png",
    2203: "Summoner_flash.png",
} as const;

type QueueId = keyof typeof gameTypeMap;

// 英文段位昵称转中文
export const englishToChinese = (tier: string) => {
    switch (tier) {
        case "CHALLENGER":
            return "王者";
        case "GRANDMASTER":
            return "宗师";
        case "MASTER":
            return "大师";
        case "DIAMOND":
            return "钻石";
        case "EMERALD":
            return "翡翠";
        case "PLATINUM":
            return "铂金";
        case "GOLD":
            return "黄金";
        case "SILVER":
            return "白银";
        case "BRONZE":
            return "青铜";
        case "IRON":
            return "黑铁";
        default:
            return "未定级";
    }
};
// 处理段位数据
export const dealDivsion = (divsion: string) => {
    return divsion === "NA" ? "" : divsion;
};

// 根据游戏模式ID判断 游戏模式
export const queryGameType = (queueId: number) => {
    return gameTypeMap[queueId as QueueId] ?? "其它模式";
};
// 判断localStorage是否存在某个值
export const isStoreageHas = (key: string, value: string) => {
    const storeageJson = JSON.parse(String(localStorage.getItem(key)));
    if (storeageJson === null) {
        return false;
    }
    if (value !== "null" && storeageJson[value] === undefined) {
        return false;
    }
    return true;
};

// 通过召唤师id获取召唤师图片地址
export const getspellImgUrl = (spellId: number) => {
    const iconName = summonerSpellIconMap[spellId];
    if (!iconName) {
        return gerNoneImg();
    }
    const baseUrl = iconName.includes("jade")
        ? "https://game.gtimg.cn/images/lol/act/img/jade/summonerspells"
        : "https://game.gtimg.cn/images/lol/act/img/spell";
    return `${baseUrl}/${iconName}`;
};

// 通过物品id获取图片地址
export const getItemImgUrl = (item: number) => {
    if (item === 0 || item === 220013) {
        return gerNoneImg();
    } else {
        return `https://game.gtimg.cn/images/lol/act/img/item/${item}.png`;
    }
};
export const gerNoneImg = () => {
    if (isDark) {
        // @ts-ignore
        return new URL("/src/assets/svg/imageDark.png", import.meta.url).href;
    }
    // @ts-ignore
    return new URL("/src/assets/svg/image.png", import.meta.url).href;
};
// 判断玩家位置
export const querySummonerPosition = (lane: string): string => {
    switch (lane) {
        case "MIDDLE":
            return "中单";
        case "JUNGLE":
            return "打野";
        case "BOTTOM":
            return "下路";
        case "UTILITY":
            return "下路";
        case "TOP":
            return "上单";
        case "NONE":
            return "未知";
        default:
            return "未知";
    }
};
// 获取位置序号, 方便排序
export const getPosition = (selectedPosition: string) => {
    switch (selectedPosition) {
        case "BOTTOM":
            return 4;
        case "JUNGLE":
            return 2;
        case "TOP":
            return 1;
        case "MIDDLE":
            return 3;
        case "UTILITY":
            return 5;
        case "NONE":
            return 0;
        default:
            return 0;
    }
};

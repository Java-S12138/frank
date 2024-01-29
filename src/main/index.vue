<script setup lang="ts">
import {ref} from "vue";
import {useMessage} from "naive-ui"
import {useRouter} from "vue-router";
import Dashboard from "@/main/common/dashboard.vue"
import Navigation from "@/main/common/navigation.vue";
import {useRuneStore} from "@/main/store/useRune";
import {useTeammateStore} from "@/main/store/useTeammate";
import {queryFriendInfo} from "@/main/views/teammate/utils";
import {invokeLcu} from "@/lcu";

const router = useRouter()
const curPos = ref(0)
const curFlow = ref('None')
const message = useMessage()
const teammateStore = useTeammateStore()
const runeStore = useRuneStore()
const queueId = ref(420)

router.push({name:'home'})

cube.windows.message.on('received',(id,content) => {
  console.log(id)
  switch (id) {
    case 'None':
      teammateStore.clearStore()
      runeStore.clearStore()
      return changeState(id,'rank',1)
    case 'CSSession':
      return hanleCSSession(id,content)
    case 'Champion':
      return hanleChampion(id,content)
  }
})
cube.windows.message.on('invoked',(id, content, reply) => {
  if (id==='getMatchList'){
    return reply(JSON.parse(JSON.stringify(teammateStore.cacheMatchList)))
  }
})

// 处理Champion状态
const hanleChampion = (id:string,content:any) => {
  if (content===0){
    return
  }
  runeStore.initStore(content).then((res) => {
    if (res){
      message.error('当前英雄暂无符文数据')
    }else {
      changeState(id,'rune',3)
    }
  })
}
// 处理CSSession状态
const hanleCSSession = async (id:string,content:any) => {
  const res:any =  await invokeLcu('get','/lol-gameflow/v1/session')
  if (res?.map !== undefined){
    localStorage.setItem('mapId',String(res.map.id))
  }
  queryFriendInfo(content).then((SummonerInfoList) => {
    teammateStore.initStore(SummonerInfoList,440)
    changeState(id,'teammate',2)
  })
}
/*const test = async () => {
  const t ={
    "actions": [
      [
        {
          "actorCellId": 0,
          "championId": 0,
          "completed": false,
          "id": 0,
          "isAllyAction": true,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 1,
          "championId": 0,
          "completed": false,
          "id": 1,
          "isAllyAction": true,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 2,
          "championId": 0,
          "completed": false,
          "id": 2,
          "isAllyAction": true,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 3,
          "championId": 0,
          "completed": false,
          "id": 3,
          "isAllyAction": true,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 4,
          "championId": 0,
          "completed": false,
          "id": 4,
          "isAllyAction": true,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 5,
          "championId": 0,
          "completed": false,
          "id": 5,
          "isAllyAction": false,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 6,
          "championId": 0,
          "completed": false,
          "id": 6,
          "isAllyAction": false,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 7,
          "championId": 0,
          "completed": false,
          "id": 7,
          "isAllyAction": false,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 8,
          "championId": 0,
          "completed": false,
          "id": 8,
          "isAllyAction": false,
          "isInProgress": true,
          "type": "ban"
        },
        {
          "actorCellId": 9,
          "championId": 0,
          "completed": false,
          "id": 9,
          "isAllyAction": false,
          "isInProgress": true,
          "type": "ban"
        }
      ],
      [
        {
          "actorCellId": -1,
          "championId": 0,
          "completed": false,
          "id": 100,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "ten_bans_reveal"
        }
      ],
      [
        {
          "actorCellId": 0,
          "championId": 0,
          "completed": false,
          "id": 10,
          "isAllyAction": true,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 1,
          "championId": 0,
          "completed": false,
          "id": 11,
          "isAllyAction": true,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 2,
          "championId": 0,
          "completed": false,
          "id": 12,
          "isAllyAction": true,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 3,
          "championId": 0,
          "completed": false,
          "id": 13,
          "isAllyAction": true,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 4,
          "championId": 0,
          "completed": false,
          "id": 14,
          "isAllyAction": true,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 5,
          "championId": 0,
          "completed": false,
          "id": 15,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 6,
          "championId": 0,
          "completed": false,
          "id": 16,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 7,
          "championId": 0,
          "completed": false,
          "id": 17,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 8,
          "championId": 0,
          "completed": false,
          "id": 18,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "pick"
        },
        {
          "actorCellId": 9,
          "championId": 0,
          "completed": false,
          "id": 19,
          "isAllyAction": false,
          "isInProgress": false,
          "type": "pick"
        }
      ]
    ],
    "allowBattleBoost": false,
    "allowDuplicatePicks": false,
    "allowLockedEvents": false,
    "allowRerolling": false,
    "allowSkinSelection": true,
    "bans": {
      "myTeamBans": [],
      "numBans": 0,
      "theirTeamBans": []
    },
    "benchChampions": [],
    "benchEnabled": false,
    "boostableSkinCount": 0,
    "chatDetails": {
      "mucJwtDto": {
        "channelClaim": "",
        "domain": "",
        "jwt": "",
        "targetRegion": ""
      },
      "multiUserChatId": "79d3d5af-706c-49bd-95e3-b82f6fd7f026",
      "multiUserChatPassword": ""
    },
    "counter": 2,
    "gameId": 8711825988,
    "hasSimultaneousBans": true,
    "hasSimultaneousPicks": true,
    "isCustomGame": false,
    "isSpectating": false,
    "localPlayerCellId": 4,
    "lockedEventIndex": -1,
    "myTeam": [
      {
        "assignedPosition": "",
        "cellId": 0,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "VISIBLE",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "10aa56e6-3938-5391-84e0-9af5bc622d71",
        "selectedSkinId": 0,
        "spell1Id": 6,
        "spell2Id": 4,
        "summonerId": 3273230872511616,
        "team": 1,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 1,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "VISIBLE",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "01399db1-b2cf-52a0-b2fe-ede8bdfe71c9",
        "selectedSkinId": 0,
        "spell1Id": 6,
        "spell2Id": 4,
        "summonerId": 4108057298,
        "team": 1,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 2,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "VISIBLE",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "fef91248-baef-5cc0-ae18-c4262353f507",
        "selectedSkinId": 0,
        "spell1Id": 6,
        "spell2Id": 4,
        "summonerId": 3146368896997024,
        "team": 1,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 3,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "VISIBLE",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "08847bf6-4db1-5d59-bcde-f256c76ce22a",
        "selectedSkinId": 0,
        "spell1Id": 6,
        "spell2Id": 4,
        "summonerId": 4133443841,
        "team": 1,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 4,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "VISIBLE",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "c9b0fd7a-59cd-54c6-bf7e-6b5241ebee84",
        "selectedSkinId": 0,
        "spell1Id": 4,
        "spell2Id": 6,
        "summonerId": 4016690740,
        "team": 1,
        "wardSkinId": 1
      }
    ],
    "pickOrderSwaps": [
      {
        "cellId": 1,
        "id": 8,
        "state": "INVALID"
      },
      {
        "cellId": 2,
        "id": 9,
        "state": "INVALID"
      },
      {
        "cellId": 3,
        "id": 10,
        "state": "INVALID"
      },
      {
        "cellId": 0,
        "id": 11,
        "state": "INVALID"
      }
    ],
    "recoveryCounter": 0,
    "rerollsRemaining": 0,
    "skipChampionSelect": false,
    "theirTeam": [
      {
        "assignedPosition": "",
        "cellId": 5,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "HIDDEN",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "",
        "selectedSkinId": 0,
        "spell1Id": 0,
        "spell2Id": 0,
        "summonerId": 0,
        "team": 2,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 6,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "HIDDEN",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "",
        "selectedSkinId": 0,
        "spell1Id": 0,
        "spell2Id": 0,
        "summonerId": 0,
        "team": 2,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 7,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "HIDDEN",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "",
        "selectedSkinId": 0,
        "spell1Id": 0,
        "spell2Id": 0,
        "summonerId": 0,
        "team": 2,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 8,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "HIDDEN",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "",
        "selectedSkinId": 0,
        "spell1Id": 0,
        "spell2Id": 0,
        "summonerId": 0,
        "team": 2,
        "wardSkinId": -1
      },
      {
        "assignedPosition": "",
        "cellId": 9,
        "championId": 0,
        "championPickIntent": 0,
        "nameVisibilityType": "HIDDEN",
        "obfuscatedPuuid": "",
        "obfuscatedSummonerId": 0,
        "puuid": "",
        "selectedSkinId": 0,
        "spell1Id": 0,
        "spell2Id": 0,
        "summonerId": 0,
        "team": 2,
        "wardSkinId": -1
      }
    ],
    "timer": {
      "adjustedTimeLeftInPhase": 23997,
      "internalNowInEpochMs": 1706505223696,
      "isInfinite": false,
      "phase": "PLANNING",
      "totalTimeInPhase": 24000
    },
    "trades": []
  }
  await hanleCSSession('CSSession',t)
  cube.windows.obtainDeclaredWindow('recentMatch')
}
test()*/
// 改变页面
const changeState = (id:string,page:string,index:number) => {
  curFlow.value = id
  navigateToPage(page,index)
}
// 改变底部页面图标
const navigateToPage = (page:string,index:number) => {
  if ((index === 2 && curFlow.value === 'None') || (index === 3 && curFlow.value !== 'Champion')) {
    message.warning('当前状态无法查看此页面', {duration:2000})
    return
  }
  curPos.value = index
  router.push({name:page})
}

</script>

<template>
  <div class="main bg-neutral-100 dark:bg-neutral-900">
    <dashboard/>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <navigation  :cur-pos="curPos" :navigate-to-page="navigateToPage"/>
  </div>
</template>

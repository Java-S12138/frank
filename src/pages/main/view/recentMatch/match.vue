<template>
  <div class="boxShadow match">
    <n-space style="margin:8px"  :size="[8,0]" >
      <n-space vertical style="width: 100px;" :size="[0,8]"
               v-for="match in props.matchList">
        <n-space :size="[5,0]">
          <n-avatar
            :size="50"
            :src="match.championUrl"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display:block"
          />
          <n-space style="width: 45px;height: 50px;border-radius:3px ;
          background-color: rgba(32, 128, 240, 0.12);"
                   vertical justify="space-between">
            <div class="rankPoint">
              {{match.rankPoint[0]}}
            </div>
            <div class="rankPoint">
              {{ match.rankPoint[1] }}
            </div>
          </n-space>
        </n-space>
        <n-tag size="tiny" type="info" v-if="blackList.length===0"
               :bordered="false" style="width: 100px;height: 24px;justify-content: center;font-size: 11px"
               >{{ match.summonerName }} </n-tag>
        <n-tag size="tiny" type="info" v-else-if="blackList.indexOf(match.summonerId) === -1"
               :bordered="false" style="width: 100px;height: 24px;justify-content: center;font-size: 11px"
               >{{ match.summonerName }} </n-tag>
        <n-tag size="tiny" type="error" v-else @click="openDra(match.summonerId,match.summonerName)"
               :bordered="false" style="width: 100px;height: 24px;justify-content: center;font-size: 11px"
               >{{ match.summonerName }} </n-tag>
        <n-space :size="[8,0]" v-for="champ in match.matchHistory">
          <n-avatar
            :size="30"
            :src="champ.champImg"
            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
            style="display:block;"
          />
          <n-tag :type="champ.isWin===true? 'success' :'error'" :bordered="false"
                 style="width: 62px;height: 30px;justify-content: center;align-items: center">
            {{champ.kill}}-{{ champ.deaths }}-{{champ.assists}}</n-tag>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {NSpace,NAvatar,NTag} from 'naive-ui'
import {onMounted} from "vue";
import {invokeLcu} from "../../lcu";
import {champDict} from "../../resources/champList";

const props:any = defineProps({
  matchList:{
    type:Array,
    default:[]
  },
  blackList:{
    type:Array,
    default:[]
  },
  winCount:{
    type:Array,
    default:[0,0]
  },
  gameType:{
    type:Number,
    default:420
  }
})

onMounted(async () => {
  for (const summonerInfo of props.matchList) {
    summonerInfo.matchHistory = summonerInfo.matchHistory.concat(
      await queryMatchHistory(summonerInfo.summonerId,props.gameType))
  }
})


const emits = defineEmits(['openDrawer'])

const openDra = (summonerId:string,summonerName:string) => {
  emits('openDrawer',summonerId,summonerName)
}

// 查询比赛记录 (最近10场排位)
const queryMatchHistory = async (summonerId: string,gameType:number) => {
  let classicMode: any = []
  let matchCount = 0
  let winCount = 0
  mainfor:
    for (let i = 0; i < 100; i += 20) {
      const matchList = (await invokeLcu('get', `/lol-match-history/v3/matchlist/account/${summonerId}`, [i, i + 20]))?.games?.games.reverse()
      for (let j = 0; j < matchList?.length; j++) {
        if (matchList[j].queueId === gameType) {
          if (matchCount === 10) {
            break mainfor
          }
          matchCount += 1
          winCount = matchList[j].participants[0].stats.win === true ? winCount+1:winCount
          classicMode.push({
            champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchList[j].participants[0].championId)].alias}.png`,
            kill: matchList[j].participants[0].stats.kills,
            deaths: matchList[j].participants[0].stats.deaths,
            assists: matchList[j].participants[0].stats.assists,
            isWin: matchList[j].participants[0].stats.win,
          })
        }
      }
    }
  props.winCount[0] += winCount
  props.winCount[1] += matchCount
  return classicMode
}

</script>

<style scoped>
.match {
  width: 548px;
  height: 477px;
  border-radius: 3px;
  background: #ffffff;
}
.avatarCommon{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 3px;
  position: relative;
  font-size: 11px;
}
.avatarOne > div > div > div > p{
  color: #ffffff;
  position: absolute;
  left: 8px;
}
.avatarTwo > div > div > div > p{
  color: #ffffff;
  position: absolute;
  right: 8px;
}
.one_ {
  top: -2px;
}
.two_ {
  top: 10px;
}
.three_ {
  top: 22px;
}
.avatarDefeat {
  border:2px solid rgba(255, 102, 102, 0.8);
  background-color: rgba(255, 102, 102, 0.5);
}
.avatarWin {
  border:2px solid rgba(24, 180, 120, 0.8);
  background-color: rgba(24, 180, 120, 0.5);
}
.rankPoint {
  font-size: 12px;
  height: 16px;
  width: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2080f0;
}
</style>

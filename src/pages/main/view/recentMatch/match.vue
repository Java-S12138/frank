<template>
  <div class="boxShadow match">
    <n-space style="margin:8px"  :size="[8,0]" >
      <n-space vertical style="width: 100px;" :size="[0,8]"
               v-for="(match,index) in props.matchList">
        <n-space :size="[5,0]" style="position:relative">
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
          <div class="heroTip" v-if="match.summonerState.state>0">{{match.summonerState.title}}</div>
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
        <n-space :size="[8,0]"  @click="openMatchDra(champ.gameId,match.summonerId)"
                 v-for="champ in matchInfoList[index]">
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
import {onMounted, Ref, ref} from "vue";
import {invokeLcu} from "../../lcu";
import {champDict} from "../../resources/champList";
interface matchTypes {
  champImg: string;
  kill: number;
  deaths: number;
  assists: number;
  isWin: boolean;
  gameId: number;
}

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

const matchInfoList:Ref<matchTypes[][]> = ref([])
onMounted(async () => {
  for (const summonerInfo of props.matchList) {
    matchInfoList.value.push(await queryMatchHistory(summonerInfo.puuid,props.gameType,summonerInfo.summonerState))
  }
})
const locale = <string>localStorage.getItem('locale')
const emits = defineEmits(['openDrawer','openMatchDrawer'])

const openDra = (summonerId:string,summonerName:string) => {
  emits('openDrawer',summonerId,summonerName)
}
const openMatchDra = (gameId: number,summonerId:number) => {
  emits('openMatchDrawer',gameId,summonerId)
}

// 查询比赛记录 (最近10场排位)
const queryMatchHistory = async (puuid:string,gameType:number,summonerState:{ state: number, title: string }):Promise<matchTypes[]> => {
  let classicMode: matchTypes[] = []
  let matchCount = 0
  let winCount = 0
  mainfor:
    for (let i = 0; i < 100; i += 20) {
      const matchGet = await invokeLcu('get', `/lol-match-history/v1/products/lol/${puuid}/matches`, [i, i + 20])
      const matchList = locale === 'zh_CN' ? matchGet?.games?.games.reverse():matchGet?.games?.games
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
            gameId:matchList[j].gameId
          })
        }
      }
    }
  // 判断是否为小代
  if (summonerState.state === - 1){
    let excellentCount = 0
    let cycleCount = 0
    for (let match of classicMode) {
      cycleCount+=1
      if (cycleCount>5){
        break
      }
      if (match.kill >= 10){
        excellentCount += 1
      }
    }
    if (excellentCount >=3){
      summonerState.title = '小代'
      summonerState.state = 3
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
.rankPoint {
  font-size: 12px;
  height: 16px;
  width: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2080f0;
}
.heroTip {
  box-sizing: border-box;
  position: absolute;
  font-size: 11px;
  padding:1.5px 4px 0px 4px ;
  border-radius: 2px;
  height: 20px;
  bottom: 0px;
  right: 50px;
  color: #ffffff;
  background-color: #ff6666;
}
</style>

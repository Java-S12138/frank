<template>
  <div class="boxShadow match matchColor">
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
          <n-space style="width: 45px;height: 50px;border-radius:3px;"
                   vertical justify="space-between" class="recentRankPoint">
            <div class="rankPoint">
              {{match.rankPoint[0]}}
            </div>
            <div class="rankPoint">
              {{ match.rankPoint[1] }}
            </div>
          </n-space>
          <div class="heroTip" v-if="match.summonerState.state>0">{{match.summonerState.title}}</div>
        </n-space>
        <n-tag size="tiny" type="info" v-if="blackList?.length===0"
               :bordered="false" style="width: 100px;height: 24px;justify-content: center;font-size: 11px"
               >{{ match.summonerName }} </n-tag>
        <n-tag size="tiny" type="info" v-else-if="blackList?.indexOf(match.summonerId) === -1"
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
import {onMounted, PropType, Ref, ref} from "vue";
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
    type:Array as PropType<any[]>,
    default:[]
  },
  blackList:{
    type:Array as PropType<any[]>,
    default:[]
  },
  winCount:{
    type:Array as PropType<number[]>,
    default:[0,0]
  },
  gameType:{
    type:Number as PropType<number>,
    default:0
  },
  isLeft:{
    type:Boolean as PropType<boolean>
  }
})

const matchInfoList:Ref<matchTypes[][]> = ref([])
const locale = <string>localStorage.getItem('locale')

const emits = defineEmits(['openDrawer','openMatchDrawer','doneRender'])

const openDra = (summonerId:any,summonerName:string) => {
  emits('openDrawer',Number(summonerId),summonerName)
}
const openMatchDra = (gameId: number,summonerId:any) => {
  emits('openMatchDrawer',gameId,Number(summonerId))
}

onMounted(async () => {
  if (props.isLeft){
    await initMatchList()
    emits('doneRender')
  }
})

const initMatchList = async () => {
  if (props.matchList.length === 0){
    return
  }
  const mathcClass = new Match()
  if (locale !== 'zh_CN'){
    for (const summonerInfo of props.matchList) {
      await mathcClass.queryMatchHistory(summonerInfo.puuid,props.gameType,summonerInfo.summonerState,false)
    }
  }
  else if (props.gameType !== 420 && props.gameType !== 440){
    for (const summonerInfo of props.matchList) {
      await mathcClass.queryMatchHistory(summonerInfo.puuid,props.gameType,summonerInfo.summonerState,false)
    }
  }
  else {
    for (const summonerInfo of props.matchList) {
      await mathcClass.queryMatchHistory(summonerInfo.puuid,props.gameType,summonerInfo.summonerState,false)
    }
  }
}
class Match {
  public classicMode: matchTypes[] = []
  public matchCount = 0
  public winCount = 0

  public queryMatchHistory = async (puuid:string,gameType:number,summonerState:{ state: number, title: string },isRank:boolean)=>  {
    await this.rankQuery(puuid,gameType,isRank)
    this.isExcelPlayer(summonerState)
  }

  public queryMatch = async (matchList:any) => {
    this.winCount = matchList.participants[0].stats.win === true ? this.winCount+1:this.winCount
    this.classicMode.push(
      {
        champImg: `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[String(matchList.participants[0].championId)].alias}.png`,
        kill: matchList.participants[0].stats.kills,
        deaths: matchList.participants[0].stats.deaths,
        assists: matchList.participants[0].stats.assists,
        isWin: matchList.participants[0].stats.win,
        gameId:matchList.gameId
      }
    )
  }

  public isExcelPlayer = (summonerState:{ state: number, title: string }) => {
    // 判断是否为小代
    if (summonerState.state === - 1){
      let excellentCount = 0
      let cycleCount = 0
      for (let match of this.classicMode) {
        cycleCount+=1
        if (cycleCount>5){
          break
        }
        if (match.kill >= 12){
          excellentCount += 1
        }
      }
      if (excellentCount >=3){
        summonerState.title = '小代'
        summonerState.state = 3
      }
    }
    props.winCount[0] += this.winCount
    props.winCount[1] += this.matchCount
    this.winCount = 0
    this.matchCount = 0
    this.classicMode = []
  }

  public rankQuery = async (puuid:string,gameType:number,isRank:boolean) => {
    mainfor:
      for (let i = 0; i < 100; i += 20) {
        try {
          const matchGet = await invokeLcu('get', `/lol-match-history/v1/products/lol/${puuid}/matches`, [i, i + 20])
          if (matchGet['games'] === undefined){
            continue
          }
          if (matchGet['games']['games'].length === 0 ) {
            break mainfor
          }
          const matchList = locale === 'zh_CN' ? matchGet['games']['games'].reverse() : matchGet['games']['games']
          for (let j = 0; j < matchList.length; j++) {
            if (this.matchCount === 10) {
              break mainfor
            }
            if (matchList[j].queueId === gameType && isRank) {
              this.matchCount += 1
              await this.queryMatch(matchList[j])
            }else if (!isRank) {
              this.matchCount += 1
              await this.queryMatch(matchList[j])
            }
          }
        }catch (e) {
          continue
        }
      }
    matchInfoList.value.push(this.classicMode)
  }
}

defineExpose({initMatchList})
</script>

<style scoped>
.match {
  width: 548px;
  height: 477px;
  border-radius: 3px;

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

<template>
  <div>
    <n-space>
      <n-card class="mainCard boxShadow">
        <n-space vertical style="margin-top: 42px"
                 :size="[2,37.5]">
          <n-space v-for="summoner in summonerInfo">
            <n-avatar
              round
              :bordered="false"
              :size="50"
              :src="`https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summoner.iconId}.png`"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              @click="clickCurrentSummoner($event,summoner.summonerId,summoner.name)"
            />
            <n-space vertical :size="[10,4]">
              <n-tag type="success" :bordered="false" round size="small" disabled="disabled">{{ summoner.name }}</n-tag>
              <n-tag type="success" :bordered="false"  v-if="summoner.horse == '上等马'"
                     round size="small">{{ summoner.horse }} Lv: {{ summoner.level }}
              </n-tag>
              <n-tag type="warning" :bordered="false" v-else-if="summoner.horse == '中等马'"
                     round size="small">{{ summoner.horse }} Lv: {{ summoner.level }}
              </n-tag>
              <n-tag type="info" :bordered="false" v-else-if="summoner.horse == '下等马'"
                     round size="small">{{ summoner.horse }} Lv: {{ summoner.level }}
              </n-tag>
              <n-tag type="error" :bordered="false" v-else-if="summoner.horse == '小牛马'"
                     round size="small">{{ summoner.horse }} Lv: {{ summoner.level }}
              </n-tag>
            </n-space>
          </n-space>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<script>
import {NCard, NAvatar, NSpace, NTag, NButton} from 'naive-ui'

export default {
  name: "leftCard",
  components: {
    NCard, NAvatar, NSpace, NTag, NButton
  },
  props: {
    summonerInfo: {
      type: Array
    }
  },
  setup(props,{emit}) {
    let clickCount = 0
    let clickList = []
    const clickCurrentSummoner = (e,summonerId,name) => {
      try {
        emit('summonerId', {summonerId, name})
        let tar = e.currentTarget.parentElement.parentElement
        let nTag = tar.getElementsByClassName('n-tag--disabled')[0]
        nTag.classList.remove('n-tag--disabled')
        clickCount += 1
        clickList.push(nTag)
        if (clickCount == 2) {
          clickList[0].classList.add('n-tag--disabled')
          clickList.splice(0, 1)
          clickCount = 1
        }
      }catch (e){
        return e
      }
    }

    return {
      clickCurrentSummoner
    }
  }
}
</script>

<style scoped>
.mainCard {
  margin: 10px;
  border-radius: 10px;
  width: 250px;
  height: 556px
}

.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}
</style>

<template>
  <div>
    <v-chart  class="chart" @click="onClick" :option="
{
  color: ['#7BD9A5','#F17D7D', '#F9C97D'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    x: '25px',
    top: '30px',
    bottom: '30px',
    right: '0px'
  },
  legend: {
    data: ['击杀', '死亡', '助攻']
  },
  xAxis: [
    {
      type: 'category',
      data:echartData.champ,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis:{
    type: 'value',
    show: true,
    splitLine:{show: false},
  },
  series: [
    {
      name: '击杀',
      type: 'bar',
      data: echartData.kills,
    },
    {
      name: '死亡',
      type: 'bar',
      data: echartData.deaths
    },
    {
      name: '助攻',
      type: 'bar',
      data: echartData.assists
    },
  ]
}">

    </v-chart>
  </div>
</template>

<script>
export default {
  name: "recentEchart"
}
</script>

<script setup>
import VChart from "vue-echarts";
import {ref, watchEffect} from "vue";
import {queryStore} from "@/render/store";
import {storeToRefs} from "pinia";


const store = queryStore()
const {showChart,matchList,currentGameId,currentMatchIndex} = storeToRefs(store)
const echartData = ref({champ:[],kills:[],deaths:[],assists:[]})

const props = defineProps({
  matchList: {
    type: Object
  }
});

watchEffect(()=>{
  echartData.value = {champ:[],kills:[],deaths:[],assists:[]}
  for (const argument of props.matchList) {
    echartData.value.champ.push(argument.champ)
    echartData.value.kills.push(argument.kills)
    echartData.value.deaths.push(argument.deaths)
    echartData.value.assists.push(argument.assists)
  }
})

function onClick() {
  const index = arguments[0].dataIndex
  currentGameId.value = matchList.value[index].gameId
  currentMatchIndex.value = index
  showChart.value = false
}

</script>

<style scoped>
.chart {
  margin-top: 7px;
  height: 550px;
  width: 820px;

}
</style>

<template>
  <div style="margin-top: 12px">
    <n-space vertical >
      <n-tag :bordered="false" type="success">
         {{realPowerList[0]}}
      </n-tag>
      <div>
        <n-space class="addMargin" v-for="(index,key) in [1,3,5,7,9]">
          <div :class="'img'+key"></div>
          <div class="content">
            <div class="item">
              <div class="progress">
                <div class="progress-percentage">{{realPowerList[index+1] }}</div>
                <div class="progress-bar">
                  <div :class="'progress-inner progress-inner-'+key" :style=realPowerList[index] style= "margin-left: 8px"></div>
                </div>
              </div>
            </div>
          </div>
        </n-space>
      </div>
    </n-space>
  </div>
</template>

<script>
import {
  NCard, NAvatar, NSpace, NTag, NModal,
  NInput, NButton, NSelect, NPopover, NList, NListItem, useMessage
} from 'naive-ui'
import {getRealPower} from '../../../utils/render/getUserInfo'
import {ref,} from "vue"

export default {
  name: "realPower",
  components: {
    NCard, NAvatar, NSpace, NTag, NModal,
    NInput, NButton, NSelect, NPopover, NList, NListItem, useMessage
  },
  setup(){
    let realPowerList = ref([])
    getRealPower().then((res) => {
      realPowerList.value = res
    })
    return {
      realPowerList
    }
  }
}
</script>

<style scoped>
@import url("../../assets/css/realPowerCss.css");
.addMargin {
  margin-bottom: 3px !important;
}
</style>

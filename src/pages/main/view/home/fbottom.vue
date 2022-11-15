<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-space class="fade-in" v-if="page===1" justify="center">
        <n-space :size="[40,0]" justify="center" style="margin-top: 10px;margin-bottom: 0px">
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openGithub">
                  <BrandGithub></BrandGithub>
                </n-icon>
              </template>
              <span>Github 点亮✨吧 !</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openSyjun">
                  <Code></Code>
                </n-icon>
              </template>
              <span>来我的个人网站喝杯茶吧🍺 !</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openFrank">
                  <Help></Help>
                </n-icon>
              </template>
              <span>Frank使用手册大全🐣</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openUpdate">
                  <ArrowUpCircle></ArrowUpCircle>
                </n-icon>
              </template>
              <span>Version {{ config.version }}</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="test">
                  <ArrowUpCircle></ArrowUpCircle>
                </n-icon>
              </template>
              <span>Version {{ config.version }}</span>
            </n-popover>
          </n-button>
        </n-space>
      </n-space>
      <Notice class="fade-in" v-else :notice=notice></Notice>
      <div class="transform" v-if="notice!==''">
        <div class="circle">
          <span :class="page===1?'active':''" @click="changePage"></span>
          <span :class="page===2?'active':''" @click="changePage"></span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NSpace, NButton, NIcon, NPopover} from 'naive-ui'
import {BrandGithub, Help, Code, ArrowUpCircle} from '@vicons/tabler'
import config from "../../../../../package.json"
import Notice from "./notice.vue"
import {onMounted, ref} from "vue";
import {request} from "../../utils/request";

const notice = ref('')
const page = ref(1)
onMounted(() => {
  cube.windows.getWindowByName('main').then(async (win) => {
    if (win.show){
      const timestamp = new Date().getTime()
      const res = await request.get(`https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice.json?date=${timestamp}`)
      if (res.status === 200 && res.data.isShow) {
        notice.value = res.data
        page.value = 2
      }
    }
  })
})

const openUpdate = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/update')
}
const openGithub = () => {
  cube.utils.openUrlInDefaultBrowser('https://github.com/java-S12138/frank')
}
const openSyjun = () => {
  cube.utils.openUrlInDefaultBrowser('https://syjun.vip')
}
const openFrank = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank')
}
const changePage = () => {
  page.value = page.value === 2 ? 1 : 2
}

const test = () => {
  cube.windows.obtainDeclaredWindow('recentMatch')
}

</script>

<style scoped>
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 37px;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
  height: 73.5px;
}

.transform {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  bottom: -1px;
}

.circle span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background: rgba(24, 160, 88, 0.3);
  margin: 0px 2.5px 0px 2.5px;
  transition: background-color 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.active {
  background: #18a058 !important;
}

.fade-in {
  animation: fade-in 1s cubic-bezier(.39, .575, .565, 1.000) both
}

@keyframes fade-in {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
}
</style>

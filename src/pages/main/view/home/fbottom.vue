<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-space justify="center">
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
              <span>当前版本 1.21.12.20</span>
            </n-popover>
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>


<script setup>
import {NCard, NSpace, NButton, NIcon, NPopover} from 'naive-ui'
import {BrandGithub, Help, Code, ArrowUpCircle} from '@vicons/tabler'


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
}

</style>

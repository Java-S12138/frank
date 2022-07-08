<template>
  <div>
    <n-card class="boxShadow mainCard" size="small">
      <n-space justify="center">
        <n-space :size="[30]" justify="center" style="margin-top: 10px;margin-bottom: 0px">
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false" >
            <template #trigger>
              <n-icon size="20" @click="openGithub">
                <BrandGithub></BrandGithub>
              </n-icon>
            </template>
            <span>Github 点亮✨吧 !</span>
          </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false" >
            <template #trigger>
              <n-icon size="20" @click="openSyjun">
                <Code></Code>
              </n-icon>
            </template>
            <span>来我的个人网站喝杯茶吧🍺 !</span>
          </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false" >
            <template #trigger>
              <n-icon size="20" @click="openFrank">
                <Help></Help>
              </n-icon>
            </template>
            <span>Frank使用手册大全🐣</span>
          </n-popover>
          </n-button>
          <n-button text v-if="showPopover">
            <n-popover  trigger="hover" :show-arrow="false">
            <template #trigger>
              <n-icon size="20" @click="openUpdate"
                       color="green">
                <ArrowUpCircle></ArrowUpCircle>
              </n-icon>
            </template>
              <span>软件有新的版本🔔</span>
            </n-popover>
          </n-button>
          <n-button text v-else>
            <n-popover  trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20">
                  <ArrowUpCircle></ArrowUpCircle>
                </n-icon>
              </template>
              <span>Frank当前版本V {{frankVersion}}</span>
            </n-popover>
          </n-button>

        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script>
import {NCard, NSpace, NTag,NAvatar,NButton,NIcon,NPopover} from 'naive-ui'
import {BrandGithub,Help,Code,ArrowUpCircle} from '@vicons/tabler'
import {shell } from 'electron'
import {ref,onMounted} from "vue";
import {request} from "@/utils/render/request";
import {appConfig} from "@/utils/main/config";
export default {
  name: "fbottom",
  components:{NCard, NSpace, NTag,NAvatar,NButton,
    NIcon,BrandGithub,NPopover,Help,Code,ArrowUpCircle},
  setup(){
    let showPopover = ref(false)
    let frankVersion = ref(appConfig.get('frankVersion'))


    // 检查版本更新
    onMounted(async () => {
      frankVersion.value = (await request({
        url:'https://unpkg.com/@java_s/op.gg/package.json'
      })).data.frankVersion
      if (frankVersion.value != appConfig.get('frankVersion')){
        showPopover.value = true
      }
    })
    const openUpdate = () => {
      shell.openExternal('https://wwi.lanzoup.com/b01bvyhuf')
      appConfig.set('frankVersion', frankVersion.value)
      showPopover.value = false
    }

    const openGithub = () => {
      shell.openExternal('https://github.com/java-S12138/frank')
    }
    const openSyjun = () => {
      shell.openExternal('https://syjun.vip')
    }
    const openFrank = () => {
      shell.openExternal('https://www.yuque.com/java-s/frank')
    }

    return {
      showPopover,frankVersion,
      openGithub,openSyjun,openFrank,openUpdate
    }
  }
}
</script>

<style scoped>
.mainCard {
  width: 90vw;
  display: flex;
  flex-direction: column;
  margin-top: 37px;
}

.n-card {
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 10px;
  padding: 5px;
}
.boxShadow {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
  0 3px 6px 0 rgba(0, 0, 0, 0.06),
  0 5px 12px 4px rgba(0, 0, 0, 0.04);;
}
</style>

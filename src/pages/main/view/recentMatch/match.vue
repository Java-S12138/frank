<template>
  <div class="boxShadow match">
    <n-space style="margin: 12px" v-for="index in [0,1,2,3,4]">
      <n-avatar
        :size="65"
        src="https://game.gtimg.cn/images/lol/act/img/champion/Yasuo.png"
        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        style="display:block;"
      />
      <n-space vertical :size="[0,6.5]">
        <n-space style="width:445px;margin-top: -4px" justify="space-between">
         <n-tag size="tiny" style="width: 116px;padding-left: 0px"
                :bordered="false" :color="{ color: '#ffffff', textColor: '#9AA4AF' }">多元函数积分学</n-tag>
         <n-tag size="tiny" :bordered="false" :color="{ color: '#f5f5f5', textColor: '#9AA4AF' }">单双排位  铂金Ⅳ</n-tag>
         <n-tag size="tiny" :bordered="false" :color="{ color: '#f5f5f5', textColor: '#9AA4AF' }">灵活排位  铂金Ⅳ</n-tag>
         <n-tag size="tiny" :bordered="false" type="info">主玩位置  中单</n-tag>
        </n-space>
        <n-space :size="[5,0]">
          <div class="avatarDefeat avatarCommon">
            <n-avatar
              :size="30"
              src="https://game.gtimg.cn/images/lol/act/img/champion/Akali.png"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display:block;"
            />
          </div>
          <div class="avatarWin avatarCommon" v-for="index in [0,1,2,3,4,5,6,7,8]">
            <n-avatar
              :size="30"
              src="https://game.gtimg.cn/images/lol/act/img/champion/Akali.png"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display:block;"
            />
          </div>
        </n-space>
      </n-space>

    </n-space>

  </div>
</template>

<script setup lang="ts">
import {NIcon, NSpace, NButton, NPopover,NPopconfirm,NAvatar,
  NInput,NTag,NSelect} from 'naive-ui'

</script>

<style scoped>
.match {
  width: 546px;
  height: 397px;
  border-radius: 10px;
  background: #ffffff;
}
.avatarCommon{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 3px;
}
.avatarDefeat {
  border:2px solid rgba(255, 102, 102, 0.8);
  background-color: rgba(255, 102, 102, 0.5);
}
.avatarWin {
  border:2px solid rgba(24, 180, 120, 0.8);
  background-color: rgba(24, 180, 120, 0.5);
}
</style>

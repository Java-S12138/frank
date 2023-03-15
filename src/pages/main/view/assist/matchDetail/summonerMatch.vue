<template>
  <!--    <n-layout class="contain" has-sider>
        <n-layout-sider content-style="padding: 0px;">
          <n-avatar
            :size="55"
            src="https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png"
            style="display: block"
          />
        </n-layout-sider>
        <n-layout>
          <n-layout-content>
            <n-space :size="[5,0]">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
              <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
            </n-space>
          </n-layout-content>
        </n-layout>
      </n-layout>-->
  <n-layout style="height: 55px" has-sider>
    <n-layout-sider width="55" style="margin-right: 8px">
      <n-avatar
        :size="55"
        src="https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png"
        style="display: block"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-content>
        <div class="itemImgDiv">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
          <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        </div>
      </n-layout-content>
      <n-layout-content class="infoLayout">
        <div class="infoDiv">
          <n-tag class="tagKDA" :bordered="false"
                 size="small" type="success">12-5-8</n-tag>
          <n-tag  class="tagKDA" :bordered="false"
                  size="small" type="success">中单•16</n-tag>
          <!--          <n-tag   :bordered="false"-->
          <!--                 size="small" type="success">3/15/22</n-tag>-->
          <img class="imgItemSecond" src="https://game.gtimg.cn/images/lol/act/img/spell/Summoner_flash.png">
          <img class="imgItemSecond" src="https://game.gtimg.cn/images/lol/act/img/spell/SummonerIgnite.png">

        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>

</template>

<script setup lang="ts">
import {
  NSpace, NAvatar, NTag, NTabs, NLayout, NLayoutSider, NLayoutContent,
  NLayoutHeader, NLayoutFooter
} from 'naive-ui'
</script>

<style scoped>
.imgItem {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}
.imgItemSecond {
  margin-top: 10px;
  width: 15px;
  height: 15px;
  border-radius: 2px;
}
.itemImgDiv {
  display: flex;
  justify-content: space-between
}
.infoDiv {
  display: flex;
  gap: 8px;
}
.infoLayout {
  margin-top: 5px;
  height: 25px;
}
.tagKDA {
  height: 25px;
  width: 58px;
  justify-content: center;
}
</style>

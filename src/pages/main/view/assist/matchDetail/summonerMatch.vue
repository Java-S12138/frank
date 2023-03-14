<template>
  <n-space>
    <n-space>
      <n-avatar
        :size="55"
        src="https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png"
        style="display: block"
      />
      <n-space  >
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
        <img class="imgItem" src="https://game.gtimg.cn/images/lol/act/img/item/6655.png">
      </n-space>
    </n-space>
  </n-space>

</template>

<script setup lang="ts">
import {NSpace,NAvatar,NTag,NTabs,NTabPane} from 'naive-ui'
</script>

<style scoped>
.imgItem {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}
</style>

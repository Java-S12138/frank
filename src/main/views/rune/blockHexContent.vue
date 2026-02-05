<script setup lang="ts">
import { NScrollbar} from 'naive-ui'
const {items} = defineProps<{ items: string[][] }>();
const len = Math.ceil(items.length / 2)
</script>


<template>
  <n-scrollbar
    style="height: 260px; padding-right: 0.5px"
    content-style="padding:0px 12px;"
  >
    <div class="flex justify-between mt-3">
      <div class="flex flex-col gap-3 p-3 runeDivDash dark:border-gray-700 min-w-0">
        <div class="flex gap-3" v-for="item in items.slice(0,len)">
          <img class="itemImg" draggable="false" v-for="img in item"
               :src="'https://game.gtimg.cn/images/lol/act/img/item/'+img+'.png'">
        </div>
      </div>
      <div class="flex flex-col gap-3 p-3 runeDivDash dark:border-gray-700 min-w-0">
        <div class="flex gap-3" v-for="item in items.slice(len,items.length)">
          <img class="itemImg" draggable="false" v-for="img in item"
               :src="'https://game.gtimg.cn/images/lol/act/img/item/'+img+'.png'">
        </div>
      </div>
    </div>

  </n-scrollbar>
</template>

<style scoped>
.itemImg {
  width: 30.5px;
  height: 30.5px;
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import {NResult,NAlert,NCard} from "naive-ui";
</script>

<template>
  <n-card size="small" class="mt-2 shadow h-full"  style="height: 499px;">
    <n-result
      status="418"
      title="数据正在加载中..."
      class="mt-12"
      description="如果长时间无法显示数据，请关闭此窗口" size="huge">
      <template #footer>
        <div class="flex justify-center">
          <n-alert title="温馨提示" type="success">
            如果无法显示数据，游戏结束后。 请在大厅客户端的设置里面检查<br>
            [ 在游戏时关闭客户端 ] 选项是否为 [ 从不 ]  建议您拍照，别忘了哟~
          </n-alert>
        </div>
      </template>
    </n-result>
  </n-card>
</template>


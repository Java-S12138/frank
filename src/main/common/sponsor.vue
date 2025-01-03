<script setup lang="ts">
import {NAlert, NCard, NCollapse,NCollapseItem,NImage} from "naive-ui"

const Wcchat = new URL("/src/assets/matchImage/Wechat.JPEG", import.meta.url).href
const Alipay = new URL("/src/assets/matchImage/Alipay.JPEG", import.meta.url).href

</script>

<template>
  <n-card
    :bordered="false"
    size="small"
    role="dialog"
    aria-modal="true"
  >
    <n-alert title="感谢您的支持" type="success">
      如果您觉得软件的内容有帮助，请考虑为Frank提供一点小小的赞助。您的支持会让我做得更好！
    </n-alert>

    <n-collapse class="mt-4">
      <n-collapse-item title="Wechat" name="1">
        <div class="flex justify-center">
          <n-image
            width="150"
            :src="Wcchat"
          />
        </div>
      </n-collapse-item>
      <n-collapse-item title="Alipay" name="2">
        <div class="flex justify-center">
          <n-image
            width="150"
            :src="Alipay"
          />
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

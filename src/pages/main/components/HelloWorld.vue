<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

setTimeout(() => {
  const abc = document.querySelector('#abc')

  const ioOptions = {
    root: abc!
  };
  const c = new IntersectionObserver((v) => {
    console.log(v)
  }, ioOptions)

  c.observe(abc!)
}, 1000);

const count = ref(0)


console.log(123123123)
</script>

<template>
  <h1>{{ msg }} 123</h1>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
  <div id='abc' style="height:400px; width:400px; background:#000000"></div>
  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <img src="../../../../public/icon.png" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
  cursor: wait;
}
</style>

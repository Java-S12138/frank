<script>
import {NMessageProvider} from 'naive-ui'
export default {
  components:{NMessageProvider,}
}
</script>

<template  >
  <n-message-provider :placement="'bottom'">
    <router-view></router-view>
  </n-message-provider>
</template>


<style>
@font-face {
  font-family: "bom";
  src: url("assets/fonts/bmo.ttf");
}
* {
  margin: 0;
  padding: 0;
  font-family: bom, Avenir, Helvetica, Arial, sans-serif;
}
html {
  background: #f5f5f5;
}
::-webkit-scrollbar {
  width: 0;
}


#app {
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>

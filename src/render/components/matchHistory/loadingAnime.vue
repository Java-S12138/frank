<template>
  <div>
    <i></i>
    <i></i>
  </div>
</template>

<script>
export default {
  name: "loadingAnime"
}
</script>

<style scoped>
i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40vmin;
  height: 40vmin;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: move 10s forwards infinite;
  background: linear-gradient(15deg,#42d392 25%,#647eff);
}

i:nth-child(2) {
  animation-delay: -2s;
  background: rgba(255,255,255,.3);
  box-shadow: 0 0 1rem rgba(255,255,255,.7),
  0 0 0 1px rgba(255,255,255,.1);
  backdrop-filter: blur(30px);
}

@keyframes move {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0) translateY(-30%);
  }
  25% {
    transform: translate(-50%, -50%) rotate(-90deg) translateY(-30%);
  }
  50% {
    transform: translate(-50%, -50%) rotate(180deg) translateY(-30%);
  }
}
</style>

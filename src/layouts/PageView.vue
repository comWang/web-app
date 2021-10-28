<template>
  <div class="app-page-view">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'PageView',
}
</script>

<style lang="less" scoped>
.app-page-view {
  box-sizing: border-box;
  padding: 20px;
  background-color: @bg-light;
}
</style>

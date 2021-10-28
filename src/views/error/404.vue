<template>
  <div>
    <div class="exception-text">
      <h1>404</h1>
      <h3>Not Found</h3>
    </div>
    <div style="text-align:center;">
      <Icon
        name="404"
        size="400"
      />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.exception-text {
  margin-top: 10%;
  color: @dark;

  h1 {
    padding: 0;
    margin: 0;
    font-size: 89px;
    text-align: center;
  }

  h3 {
    padding: 0;
    margin: 0;
    text-align: center;
  }
}
</style>

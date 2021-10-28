<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
body {
  padding: 0;
  margin: 0;
  font-family: PingFang SC, Microsoft YaHei, Source Han Sans SC, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @darker;
  #nprogress .bar {
    background-color: @color-2;
  }
}

p,
ul,
li {
  padding: 0;
  margin: 0;
}

.admin-link {
  color: @color-1;
  text-decoration: underline;
  cursor: pointer;
}

.admin-page--body .el-table__row {
  .admin-more {
    visibility: hidden;
  }
  &:hover .admin-more {
    visibility: visible;
  }
}

.admin-pagination {
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="basic-layout">
    <Dashboard style="width: 100px;height:100vh" />
    <div
      style="width: calc(100% - 100px);"
      class="basic-layout-body"
    >
      <Header style="height: 50px;" />
      <router-view style="height: calc(100% - 50px); overflow-y: auto;" />
    </div>
  </div>
</template>

<script>
import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'

export default {
  components: {
    Dashboard,
    Header,
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="less" scoped>
.basic-layout {
  display: flex;
}
</style>

<template>
  <div>
    主页
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
  },
}
</script>

<style lang="less" scoped></style>

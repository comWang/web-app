<template>
  <i :style="`line-height: 1em;font-size: ${fontSize ? fontSize : '1em'}`">
    <svg
      v-if="isSVG"
      :class="['app-icon', className]"
    >
      <use :href="`#icon-${name}`" />
    </svg>
    <i
      v-else
      :class="[name, className]"
    />
  </i>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    size: {
      type: [Number, String],
      default: '',
    }
  },
  computed: {
    isSVG() {
      if (/^el-/.test(this.name)) return false
      return true
    },
    fontSize() {
      if (typeof this.size === 'number') return this.size + 'px'
      if (/^[0-9]+$/.test(this.size)) return this.size + 'px'
      return this.size
    }
  },
}
</script>

<style lang="less" scoped>
.app-icon {
  width: 1em;
  height: 1em;
  min-width: 12px;
  min-height: 12px;
}
</style>

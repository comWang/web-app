<template>
  <el-dialog
    class="admin-dialog"
    :visible="show"
    :width="parseInt(width, 10) + 'px'"
    :top="/^\d+$/.test(top) ? top + 'px' : top"
    :show-close="false"
    append-to-body
    @close="onClose"
  >
    <div
      slot="title"
      class="title"
    >
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
      <div class="btn-close">
        <i
          class="el-icon-close"
          @click="onClose"
        />
      </div>
    </div>
    <div
      class="admin-dialog-content"
      :style="`max-height:${maxHeight}`"
    >
      <slot name="default" />
    </div>
    <div
      v-if="showFooter"
      class="button-group"
    >
      <slot name="footer">
        <el-button
          v-if="showCancel"
          class="button btn-cancel"
          type="default"
          @click="onClose"
        >
          {{
            cancelText
          }}
        </el-button>
        <el-button
          v-if="showConfirm"
          class="button"
          type="primary"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </el-button>
        <el-button
          v-if="showNext"
          class="button"
          type="success"
          @click="onNext"
        >
          {{ nextText }}
        </el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog } from 'element-ui'

export default {
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '标题',
    },
    width: {
      type: [String, Number],
      default: 800,
    },
    top: {
      type: [String, Number],
      default: '10%',
    },
    maxHeight: {
      type: String,
      default: 'auto',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showNext: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    confirmText: {
      type: String,
      default: '确认',
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    nextText: {
      type: String,
      default: '继续添加',
    },
  },
  methods: {
    onClose() {
      this.$emit('update:show', false)
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm')
    },
    onNext() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="less" scoped>
.admin-dialog {
  /deep/ .el-dialog {
    border-radius: 8px;
  }

  .title {
    position: relative;
    h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: @darker;
    }
    .btn-close {
      position: absolute;
      top: -10px;
      right: 0px;
      font-size: 31px;
      color: @color-2;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .button-group {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .button {
    width: 100px;
    text-align: center;
    .btn-cancel {
      color: #fff;
      background-color: #c7cad2;
      &:hover {
        background-color: #d8dbe3;
      }
    }
  }
}
</style>

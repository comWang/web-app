<template>
  <div>
    <div class="form-wrapper">
      <Icon
        name="logo"
        size="200"
      />
      <component :is="formType" />
    </div>
  </div>
</template>

<script>
import AccountForm from './AccountForm.vue'

export default {
  components: {
    AccountForm,
  },
  data() {
    return {
      formType: 'AccountForm',
    }
  },
}
</script>

<style lang="less" scoped>
.form-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 560px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px -5px 5px rgba(0, 0, 0, 0.4);
}
</style>

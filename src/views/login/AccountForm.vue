<template>
  <div class="login-form">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      @keyup.enter.native="submit"
    >
      <el-form-item
        label="用户名"
        prop="account"
      >
        <el-input
          v-model.trim="form.account"
          :placeholder="isPreview ? 'admin' : '输入账号'"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model.trim="form.password"
          :placeholder="isPreview ? 'admin' : '输入密码'"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      @click="submit"
    >
      登录
    </el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const rules = {
  account: [
    {
      required: true,
      validator(rule, value, cb) {
        if (/^[0-9A-Za-z]+$/.test(value)) cb()
        else if (!value) cb(new Error('请输入账号'))
        else cb(new Error('账号名只能包含数字和字母'))
      },
    },
  ],
  password: [
    {
      required: true,
      validator(rule, value, cb) {
        if (/^[0-9A-Za-z|-|_|.]+$/.test(value)) cb()
        else if (!value) cb(new Error('请输入密码'))
        else cb(new Error('请填写正确的密码'))
      },
    },
  ],
}

export default {
  data() {
    return {
      rules,
      isPreview: process.env.VUE_APP_MODE === 'preview',
      form: {
        account: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapActions(['login']),
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.login(this.form).then(() => {
            this.$router.push({ path: '/' })
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-form {
  margin: 0 auto;
  width: 80%;
  height: 200px;
}

/deep/ .el-button {
  display: block;
  width: calc(100% - 80px);
  border-radius: 20px;
  transform: translateX(80px);
}
</style>

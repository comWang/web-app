<template>
  <div class="app-header">
    <el-row :gutter="10">
      <el-col
        :span="20"
        :xs="12"
        :sm="16"
      >
        <el-tabs
          v-if="pageList.length"
          v-model="activeName"
          @tab-click="jumpToPage"
        >
          <el-tab-pane
            v-for="page in pageList"
            :key="page.path"
            :label="page.meta.desc"
            :name="page.path"
          />
        </el-tabs>
      </el-col>
      <el-col
        :span="4"
        :xs="12"
        :sm="8"
      >
        <div
          class="tool-bar"
          @click="visible = true"
        >
          <img
            v-if="userInfo && userInfo.avatr"
            :src="userInfo.avatr"
            alt="头像"
          >
          <Icon
            v-else
            name="avatar"
            size="30"
          />
          <p title="注销登录">
            {{ userInfo && userInfo.nickname }}
          </p>
        </div>
      </el-col>
    </el-row>
    <Dialog
      :show.sync="visible"
      width="600px"
      title="注销登录吗？"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Dialog from 'components/Dialog'
import router from '@/router'

export default {
  components: { Dialog },
  data() {
    return {
      router,
      activeName: '',
      visible: false,
    }
  },
  computed: {
    ...mapGetters(['pageList']),
    ...mapState(['userInfo']),
  },
  watch: {
    'router.currentRoute'() {
      this.setActiveTab()
    },
  },
  created() {
    this.setActiveTab()
    this.queryUserInfo()
  },
  methods: {
    ...mapActions(['queryUserInfo', 'logout']),
    setActiveTab() {
      const { currentRoute } = this.$router

      this.activeName = currentRoute.path
    },
    jumpToPage(tab) {
      this.$router.push({ path: tab.name })
    },
    confirmLogout() {
      this.logout()
    },
  },
}
</script>

<style lang="less" scoped>
.app-header {
  box-sizing: border-box;
  padding: 0 20px;
  height: 100%;
  background-color: @light;
  border-bottom: 1px solid #e8e8e8;
  /deep/ .el-tabs {
    margin-top: 5px;
    height: calc(100% - 5px);
  }
  /deep/ .el-tabs__nav-scroll {
    height: 100%;
  }
  /deep/ .el-tabs__nav-wrap {
    height: 100%;
  }
  /deep/ .el-tabs__header {
    box-sizing: border-box;
    margin: 0;
    height: 100%;
  }
  /deep/ .el-tabs__nav {
    height: 100%;
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    display: none;
  }

  /deep/ .el-row,
  .el-col {
    height: 100%;
  }

  .tool-bar {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 30px;
      height: 30px;
      object-fit: cover;
    }

    p {
      margin-left: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #46475e;
    }
  }
}
</style>

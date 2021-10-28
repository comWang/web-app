<template>
  <div class="app-dashboard">
    <p>Logo</p>
    <div class="app-menu">
      <div
        v-for="item in rootMenu"
        :key="item.menuPath"
        :class="['app-menu-item', currentMenuPath === item.menuPath ? 'active' : '']"
        @click="toggleMenuAndJump(item.menuPath)"
      >
        <Icon
          :name="currentMenuPath === item.menuPath ? item.activeIcon : item.icon"
          size="32"
        />
        <div>{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import router from '@/router'

const findLongestMenuPath = (route, path) => {
  let longestMatchedMenuPath = '/'
  const recursiveMatchPath = route => {
    const { menuPath } = route.meta || {}

    if (menuPath && menuPath.length > longestMatchedMenuPath.length && path.includes(menuPath)) {
      longestMatchedMenuPath = menuPath
    }
    if (Array.isArray(route.children)) {
      for (let i = 0; i < route.children.length; i++) {
        recursiveMatchPath(route.children[i])
      }
    }
  }
  recursiveMatchPath(route)
  return longestMatchedMenuPath
}

export default {
  data() {
    return {
      router
    }
  },
  computed: {
    ...mapState(['basicRoutes', 'currentMenuPath']),
    rootMenu() {
      return this.basicRoutes.map(per => per.meta)
    },
  },
  watch: {
    'router.currentRoute'() {
      this.initMenu()
    }
  },
  created() {
    this.initMenu()
  },
  methods: {
    ...mapMutations(['toggleCurrentMenu']),
    toggleMenuAndJump(menuPath) {
      this.toggleCurrentMenu(menuPath)
      this.$router.push({ path: menuPath })
    },
    initMenu() {
      const { path } = this.$router.currentRoute
      const menuPath = findLongestMenuPath(
        {
          children: this.basicRoutes,
        },
        path
      )

      this.toggleCurrentMenu(menuPath)
    },
  },
}
</script>

<style lang="less" scoped>
.app-dashboard {
  box-sizing: border-box;
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background-color: #333;
}

.app-menu {
  width: 100%;
  .app-menu-item {
    margin-top: 50px;
    box-sizing: border-box;
    padding: 5px 0;
    width: 100%;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 12px;
    text-align: center;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: #333;
    &:hover {
      cursor: pointer;
      background-color: #222;
      border-left-color: #222;
    }
    &.active {
      color: @color-1;
      border-left-color: @color-1;
    }
  }
}
</style>

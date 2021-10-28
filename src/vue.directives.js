import Vue from 'vue'

Vue.directive('auth', {
  inserted(el, binding, vnode) {
    const { value, arg } = binding
    const { context } = vnode
    const { meta } = context.$router.currentRoute
    const permissions = meta && meta.permissions

    // value即对应的操作需要的权限，若meta.permissions中已有的权限列表中没有该权限，择删除该节点；
    if (!value || !value.trim()) return
    if (!permissions || !permissions.length || !permissions.includes(value.trim())) {
      if (arg === 'page') {
        context.$router.replace({ path: '/403' })
      } else {
        el.parentNode.removeChild(el)
      }
      
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line
        console.log(`指令警告（v-auth）：部分元素已被移除，因为没有权限${value}`)
      }
    }
  },
})



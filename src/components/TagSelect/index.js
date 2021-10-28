import TagsSelect from './src/main'

const install = (Vue) => {
  if (!Vue || Vue.prototype.$tags) return

  Vue.prototype.$tags = TagsSelect
}

if (window.Vue && !window.Vue.prototype.$tags) {
  window.Vue.use({
    install,
  })
}

export default {
  install,
}
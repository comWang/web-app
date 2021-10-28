import Vue from 'vue'
import tagsSelectVue from './TagsSelect'

Vue.component('tags-select', tagsSelectVue)
const TagsSelectConstructor = Vue.extend(tagsSelectVue)
const instance = new TagsSelectConstructor().$mount()
const TagsSelect = function() {
}

TagsSelect.show = function (option) {
  return instance.open(option)
}

document.body.appendChild(instance.$el)

export default TagsSelect
<template>
  <admin-dialog
    :show.sync="visible"
    title="选择标签"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <div
      v-loading="loading"
      class="admin-tags"
    >
      <el-row
        class="group-list"
        :gutter="20"
      >
        <el-col
          v-for="group in groups"
          :key="group.id"
          :span="4"
        >
          <el-badge
            :value="tagsNumInGroup[group.id]"
            :hidden="!tagsNumInGroup[group.id]"
          >
            <div
              :class="['group', currentGroup && currentGroup === group.id ? 'active' : '']"
              @click="toggleGroup(group.id)"
            >
              {{ group.text }}
            </div>
          </el-badge>
        </el-col>
      </el-row>
      <el-row
        class="tag-list"
        :gutter="10"
      >
        <el-col
          v-for="item in currentTags"
          :key="item.id"
          :span="3"
        >
          <div
            :class="['tag', records[item.id] ? 'active' : '']"
            @click="chooseOrCancel(item)"
          >
            {{ item.text }}
          </div>
        </el-col>
      </el-row>
    </div>
  </admin-dialog>
</template>

<script>
import { Col, Row, Badge } from 'element-ui'
import AdminDialog from '@/components/Dialog'
import request from '@/utils/request'

const ref = {
  resolve: null,
  reject: null,
}
// { id: customIdName}
const mapFields = (data, fieldsMap) => {
  const result = { ...data }
  const customIdField = fieldsMap.id
  const customTextField = fieldsMap.text

  result.id = result[customIdField]
  result.text = result[customTextField]
  return result
}

const mapFieldsReverse = (data, fieldsMap) => {
  const result = { ...data }
  const customIdField = fieldsMap.id || 'id'
  const customTextField = fieldsMap.text || 'text'

  result[customIdField] = result.id || 'id'
  result[customTextField] = result.text || 'text'
  return result
}

const defaultApi = async () => {
  const [err, res] = await request({
    url: '/content/selectTagList',
    method: 'post',
  })
  if (!err) {
    return res.data.map(item => ({
      text: item.tagName,
      id: item.id,
      group: item.groupId,
      groupText: item.groupName,
    }))
  }
  throw err
}

export default {
  name: 'TagsSelect',
  components: { AdminDialog, [Col.name]: Col, [Row.name]: Row, [Badge.name]: Badge },
  data() {
    return {
      multiple: false,
      visible: false,
      tags: null,
      groups: null,
      currentGroup: null,
      selectedTags: null,
      records: {},
      loading: false,
    }
  },
  computed: {
    currentTags() {
      if (!this.tags) return []
      if (this.currentGroup === null) return [...this.tags]
      return this.tags.filter(tag => tag.group === this.currentGroup)
    },
    tagsNumInGroup() {
      const { groups, selectedTags } = this
      const numsRecord = {}

      if (Array.isArray(groups) && Array.isArray(selectedTags)) {
        groups.forEach(group => {
          const groupTags = this.tags.filter(tag => tag.group === group.id)

          groupTags.forEach(gtag => {
            const index = selectedTags.findIndex(stag => stag.id === gtag.id)

            if (index > -1) {
              if (!numsRecord[group.id]) {
                numsRecord[group.id] = 1
              } else {
                numsRecord[group.id]++
              }
            }
          })
        })
      }

      return numsRecord
    },
  },
  methods: {
    toggleGroup(group) {
      if (this.currentGroup === group) this.currentGroup = null
      else this.currentGroup = group
    },
    setTags(tags) {
      if (Array.isArray(tags) && tags.length) {
        const groups = []

        tags.forEach(tag => {
          if (
            tag.group !== undefined &&
            tag.group !== null &&
            !groups.find(item => tag.group === item.id)
          ) {
            groups.push({
              id: tag.group,
              text: tag.groupText,
            })
          }
        })

        this.tags = tags
        if (groups.length) {
          this.groups = groups
          this.currentGroup = groups[0].id
        }
      }
    },
    queryTags(option) {
      const api = option.api || defaultApi

      this.loading = true
      api()
        .then(data => {
          this.setTags(data)
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 200)
        })
    },
    chooseOrCancel(item) {
      let { selectedTags } = this
      const index = selectedTags.findIndex(tag => tag.id === item.id)
      let isActive = null
      // 取消
      if (index > -1) {
        selectedTags.splice(index, 1)
        isActive = false
      } else {
        // 单选
        if (!this.multiple) {
          selectedTags = [item]
          isActive = true
          this.records = {}
        } else {
          // 新增
          selectedTags.push(item)
          isActive = true
        }
      }
      this.$set(this.records, item.id, isActive)
      this.$set(this, 'selectedTags', selectedTags)
    },
    onConfirm() {
      if (typeof ref.resolve === 'function') {
        ref.resolve(this.selectedTags)
      }
    },
    onCancel() {
      if (typeof ref.reject === 'function') {
        ref.reject(new Error('选择已取消'))
      }
    },
    async doActionsByOption(option = {}) {
      const { existedTags, fieldsMap, multiple } = option
      const arr = []

      this.multiple = !!multiple
      if (!this.tag) await this.queryTags(option)
      if (Array.isArray(existedTags) && this.multiple) {
        for (let i = 0; i < existedTags.length; i++) {
          const item = existedTags[i]
          arr.push(fieldsMap ? mapFields(item, fieldsMap) : item)
          this.records[fieldsMap ? mapFields(item, fieldsMap).id : item.id] = true
        }
      }
      this.selectedTags = arr
    },
    revertOriginData(option, arr) {
      if (typeof option === 'object' && option.fieldsMap) {
        return arr.map(item => mapFieldsReverse(item, option.fieldsMap))
      }

      return arr
    },
    clear() {
      this.existedTags = null
      this.records = {}
      this.tags = null
      this.currentGroup = null
      this.groups = null
    },
    open(option) {
      return new Promise((resolve, reject) => {
        this.tags = null
        this.doActionsByOption(option)
        ref.resolve = data => {
          this.visible = false
          const sendData = this.revertOriginData(option, data)

          this.clear()
          resolve(sendData)
        }
        ref.reject = err => {
          this.visible = false
          this.clear()
          reject(err)
        }
        this.visible = true
      })
    },
  },
}
</script>

<style lang="less" scoped>
.admin-tags {
  min-height: 200px;
  /deep/ .el-badge {
    width: 100%;
  }
  .group-list + .tag-list {
    margin-top: 20px;
  }
  .group {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 16px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: #eaeaea;
    &.active {
      color: @color-1;
      border-color: @color-1;
    }
    &:hover {
      cursor: pointer;
      border-color: @color-2;
    }
  }
  .tag {
    box-sizing: border-box;
    width: 100%;
    margin-top: 10px;
    padding: 0 5px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 12px;
    border-radius: 4px;
    color: @dark;
    background-color: @light;
    &:hover {
      cursor: pointer;
      background-color: #eaeaea;
    }
    &.active {
      color: #fff;
      background-color: @color-2;
    }
  }
}
</style>

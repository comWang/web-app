<template>
  <div class="admin-date-picker">
    <div class="picker-option-wrapper">
      <div
        v-for="(option, i) in options"
        :key="i"
        :class="['picker-option', activeIndex === i && 'is-active']"
        @click="onPickerOptionClick(option.value, i)"
      >
        {{ option.label }}
      </div>
    </div>
    <el-date-picker
      v-model="val"
      style="margin-right: 10px"
      type="daterange"
      :picker-options="pickerOptions"
      placeholder="选择日期"
      @change="value => onChange(value, -1)"
    />
    <slot>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="$emit('search')"
      >
        搜索
      </el-button>
    </slot>
  </div>
</template>

<script>
import dayjs from 'dayjs'

const startDate = dayjs('2018-01-01').$d
const endDate = dayjs().subtract(1, 'day').$d

const options = [
  {
    label: '全部',
    value: [startDate, endDate],
  },
  {
    label: '昨天',
    value: [dayjs().subtract(1, 'day').$d, endDate],
  },
  {
    label: '最近七天',
    value: [dayjs().subtract(7, 'day').$d, endDate],
  },
  {
    label: '本月',
    value: [dayjs().startOf('month').$d, endDate],
  },
  {
    label: '上个月',
    value: [
      dayjs()
        .subtract(1, 'month')
        .startOf('month').$d,
      dayjs()
        .subtract(1, 'month')
        .endOf('month').$d,
    ],
  },
  {
    label: '近三个月',
    value: [
      dayjs()
        .subtract(3, 'month')
        .startOf('month').$d,
      dayjs()
        .subtract(1, 'month')
        .endOf('month').$d,
    ],
  },
  {
    label: '近半年',
    value: [
      dayjs()
        .subtract(6, 'month')
        .startOf('month').$d,
      dayjs()
        .subtract(1, 'month')
        .endOf('month').$d,
    ],
  },
  {
    label: '近一年',
    value: [
      dayjs().subtract(12, 'month').startOf('month').$d,
      dayjs()
        .subtract(1, 'month')
        .endOf('month').$d,
    ],
  },
]

export default {
  props: {
    value: {
      type: Array,
      default: null,
    },
    // 仅包含指定的选项，优先级高于exclude
    include: {
      type: Array,
      default: null,
    },
    exclude: {
      type: Array,
      default: null,
    },
    defaultIndex: {
      type: [Number, String],
      default: 1,
    },
    // 传递的值格式化为字符串，否则为Date实例。
    formatted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startDate,
      endDate,
      val: [null, null],
      activeIndex: -1,
      options: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  watch: {
    value() {
      let [start, end] = this.value || []
      if (!start || !end) return
      const startDay = dayjs(start)
      const endDay = dayjs(end)
      const index = this.options.findIndex(option => {
        const [a, b] = option.value
        return startDay.isSame(dayjs(a), 'day') && endDay.isSame(dayjs(b), 'day')
      })
      // 等于快捷选项的值
      if (index > -1) {
        this.onPickerOptionClick(this.value, index)
      } else {
        this.val = [this.parseValue(start), this.parseValue(end)]
        this.activeIndex = -1
      }
    },
  },
  created() {
    const defaultIndex = parseInt(this.defaultIndex, 10)
    if (this.include) {
      this.options = options.filter(item => this.include.includes(item.label))
    } else if (this.exclude) {
      this.options = options.filter(item => !this.exclude.includes(item.label))
    } else {
      this.options = options
    }
    this.onPickerOptionClick(this.options[defaultIndex].value, defaultIndex)
  },
  methods: {
    parseValue(valueStr) {
      return this.formatted ? (valueStr ? dayjs(valueStr).$d : null) : valueStr
    },
    formatValue(value) {
      return this.formatted ? (value ? dayjs(value).format('YYYY-MM-DD') : '') : value
    },
    onPickerOptionClick(value, index) {
      if (this.activeIndex !== index) {
        this.val = null
        this.onChange(value, index, true)
      }
    },
    onChange(value, index, immediatelySearch) {
      let [start, end] = value || []
      if (value === null) {
        this.activeIndex = 0
      }
      if (!isNaN(index)) {
        this.activeIndex = index
      }

      start = this.formatValue(start)
      end = this.formatValue(end)
      this.$emit('change', [start, end])
      this.$emit('update:value', [start, end])
      if (immediatelySearch === true) {
        this.$emit('search', [start, end])
      }
    },
  },
}
</script>

<style lang="less" scoped>
.admin-date-picker {
  display: flex;
  align-items: center;
  .picker-option-wrapper {
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 7px;
    color: #303133;
    font-size: 14px;
    background: #f0f2f5;
    border-radius: 4px;
    /deep/ .picker-option {
      min-width: 77px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
      }
      &.is-active {
        color: @color-1;
        background-color: #fff;
      }
    }
  }
}
</style>

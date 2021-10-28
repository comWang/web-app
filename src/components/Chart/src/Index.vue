<template>
  <div
    class="chart-box"
    :style="chartStyle"
  >
    <p
      v-if="!isLoading && errTips"
      class="err-tips"
    >
      {{ errTips }}
    </p>
    <div
      v-loading="isLoading"
      class="chart-wrapper"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.5)"
    >
      <div
        ref="chart"
        class="chart-instance"
      />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart, BarChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  AxisPointerComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  VisualMapComponent,
  AxisPointerComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
])

const isObject = data => Object.prototype.toString.call(data) === '[object Object]'
// 对象属性会递归更新；数组则直接替换，其内部不做判断。
const mergeOption = (source, target) => {
  if (!isObject(source) || !isObject(target)) return target
  const cloneObj = { ...target }

  Object.keys(source).forEach(key => {
    const newVal = source[key]
    const oldVal = target[key]
    if (isObject(newVal) && isObject(oldVal)) {
      cloneObj[key] = mergeOption(newVal, oldVal)
    } else {
      cloneObj[key] = source[key]
    }
  })

  return cloneObj
}

const colorTheme = {
  default: ['#FF6800', '#80C152', '#FFA400', '#7FBCFF', '#FF9000', '#FFCA6A', '#63983D', '#26C1C9'],
  gradient: [
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: '#F83600',
      },
      {
        offset: 1,
        color: '#F9D423',
      },
    ]),
  ],
}
const colorThemeValidator = colorType => {
  if (Object.keys(colorTheme).includes(colorType)) return true
  return false
}
const defaultCommonOption = {
  legend: { show: true, left: '5%' },
  grid: { left: '5%', right: '5%', bottom: '10%' },
  axisPointer: { show: true },
  tooltip: { show: true, axisPointer: { type: 'line', axis: 'y' } },
}
const defaultSeriesOption = {
  line: {
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: { axisPointer: { show: false } },
    series: [{ type: 'line', seriesLayoutBy: 'row' }],
  },
  bar: {
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: { axisPointer: { show: false } },
    series: [{ type: 'bar', seriesLayoutBy: 'row', barWidth: 16, itemStyle: { borderRadius: 8 } }],
  },
  pie: {
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [{ type: 'pie', seriesLayoutBy: 'row' }],
  },
  ring: {
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        seriesLayoutBy: 'row',
        radius: ['35%', '70%'],
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
          color: '#fff',
        },
      },
    ],
  },
}
// { click: [fn1, fn2,...] }
const eventListeners = {}

export default {
  props: {
    // 用于获取默认的图表配置
    type: {
      // 图表类型
      type: String,
      default: 'line',
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: 300,
    },
    /**
     * 对应echarts的option,在本组件中优先级最高，所有echarts配置均可通过该选项修改。
     * 建议数据通过dataset传，其余配置通过此属性修改。
     */
    option: {
      type: Object,
      default: null,
    },
    // echarts的dataset或者resolved后数据为dataset的promise;
    // 是promise时会自动在加载期间显示loading
    dataset: {
      type: [Object, Promise],
      default: null,
    },
    colorTheme: {
      validator: colorThemeValidator,
      default: 'default',
    },
  },
  data() {
    return {
      chart: null,
      optionChanged: false,
      isLoading: false,
      errTips: '无数据',
      options: defaultCommonOption,
      registeredEventTypes: [],
    }
  },
  computed: {
    chartStyle() {
      const { width, height } = this
      const widthStr = isNaN(width) ? width : width + 'px'
      const heightStr = isNaN(height) ? height : height + 'px'
      return `width: ${widthStr};height: ${heightStr};`
    },
  },
  watch: {
    dataset() {
      this.updateDataset()
    },
    option() {
      this.optionChanged = true
      this.renderChart()
    },
  },
  created() {
    this.options.color = colorTheme[this.colorTheme]
    const seriesOption = defaultSeriesOption[this.type]
    if (seriesOption) {
      this.options = { ...this.options, ...seriesOption, ...this.option }
    }
    this.updateDataset()
  },
  mounted() {
    this.renderChart()
  },
  beforeDestroy() {
    this.dropChart()
  },
  methods: {
    isEmpty(dataset, option) {
      const { series } = option || this.option || {}
      const { source } = dataset || this.dataset || {}
      if ((!source || !source.length) && (!series || !series.data || !series.data.length)) {
        return true
      }
      return false
    },
    onChartEventTrigger(eventType, params) {
      eventListeners[eventType].forEach(listener => {
        if (typeof listener === 'function') {
          listener(params)
        }
      })
    },
    registerEvents() {
      const eventTypes = Object.keys(eventListeners)
      eventTypes
        .filter(eventType => !this.registeredEventTypes.includes(eventType))
        .forEach(eventType => {
          this.chart.on(eventType, (...rest) => this.onChartEventTrigger(eventType, ...rest))
          this.registeredEventTypes.push(eventType)
        })
    },
    // 组件外部通过ref调用该方法
    addEventListener(type, listener) {
      if (!eventListeners[type]) {
        eventListeners[type] = []
      }
      eventListeners[type].push(listener)
    },
    updateDataset() {
      this.errTips = null
      if (this.dataset instanceof Promise) {
        this.isLoading = true
        this.dataset
          .then(dataset => {
            if (this.isEmpty(dataset)) {
              this.errTips = '暂无数据'
            } else {
              this.errTips = null
              this.options = mergeOption(
                {
                  dataset,
                },
                this.options
              )
              this.renderChart()
            }
          })
          .catch(err => {
            this.errTips = err.message
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, 200)
          })
      } else if (!this.isEmpty()) {
        this.options = mergeOption(
          {
            dataset: this.dataset,
          },
          this.options
        )
        this.renderChart()
      }
    },
    dropChart() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
    },
    initChart(cb) {
      if (this.chart) {
        try {
          this.chart.clear()
          if (typeof cb === 'function') {
            cb()
          }
        } catch (err) {
          this.$debug && this.$debug.error(err)
        }
      } else {
        const node = this.$refs.chart
        if (node) {
          this.chart = echarts.init(node)
          this.addEventListener('click', params => this.$emit('chart-click', params))
          this.registerEvents()
          if (typeof cb === 'function') {
            cb()
          }
        } else {
          this.$nextTick(() => {
            this.initChart(cb)
          })
        }
      }
    },
    renderChart() {
      if (!this.chart) {
        this.initChart(this.renderChart)
        return
      }
      if (this.option && this.optionChanged) {
        this.options = mergeOption(this.option, this.options)
      }
      try {
        this.chart.setOption(this.options)
      } catch (err) {
        // eslint-disable-next-line
        console.error('可能是错误的图表配置：' + err.message)
      } finally {
        this.optionChanged = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
.chart-box {
  position: relative;
  .err-tips {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 1.8;
    color: #909399;
    background-color: #fafafa;
  }
  .chart-wrapper {
    width: 100%;
    height: 100%;
    .chart-instance {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

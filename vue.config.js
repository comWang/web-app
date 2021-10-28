const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isPreview = process.env.VUE_APP_MODE === 'preview'
const vueConfig = {
  publicPath: './',
  devServer: {
    port: 3000,
    proxy: {
      [process.env.VUE_APP_API_BASE_URL]: {
        pathRewrite: { [`^${process.env.VUE_APP_API_BASE_URL}`]: '' },
        target: 'http://api.website.com',
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        // eslint-disable-next-line
        prependData: "@import '@/styles/color.less';",
      },
    },
  },
  productionSourceMap: false,
  lintOnSave: 'warning',
  chainWebpack: config => {
    config.resolve.alias
      .clear()
      .set('@', path.resolve(__dirname, './src'))
      .set('components', path.resolve(__dirname, './src/components'))

    config.plugin('mini-css-extract').use(MiniCssExtractPlugin, [
      {
        // 开发模式下不使用该插件的loader，因此只需设置生成环境下配置
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css',
      },
    ])
    config.plugin('html').tap(args => {
      // 单页只有一个实例配置
      args[0].title = require('./package.json').description

      return args
    })

    config.module
      .rule('svg')
      // 用于icon的svg使用下面的规则
      .exclude.add(path.resolve(__dirname, 'src/assets/icons'))
    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, 'src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        configFile: path.resolve(__dirname, './.svgo.config.js'),
      })
      .end()
    const cssNormalRule = config.module.rule('less').oneOf('normal')
    cssNormalRule.uses.clear()
    cssNormalRule
      .use(isProd ? 'mini-css-extract-loader' : 'vue-style-loader')
      .loader(isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .end()

    const splitChunks = config.optimization.get('splitChunks')
    const cacheGroups = {
      lib: {
        name: 'lib',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      core: {
        name: 'core',
        test: /[\\/]node_modules[\\/](vue|vuex|vue-router|axios)/,
        priority: 0,
      },
      utils: {
        name: 'utils',
        test: /[^(node_modules)][\\/]src[\\/]/,
        priority: 0,
        reuseExistingChunk: true,
      },
      components: {
        name: 'components',
        test: /[^(node_modules)][\\/]src[\\/]components/,
        priority: 10,
      },
      'components-style': {
        name: 'components-style',
        test: /[^(node_modules)][\\/]src[\\/]components[\\/].+\.css$/,
        priority: 20,
      },
    }

    config.optimization.splitChunks({
      ...splitChunks,
      cacheGroups,
    })
  },
}
if (!isProd && isPreview) {
  // 启动mock middleware，最终请求将优先使用mock-api的响应
  vueConfig.devServer.before = require('./src/mock/mock-server')
}
module.exports = vueConfig

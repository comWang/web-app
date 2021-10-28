const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const chalk = require('chalk')
const bodyParser = require('body-parser')

// eslint-disable-next-line
const log = console.log
// file change throttled time
const delay = 600
const apiFilesDir = path.resolve(__dirname, '../mock-api')
const requireDirFilesSync = function(dir) {
  const apiModules = []
  const error = null
  try {
    const files = fs.readdirSync(dir)
    files.forEach(filename => {
      if (/\.(j|t)s$/.test(filename)) {
        const currentModule = require(path.resolve(dir, filename))

        apiModules.push(currentModule)
      } else {
        const [err, subModules] = requireDirFilesSync(path.resolve(dir, filename))
        if (!err) {
          apiModules.push(...subModules)
        } else {
          throw err
        }
      }
    })

    return [error, apiModules]
  } catch (err) {
    return [err, null]
  }
}
const registerRoutes = function registerRoutes(app) {
  const [err, apiModules] = requireDirFilesSync(apiFilesDir)
  const routesLengthBeforeRegister = app._router.stack.length
  let registeredRoutesLength = 0

  if (!err) {
    apiModules.forEach(currentModule => {
      Object.keys(currentModule).forEach(key => {
        const api = currentModule[key]
        const { url, response, method = 'get' } = api

        app[method.toLowerCase()](url, (req, res) => {
          const responseContent = typeof response === 'function' ? response(req) : response

          res.send(responseContent)
        })
        registeredRoutesLength++
      })
    })
  } else {
    log(chalk.redBright(err))
  }

  return [routesLengthBeforeRegister, registeredRoutesLength]
}
const clearAPIModuleCache = function() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(apiFilesDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

const handler = app => {
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  let timer = null
  let [originLen, extraLen] = registerRoutes(app)
  log(chalk.greenBright('\n Mock server is ready!'))
  chokidar
    .watch(apiFilesDir, {
      ignoreInitial: true,
    })
    .on('all', (event, filePath) => {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        if (event === 'change' || event === 'add') {
          try {
            // 清理过期路由
            app._router.stack.splice(originLen, extraLen)
            clearAPIModuleCache()

            const [a, b] = registerRoutes(app)
            originLen = a
            extraLen = b
            log(chalk.greenBright(`\n Mock Server reloaded！File path： ${filePath}`))
          } catch (error) {
            log(chalk.redBright(error))
          }
        }
        timer = null
      }, delay)
    })
}

module.exports = handler

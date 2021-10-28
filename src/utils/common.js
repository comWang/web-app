export const debounce = (fn, env = null, delay = 15) => {
  let start = null

  return function(...rest) {
    if (start) {
      const canRun = new Date() - start >= delay

      if (canRun) {
        fn.apply(env, rest)
        start = new Date()
      }
    } else {
      fn.apply(env, rest)
      start = new Date()
    }
  }
}

/**
 * 
 * @param {Function} fn 
 * @param {Object} env 
 * @param {number} delay 
 * @param {boolean} isImmediate 
 * @returns {Function}
 */
// eslint-disable-next-line
export const throttle = (fn, env = null, delay = 15, isImmediate = false) => {
  let timer = null
  let isCalled = false

  return function(...rest) {
    if (timer) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(env, rest)
        isCalled = false
        timer = null
      }, delay)
    } else {
      if (!isCalled && isImmediate) {
        fn.apply(env, rest)
        isCalled = true
      } else {
        timer = setTimeout(() => {
          fn.apply(env, rest)
          isCalled = false
          timer = null
        }, delay)
      }
      
    }
  }
}

export const throttleFrame = (fn, env = null) => {
  let timer = null

  return function(...rest) {
    if (timer) cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      fn.apply(env, rest)
      timer = null
    })
  }
}

export const elegantPromise = promise => {
  return new Promise(resolve => {
    promise.then(data => resolve([null, data])).catch(err => resolve([err, null]))
  })
}

export const filterEmptyProps = data => {
  if (typeof data !== 'object') return data
  const keys = Object.keys(data)

  if (keys.length) {
    keys.forEach(key => {
      const value = data[key]

      if (value === undefined || value === null || value === '') delete data[key]
    })
  }

  return data
}

export const toCamelCase = str => str.replace(/-\w/g, match => match.split('')[1].toUpperCase())
export const toKebabCase = str =>
  str.replace(/[a-z][A-Z]/g, match =>
    match
      .split('')
      .map(item => item.toLowerCase())
      .join('-')
  )



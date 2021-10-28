/**
 * @description 为数字四舍五入并转化为附带千分符的字符串
 * @param {number|string} value - 需要被格式化的数字/类数字字符串
 * @param {number} precision - 存在小数位时需要保留的位数（结尾0会被省略）
 * @param {string} placeholder - 不能格式化时（例如null, undefined）的占位符
 * @return {string} formatted digits
 */
 export const formatNum = (value, precision = 2,placeholder = '--') => {
  if (isNaN(parseFloat(value))) return placeholder
  if (parseFloat(value) === Infinity) return '无穷大'
  if (parseFloat(value) === -Infinity) return '无穷小'
  if (precision < 0) precision = 2
  const number = parseFloat(value)
  const arr = []
  const signal = number >= 0 ? '' : '-'

  let [intPart, floatPart] = (number + '').replace(/-/, '').split('.')

  while(intPart.length > 3) {
    arr.unshift(intPart.slice(-3, intPart.length))
    intPart = intPart.slice(0, intPart.length - 3)
  }
  const intDigits = [intPart].concat(arr).join(',')
  const scale = Math.pow(10, precision)
  const floatNumber = floatPart
  ? Math.round(floatPart / Math.pow(10, floatPart.length) * scale) / scale 
  : null
  const floatDigits = floatNumber === null 
  ? '' 
  : floatNumber === 0 
  ? Array.from({ length: precision }).map(() => 0).join('')
  : (floatNumber + '').split('.')[1]
  const floatDot = floatPart ? precision !== 0 ? '.' : '' : ''

  return `${signal}${intDigits}${floatDot}${floatDigits}`
}

/**
 * @description 四舍五入数字，默认保留2位小数
 * @param {any} value - 需要被格式化的数字/类数字字符串
 * @param {number} precision - 存在小数位时需要保留的位数（结尾0会被省略）
 * @param {string} placeholder - 不能格式化时（例如null, undefined）的占位符
 * @return {number} round number
 */
export const round = (value, precision = 2,placeholder = '--') => {
  if (isNaN(parseFloat(value))) return placeholder
  if (parseFloat(value) === Infinity) return '无穷大'
  if (parseFloat(value) === -Infinity) return '无穷小'
  if (precision < 0) precision = 2
  const number = parseFloat(value)
  const scale = Math.pow(10, precision)
  return Math.round(number * scale) / scale
}


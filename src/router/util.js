// 只解决 /a/b/c、 ./a/b/c 和 a/b/c这种形式
// 假设给出的路径最后不带/
export const resolvePath = (parentPath, path) => {
  if (!parentPath) return path
  // 绝对路径
  if (path.indexOf('/') === 0) return path
  if (path.indexOf('./') === 0) {
    return parentPath + path.slice(2, path.length)
  }
  if (parentPath.indexOf('/') === parentPath.length - 1) {
    return parentPath + path
  }

  return parentPath + '/' + path
}

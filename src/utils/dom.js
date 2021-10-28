export const chooseFiles = (() => {
  const invisibleInput = document.createElement('input')
  let onChange = null

  invisibleInput.type = 'file'
  invisibleInput.setAttribute('multiple', true)
  return () =>
    new Promise(resolve => {
      onChange = e => {
        resolve([...e.target.files])
      }

      invisibleInput.click()
      invisibleInput.addEventListener('change', onChange)
    }).finally(() => {
      invisibleInput.removeEventListener('change', onChange)
      invisibleInput.value = null
    })
})()
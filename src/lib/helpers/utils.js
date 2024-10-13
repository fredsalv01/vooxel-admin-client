export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getValueFromFieldFormik(arr, str) {
  if (str.length === 0) {
    return
  }
  const path = str.split('.')
  let result = arr
  for (let i = 0; i < path.length; i++) {
    if (result && typeof result[path[i]] !== 'undefined') {
      result = result[path[i]] ?? ''
    } else {
      result = ''
      break
    }
  }
  return result ?? ''
}

export function setPropsItem(editItem, arr = {}) {
  for (const key in editItem) {
    if (Object.hasOwnProperty.call(editItem, key)) {
      const element = editItem[key]
      if (!!element) {
        if (key === 'bankAccount') {
          console.log(typeof element)
        }
        if (typeof element === 'object') {
          setPropsItem(element)
        } else {
          arr[key] = element
        }
      }
    }
  }
  return arr
}

// Debounce function
export function debounce(func, delay) {
  let timer
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// convert string to number with to decimals

export function stringToNumber(str, decimals = 2) {
  if (str === '') return 0
  const number = parseFloat(str)
  return parseFloat(number.toFixed(decimals))
}

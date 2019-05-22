
/**
 * @returns {string}
 */
function getRandomString () {
  const string = Math.random().toString(36).substr(2)

  let result = ''

  for (let i = 0, len = string.length; i < len; i++) {
    let char = string.charAt(i)

    if (Math.random() > 0.5) {
      result += char.toUpperCase()
    } else {
      result += char
    }
  }

  return result
}

/**
 * @param length
 *
 * @returns {string}
 */
export default function (length = 16) {
  if (length <= 0) {
    return ''
  }

  let string = ''

  while (1) {
    string += getRandomString()

    if (string.length >= length) {
      break
    }
  }

  return string.substr(0, length)
}

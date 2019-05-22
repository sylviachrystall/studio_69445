'use strict'

export default string => {
  // if only one word, then return
  if (string.indexOf(' ') === -1) {
    return string
  }

  // otherwise split into words, then truncate and join them
  return string
    .split(/\s+/)
    .map(word => word.substring(0, 3))
    .join('')
}

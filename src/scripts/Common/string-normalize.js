'use strict'

export default string => {
  if (typeof string !== 'string') {
    return ''
  }

  return string
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

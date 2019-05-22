'use strict'

// https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
// https://github.com/hemanth/is-iterable/issues/10
function isIterable (object) {
  if (object == null) {
    return false
  }

  // modern iterator
  if (typeof object[Symbol.iterator] === 'function') {
    return true
  }

  // legacy iterator
  return typeof object['@@iterator'] === 'function'
}

module.exports = (context, options) => {
  let ret = ''

  if (isIterable(context)) {
    for (let value of context) {
      ret = ret + options.fn(value)
    }
  }

  return ret
}

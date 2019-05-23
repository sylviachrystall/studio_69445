'use strict'

const studio = require('./studio')

const START = 2015
const END = new Date().getUTCFullYear()
const RANGE = `${START}-${END}`

module.exports = {
  start: START,
  end: END,
  range: RANGE,
  banner: `EPLA (c) ${RANGE} ${studio.owner}`
}

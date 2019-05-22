'use strict'

const semver = require('semver')

// process the passed version number
const arg = process.argv[process.argv.length - 1] || ''
const version = arg.substring(2)

module.exports = () => {
  // check version validity
  if (semver.valid(version) === null) {
    throw Error(`Version is invalid, got: "${version}".`)
  }

  return version
}

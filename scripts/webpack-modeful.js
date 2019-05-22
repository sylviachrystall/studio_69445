'use strict'

const production = process.argv.includes('--mode=production')

module.exports = {
  get inDevelopment () { return !production },
  get inProduction () { return production },
  whenDevelopment: (...entries) => { return !production ? entries : [] },
  whenProduction: (...entries) => { return production ? entries : [] }
}

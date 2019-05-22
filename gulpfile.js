'use strict'

const gulp = require('gulp')
const circleci = require('is-circleci')
const del = require('del')
const run = require('execa')
const delay = require('delay')
const axios = require('axios')
const url = require('url')
const path = require('path')
const getVersion = require('./scripts/getVersion')

const DIST = path.join(__dirname, '/dist')

/**
 * Returns an URL without its protocol and separator.
 *
 * @param {string} urlString - The URL to use and process.
 *
 * @returns {string} The URL without the protocol and the separator.
 */
function withoutProtocol (urlString) {
  const url_ = url.parse(urlString)
  const protocol = url_.protocol

  // remove protocol if present
  if (urlString.indexOf(protocol) === 0) {
    // the '+ 2' is for the '//' separator
    urlString = urlString.substring(protocol.length + 2)
  }

  return urlString
}

// check CI environment
if (!circleci) {
  throw Error('Script can be executed only in CircleCI.')
}

gulp.task('release:clear-dist', async () => {
  await del(DIST)
})

gulp.task('release:clone-repo', async () => {
  // check token
  const token = process.env.GH_TOKEN

  if (!token) {
    throw Error('GitHub token is not present.')
  }

  const repo = require('./package.json').repository.url
  const url = `https://${token}@${withoutProtocol(repo)}`

  // clone repository into the dist directory
  await run('git', ['clone', '-b', 'dist', '--single-branch', url, DIST])
})

gulp.task('release:create-content', async () => {
  // check branch
  const { stdout } = await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: DIST })

  if (stdout !== 'dist') {
    throw Error(`Branch must be 'dist', got: '${stdout}'.`)
  }

  // clean branch
  // delete all files and dirs (inlcuding dotfiles and ditdirs),
  // except .circleci dir, .git dir and README.md
  await del(['**', '.*', '!.circleci', '!.git', '!README.md'], { cwd: DIST })

  const version = getVersion()

  // build scripts
  await run('npm', ['run', 'build', '--', `--${version}`])

  // copy necessary files
  await gulp
    .src('LICENSE.md')
    .pipe(gulp.dest(DIST))

  // wait for a while for the files to be completely copied
  await delay(2500)

  // commit files with next version
  await run('git', ['add', '.'], { cwd: DIST })
  await run('git', ['commit', '-m', `chore(release): ${version}`], { cwd: DIST })
})

gulp.task('release:push-repo', async () => {
  // push content to remote repository
  await run('git', ['push', '-u', 'origin', 'dist'], { cwd: DIST })
})

gulp.task('release:purge-cache', async () => {
  // wait for a while
  await delay(2500)

  // purge jsDelivr cache
  await axios('https://purge.jsdelivr.net/gh/sinenonymous/studio_69445@dist/scripts.js')
})

gulp.task('release', gulp.series(
  'release:clear-dist',
  'release:clone-repo',
  'release:create-content',
  'release:push-repo',
  'release:purge-cache',
  'release:clear-dist'
))

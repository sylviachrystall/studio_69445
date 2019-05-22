'use strict'

const gulp = require('gulp')
const circleci = require('is-circleci')
const del = require('del')
const run = require('execa')
const delay = require('delay')
const axios = require('axios')
const url = require('url')
const path = require('path')
const getVersion = require('./getVersion')

const ROOT = path.join(__dirname, '/../')
const DIST = path.join(ROOT, '/dist')

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

/**
 * Removes the dist remote from the list of git remotes.
 *
 * @param {string} remote - The name of the remote to remove.
 */
async function removeRemote (remote) {
  try {
    await run('git', ['remote', 'remove', remote])
  } catch (error) {
    // noop
  }
}

/**
 * Returns the CDN purge root.
 *
 * @returns {string} The CDN purge root.
 */
function getCdnPurgeRoot () {
  const repoUrl = require('../package.json').repository.url
  const data = url.parse(repoUrl).path.replace(/^\/(.*?)\/(.*?).git$/, '$1|$2').split('|')
  const user = data[0]
  const repo = data[1]

  return `https://purge.jsdelivr.net/gh/${user}/${repo}@latest`
}

// check CI environment
if (!circleci) {
  throw Error('Script can be executed only in CircleCI.')
}

gulp.task('release:clear-dist', async () => {
  await del(DIST, { force: true })
})

gulp.task('release:prepare-repo', async () => {
  // check token
  const token = process.env.GH_TOKEN

  if (!token) {
    throw Error('GitHub token is not present.')
  }

  // remove dist remote
  await removeRemote('dist')

  const repo = require('../package.json').repository.url
  const url = `https://${token}@${withoutProtocol(repo)}`

  // add dist remote
  await run('git', ['remote', 'add', 'dist', url])
})

gulp.task('release:create-content', async () => {
  const version = getVersion()

  // build scripts
  await run('npm', ['run', 'build', '--', `--${version}`])

  // wait for a while for the files to be completely written to the disk
  await delay(2500)

  // commit files with next version
  await run('git', ['add', '-f', 'dist'], { cwd: ROOT })
  await run('git', ['commit', '-m', `chore(release): ${version}`], { cwd: ROOT })
})

gulp.task('release:push-repo', async () => {
  // push content to remote repository
  await run('git', ['push', '-u', 'dist', 'master'], { cwd: ROOT })

  // remove dist remote
  await removeRemote('dist')
})

gulp.task('release:purge-cache', async () => {
  // wait for a while
  await delay(2500)

  // purge CDN cache
  await axios(getCdnPurgeRoot() + '/dist/scripts.js')
})

gulp.task('release', gulp.series(
  'release:clear-dist',
  'release:prepare-repo',
  'release:create-content',
  'release:push-repo',
  'release:purge-cache',
  'release:clear-dist'
))

import data from '../../data'
import ImageBox from './ImageBox'
import normalize from '../Common/string-normalize'
import crush from '../Common/string-crush'

/**
 * @typedef {Object} StudioOptions
 *
 * @property {string} studioId
 * @property {string} baseUrl
 * @property {string} assetUrl
 * @property {string} categoryUrl
 */

class Studio {
  /**
   * @param {StudioOptions} options
   */
  init (options) {
    this._html = $('html')

    this._studioId = options.studioId
    this._baseUrl = options.baseUrl
    this._assetUrl = options.assetUrl
    this._categoryUrl = options.categoryUrl
  }

  hasMarker (className) {
    return this._html.hasClass(className)
  }

  addMarker (className) {
    return this._html.addClass(className)
  }

  getBaseUrl () {
    return this._baseUrl
  }

  getId () {
    return this._studioId
  }

  getStoreUrl () {
    return this.getBaseUrl() + '/' + this.getId()
  }

  getAssetUrl (url) {
    return this._assetUrl + '/' + this.getId() + '/images/' + url
  }

  getCategoryUrl (category) {
    category = category.toUpperCase()
    category = category.replace(/\s+/g, '+')

    return this._categoryUrl + '/' + category
  }

  addCategories () {
    for (let [mainCategory, entries] of Object.entries(data.categories)) {
      const container = this._html.find(`.categories-${mainCategory}`)

      entries.forEach(category => {
        const image = new ImageBox()

        image.setText(category.text)
        image.setClass(crush(normalize(category.text)))
        image.setSource(category.image)

        if (category.category === false) {
          image.setCategory(false)
        } else {
          image.setCategory(category.category ? category.category : normalize(category.text))
        }

        container.append(image.getElement())
      })
    }
  }

  handleEmailAddress () {
    $('.emailto').on('click', event => {
      const link = $(event.currentTarget)

      let email = link.data('email')

      if (!email) {
        console.log('Email data were not specified.')
        return false
      }

      email = 'mailto:' + email

      let subject = link.data('subject')

      if (subject) {
        subject = '?subject=' + subject
      } else {
        subject = ''
      }

      window.location = email + subject

      return false
    })
  }
}

const singleton = new Studio()

singleton.STUDIO_LOADED = 'studio-loaded'
singleton.STUDIO_VERSION = 'studio-version-' + __VERSION__

export default singleton

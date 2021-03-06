import Studio from '../Studio'

class ImageBox {
  /**
   *
   */
  constructor () {
    this._class = null
    this._text = null
    this._src = null
    this._category = null
  }

  /**
   * @returns {string}
   */
  getClass () {
    return this._class
  }

  /**
   * @param {string} class_
   *
   * @returns {ImageBox}
   */
  setClass (class_) {
    if (!class_) {
      class_ = null
    }

    this._class = class_

    return this
  }

  /**
   * @returns {string}
   */
  getText () {
    return this._text
  }

  /**
   * @param {string} text
   *
   * @returns {ImageBox}
   */
  setText (text) {
    if (!text) {
      text = null
    }

    this._text = text

    return this
  }

  /**
   * @returns {boolean}
   */
  hasSource () {
    return this._src !== null
  }

  /**
   * @returns {string}
   */
  getSource () {
    return this._src
  }

  /**
   * @param {string|null} src
   *
   * @returns {ImageBox}
   */
  setSource (src) {
    if (src) {
      this._src = Studio.getAssetUrl(src)
    } else {
      this._src = null
    }

    return this
  }

  /**
   * @returns {boolean}
   */
  hasCategory () {
    return this._category !== null
  }

  /**
   * @returns {string}
   */
  getCategory () {
    return this._category
  }

  /**
   * @param {string|null} link
   *
   * @returns {ImageBox}
   */
  setCategory (link) {
    if (link) {
      this._category = Studio.getCategoryUrl(link)
    } else {
      this._category = null
    }

    return this
  }

  getElement () {
    let category = Studio.getStoreUrl()

    if (this.hasCategory()) {
      category = this.getCategory()
    }

    const container = $('<a/>', {
      class: 'image-box ' + this.getClass(),
      href: category,
      target: '_blank'
    })

    let image = $()

    if (this.hasSource()) {
      image = $('<img/>', {
        class: 'image',
        src: this.getSource()
      })
    }

    const label = $('<div/>', {
      class: 'label',
      html: this.getText()
    })

    container.append(image, label)

    return container
  }
}

export default ImageBox

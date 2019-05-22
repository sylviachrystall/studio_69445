
import Asset from './Asset'
import styles from '../../styles/index.sass'

class StyleAsset extends Asset {
  load () {
    const style = document.createElement('style')
    const source = styles.toString()

    style.type = 'text/css'

    if (style.styleSheet) {
      style.styleSheet.cssText = source
    } else {
      style.appendChild(document.createTextNode(source))
    }

    const head = Asset.getHead()

    head.appendChild(style)
  }
}

export default new StyleAsset()

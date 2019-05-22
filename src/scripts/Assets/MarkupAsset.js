
import Asset from './Asset'
import markup from '../../markup/index.hbs'

class MarkupAsset extends Asset {
  load () {
    const container = $('.topStudioHTML')

    // Remove jScrollPane
    container.find('.scrollBox').remove()
    container.append(markup())
  }
}

export default new MarkupAsset()


import Asset from './Asset';


const __CONTENT = '<<<< inject-markup markup-end >>>>';


class MarkupAsset extends Asset
{

    load()
    {
        const container = $('.topStudioHTML');

        // Remove jScrollPane
        container.find('.scrollBox').remove();
        container.append(__CONTENT);
    }
}


export default new MarkupAsset();

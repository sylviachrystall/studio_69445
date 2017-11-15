
import Asset from './Asset';


const __CONTENT = '<<<< inject-styles styles-end >>>>';


class StyleAsset extends Asset
{

    load()
    {
        const style = document.createElement('style');

        style.type = 'text/css';

        if (style.styleSheet){
            style.styleSheet.cssText = __CONTENT;
        } else {
            style.appendChild(document.createTextNode(__CONTENT));
        }

        const head = Asset.getHead();

        head.appendChild(style);
    }
}


export default new StyleAsset();

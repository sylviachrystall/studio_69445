
import StyleAsset  from '../Assets/StyleAsset';
import MarkupAsset from '../Assets/MarkupAsset';
import Studio      from '../Studio';

import {

    uid

} from '../Common';


const __LOADED_INDICATOR = '___' + uid(32) + 'Loaded';
const __EXTERNAL_ACCESS_HANDLE = '___' + uid(32) + 'StudioApp';


class App
{

    constructor()
    {
        // noop
    }


    isLoaded()
    {
        return !!window[__LOADED_INDICATOR];
    }


    init()
    {
        if ( ! this.isLoaded() ) {
            const intervalId = setInterval(
                () => {
                    if (typeof window.jQuery === 'function') {
                        clearInterval(intervalId);

                        $(() => {
                            this._loadAssets();
                            this._loadStudio();
                        });
                    }
                },
                15
            );

            //this._addScriptTag();
        }

        window[__LOADED_INDICATOR] = true;
    }


    /*
    _addScriptTag()
    {
        const script = document.createElement('script');

        script.setAttribute('type', 'text/javascript');
        script.appendChild(document.createTextNode(`window['${__EXTERNAL_ACCESS_HANDLE}']();`));

        document.body.appendChild(script);
    }
    */


    _loadAssets()
    {
        StyleAsset.load();
        MarkupAsset.load();
    }


    _loadStudio()
    {
        Studio.init({
            studioId    : '69445',
            baseUrl     : 'https://www.clips4sale.com',
            assetUrl    : 'https://studio.clips4sale.com/accounts150',
            categoryUrl : 'https://www.clips4sale.com/studio/69445/sylvia-chrystall/Cat0-AllCategories/Page1/SortBy-bestmatch/Limit10/search',
        });

        Studio.addCategories();
        Studio.handleEmailAddress();
        Studio.addMarker(Studio.STUDIO_LOADED);
    }
}


export default new App();


import {

    uid

} from '../Common';


const __EXTERNAL_ACCESS_HANDLE = '___' + uid(32) + 'StudioApp';


class App
{

    constructor()
    {
        // noop
    }


    init()
    {
        window[__EXTERNAL_ACCESS_HANDLE] = () => {
            console.log('new app inited');

            if (typeof window.jQuery === 'function') {
                console.log('jQuery present', jQuery().jquery);
            } else {
                console.log('jQuery is not present');
            }
        };

        this._addScriptTag();
    }


    load()
    {
        // console.log('load app');
    }


    _addScriptTag()
    {
        const script = document.createElement('script');

        script.setAttribute('type', 'text/javascript');
        script.appendChild(document.createTextNode(`window.${__EXTERNAL_ACCESS_HANDLE}();`));

        document.body.appendChild(script);
    }
}


export default new App();

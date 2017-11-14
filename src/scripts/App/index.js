
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


    isInitialized()
    {
        return this._isInitialized === true;
    }


    init()
    {
        window[__EXTERNAL_ACCESS_HANDLE] = () => {
            console.log('new app inited');

            /*
            if (typeof window.jQuery === 'function') {
                console.log('jQuery present', jQuery().jquery);
            } else {
                console.log('jQuery is not present');
            }
            */
            

            const timeout = Date.now();

            const intervalId = setInterval(
                () => {
                    console.log('check');

                    if (typeof window.jQuery === 'function') {
                        console.log('jQuery is present', jQuery().jquery);
                        clearInterval(intervalId);
                    }

                    if (Date.now() - timeout > 15000) {
                        console.log('check timed out');
                        clearInterval(intervalId);
                    }
                },
                15
            );
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

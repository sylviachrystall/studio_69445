

class Asset
{

    constructor()
    {
        // noop
    }


    load()
    {

    }
}


Asset.getHead = function()
{
    if ( ! this.__head) {
        this.__head = document.head || document.getElementsByTagName('head')[0];
    }

    return this.__head;
};


export default Asset;

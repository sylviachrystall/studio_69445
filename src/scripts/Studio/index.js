

import ImageBox from './ImageBox';


class Studio
{

    constructor()
    {
        // noop
    }


    /**
     * @typedef {Object} StudioOptions
     *
     * @property {string} studioId
     * @property {string} baseUrl
     * @property {string} assetUrl
     * @property {string} categoryUrl
     */


    /**
     * @param {StudioOptions} options
     */
    init(options)
    {
        this._html = $('html');

        this._studioId    = options.studioId;
        this._baseUrl     = options.baseUrl;
        this._assetUrl    = options.assetUrl;
        this._categoryUrl = options.categoryUrl;
    }


    hasMarker(className)
    {
        return this._html.hasClass(className);
    }


    addMarker(className)
    {
        return this._html.addClass(className);
    }


    getBaseUrl()
    {
        return this._baseUrl;
    }


    getId()
    {
        return this._studioId;
    }


    getStoreUrl()
    {
        return this.getBaseUrl() + '/' + this.getId();
    }


    getAssetUrl(url)
    {
        return this._assetUrl + '/' + this.getId() + '/images/' + url;
    }


    getCategoryUrl(category)
    {
        category = category.toUpperCase();
        category = category.replace(/\s+/g, '+');

        return this._categoryUrl + '/' + category;
    }


    addCategories()
    {
        const containerTop    = $('.categories-top'),
              containerBottom = $('.categories-bottom'),
              containerBack   = $('.categories-back');

        /**
         * @type {ImageBox[]}
         */
        const categoriesTop = [
            ImageBox.create()
                .setText('Blowjobs')
                .setCategory('blow jobs')
                .setSource('cat_blowjobs_000.jpg')
                ,
            ImageBox.create()
                .setText('Bondage')
                .setCategory('bondage sex')
                .setSource('cat_bondage_000.jpg')
                ,
            ImageBox.create()
                .setText('Facials')
                .setSource('cat_facials_000.jpg')
                ,
            ImageBox.create()
                .setText('Female Domination')
                .setClass('femdom')
                .setSource('cat_female_domination_000.jpg')
                ,
            ImageBox.create()
                .setText('Footjobs')
                .setSource('cat_footjobs_000.jpg')
                ,
            ImageBox.create()
                .setText('Fucking')
                .setSource('cat_fucking_000.jpg')
                ,
            ImageBox.create()
                .setText('Glove Fetish')
                .setClass('glofet')
                .setSource('cat_glove_fetish_000.jpg')
                ,
            ImageBox.create()
                .setText('Handjobs')
                .setSource('cat_handjobs_000.jpg')
                ,
        ];


        /**
         * @type {ImageBox[]}
         */
        const categoriesBottom = [
            ImageBox.create()
                .setText('Leather Fetish')
                .setClass('letfet')
                .setSource('cat_leather_fetish_000.jpg')
                ,
            ImageBox.create()
                .setText('Male Cum Swallowers')
                .setClass('malecum')
                .setSource('cat_male_cum_swallowers_000.jpg')
                ,
            ImageBox.create()
                .setText('Mixed Wrestling')
                .setClass('mixwre')
                .setSource('cat_mixed_wrestling_000.jpg')
                ,
            ImageBox.create()
                .setText('Pussy Eating')
                .setClass('puseat')
                .setSource('cat_pussy_eating_000.jpg')
                ,
            ImageBox.create()
                .setText('Redheads')
                .setSource('cat_redheads_000.jpg')
                ,
            ImageBox.create()
                .setText('Smoking')
                .setSource('cat_smoking_000.jpg')
                ,
            ImageBox.create()
                .setText('Taboo')
                .setSource('cat_taboo_000.jpg')
                ,
            ImageBox.create()
                .setText('Wrist Watch Fetish')
                .setClass('wwf')
                .setSource('cat_wrist_watch_fetish_000.jpg')
                ,
        ];


        /**
         * @type {ImageBox[]}
         */
        const categoriesBack = [
            ImageBox.create()
                .setText('Back<br>To All<br>Categories')
                .setClass('back')
                .setSource(null)
                .setCategory(null)
                ,
        ];


        function addCategories(container, category) {
            category.forEach((category) => { container.append(category.getElement()); });
        }

        addCategories(containerTop,    categoriesTop);
        addCategories(containerBottom, categoriesBottom);
        addCategories(containerBack,   categoriesBack);
    }


    handleEmailAddress()
    {
        $('.emailto').on(
            'click',
            (event) => {
                let link    = $(event.currentTarget),
                    email   = link.data('email'),
                    subject = link.data('subject');

                if (!email) {
                    console.log('Email data were not specified.');
                    return false;
                }

                email = 'mailto:' + email;

                if (subject) {
                    subject = '?subject=' + subject;
                } else {
                    subject = '';
                }

                window.location = email + subject;

                return false;
            }
        );
    }
}


const singleton = new Studio();


singleton.STUDIO_LOADED = 'studio-loaded';


export default singleton;

// config.js
// application configuration values

define(function () {

    // what stuff is called (affects urls and templates);
    var lexicon = {
        cast: 'report',
        collection: 'collection',
        user: 'user',
    };

    // register visualizations with the app
    // IMPORTANT currently, must also add subrouter paths to dependency array in loadRoutes.js 
    // TODO figure out how to only require the definition of routes in one place
    var visualizations = {
        map: {
            id: 'map', // id of element containing the visualization
            slug: 'map', // used to indentify the module in the app 
            routerPath:'MAP/MapRouter', // the path the visualization's subrouter
        },

        cast: {
            id: 'cast-viz', // id of element containing the visualization
            slug: 'cast', // used to indentify the module in the app
            routerPath: 'core/cast/CastRouter' // the path the visualization's subrouter
        },

        collection: {
            id: 'collection-viz', // id of element containing the visualization
            slug: lexicon.collection, // used to indentify the module in the app
            routerPath: 'core/collection/CollectionRouter', // the path the visualization's subrouter
        },

        user: {
            id: 'user-viz', // id of element containing the visualization
            slug: lexicon.user, // used to indentify the module in the app
            routerPath: 'core/user/UserRouter', // the path the visualization's subrouter
        },
    };

    // used to generate the site navigation
    var siteNavigation = {
            id: 'layer-switcher',
            items: {
                map: {
                    title: 'map',
                    slug: visualizations.map.slug, // tells the app which visualization to use
                    icon: 'icon-map-marker', // bootstrap icon class
                    gridUnits: 3, //out of 12
                },
                cast: {
                    title: 'people',
                    slug: visualizations.user.slug, // tells the app which visualization to use
                    icon: 'icon-user', // bootstrap icon class
                    gridUnits: 6, //out of 12
                    active: true, //will be selected on page load
                },
                anotherViz: {
                    title: 'cast',
                    slug: visualizations.cast.slug, // tells the app which visualization to use
                    icon: 'icon-globe', // bootstrap icon class
                    gridUnits: 3, //out of 12
                }
            } 
    };

    var config = {
        
        app: {
            id: 'locast-app', // the id of the element that contains the entire app
        },

        lexicon: lexicon,

        date: {
            momentMethod:'from', // http://momentjs.com/docs/#/displaying/
        },

        mediaUpload: {
            videomedia: {
                filters: {
                    title: 'Video file', 
                    extensions: '3gp,mp4,mov,mpg,mpeg',
                },
                maxFileSize: '100mb',            
            },
            imagemedia: {
                filters: {
                    title: 'Photo file', 
                    extensions: 'jpg,jpeg,png',
                },
                maxFileSize: '10mb',           
            },
        },

        visualization: visualizations,

        // configures user menu
        userMenu: {
            id: 'login-bar',
        },

        // configures site navigation
        navigation: siteNavigation,

        // TODO namespace these constants

        defaults: {
            map: MAP_DEFAULTS, 
        },

        url: {
            fullBase: FULL_BASE_URL,
            base: BASE_URL,
            media: MEDIA_URL,
            static: STATIC_URL,
            theme: THEME_URL,
            //flowplayerSwf: FLOWPLAYER_SWF,
            libs: STATIC_URL + 'js/libs',
            login: BASE_URL + '/login/',
        },

        api: {
            collection: COLLECTION_API_URL,
            cast: CAST_API_URL,
            user: USER_API_URL,
            me: USER_API_URL + 'me',
            geofeatures: FEATURES_API_URL,
            search: SEARCH_API_URL 
        }
    }
    
    return config;

});
